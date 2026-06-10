import os
import json
import asyncio
from typing import TypedDict, Annotated, AsyncGenerator
import operator

import psycopg
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.postgres import PostgresSaver
from langchain_core.messages import AnyMessage, HumanMessage, AIMessage, SystemMessage
from langchain_groq import ChatGroq

from tools.tavily_tool import tavily_search
from tools.flight_tool import search_flights

load_dotenv()

app = FastAPI(title="AeroPlanner API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# LLM & Graph
# ---------------------------------------------------------------------------
llm = ChatGroq(model="llama-3.3-70b-versatile")
DATABASE_URL = os.getenv("DATABASE_URL")


class TravelState(TypedDict):
    messages: Annotated[list[AnyMessage], operator.add]
    user_query: str
    flight_results: str
    hotel_results: str
    itinerary: str
    llm_calls: int


def flight_agent(state: TravelState):
    query = state["user_query"]
    flight_data = search_flights(query)
    return {
        "flight_results": flight_data,
        "messages": [AIMessage(content="Flight results fetched")],
        "llm_calls": state.get("llm_calls", 0) + 1,
    }


def hotel_agent(state: TravelState):
    query = f"Best Hotels for {state['user_query']}"
    hotel_results = tavily_search(query)
    return {
        "hotel_results": hotel_results,
        "messages": [AIMessage(content="Hotel information fetched")],
        "llm_calls": state.get("llm_calls", 0) + 1,
    }


def itinerary_agent(state: TravelState):
    prompt = f"""
    Create a travel itinerary.
    User Query: {state['user_query']}
    Flight results: {state['flight_results']}
    Hotel Results: {state['hotel_results']}
    """
    response = llm.invoke([
        SystemMessage(content="You are an expert travel planner"),
        HumanMessage(content=prompt),
    ])
    return {
        "itinerary": response.content,
        "messages": [response],
        "llm_calls": state.get("llm_calls", 0) + 1,
    }


def final_agent(state: TravelState):
    final_prompt = f"""
    Generate final travel response.
    Flights: {state['flight_results']}
    Hotels: {state['hotel_results']}
    Itinerary: {state['itinerary']}
    """
    response = llm.invoke([HumanMessage(content=final_prompt)])
    return {
        "messages": [response],
        "llm_calls": state.get("llm_calls", 0) + 1,
    }


def build_graph():
    graph = StateGraph(TravelState)
    graph.add_node("flight_agent", flight_agent)
    graph.add_node("hotel_agent", hotel_agent)
    graph.add_node("itinerary_agent", itinerary_agent)
    graph.add_node("final_agent", final_agent)
    graph.add_edge(START, "flight_agent")
    graph.add_edge("flight_agent", "hotel_agent")
    graph.add_edge("hotel_agent", "itinerary_agent")
    graph.add_edge("itinerary_agent", "final_agent")
    graph.add_edge("final_agent", END)

    checkpointer = None
    if DATABASE_URL:
        try:
            _conn = psycopg.connect(DATABASE_URL)
            _conn.autocommit = True
            checkpointer = PostgresSaver(_conn)
            checkpointer.setup()
        except Exception:
            checkpointer = None

    return graph.compile(checkpointer=checkpointer)


graph_app = build_graph()


# ---------------------------------------------------------------------------
# API Models
# ---------------------------------------------------------------------------
class PlanRequest(BaseModel):
    query: str
    thread_id: str = "default"


class PlanResponse(BaseModel):
    flight_results: str = ""
    hotel_results: str = ""
    itinerary: str = ""
    final_response: str = ""
    llm_calls: int = 0


# ---------------------------------------------------------------------------
# SSE streaming endpoint
# ---------------------------------------------------------------------------
AGENT_ORDER = ["flight_agent", "hotel_agent", "itinerary_agent", "final_agent"]
AGENT_LABELS = {
    "flight_agent": "Flight Agent",
    "hotel_agent": "Hotel Agent",
    "itinerary_agent": "Itinerary Agent",
    "final_agent": "Final Agent",
}


async def event_stream(query: str, thread_id: str) -> AsyncGenerator[str, None]:
    config = {"configurable": {"thread_id": thread_id}}

    for chunk in graph_app.stream(
        {
            "messages": [HumanMessage(content=query)],
            "user_query": query,
            "flight_results": "",
            "hotel_results": "",
            "itinerary": "",
            "llm_calls": 0,
        },
        config=config,
        stream_mode="updates",
    ):
        for node_name, state_update in chunk.items():
            payload: dict = {"agent": node_name, "label": AGENT_LABELS.get(node_name, node_name)}

            if node_name == "flight_agent":
                payload["data"] = state_update.get("flight_results", "")
            elif node_name == "hotel_agent":
                payload["data"] = state_update.get("hotel_results", "")
            elif node_name == "itinerary_agent":
                payload["data"] = state_update.get("itinerary", "")
            elif node_name == "final_agent":
                msgs = state_update.get("messages", [])
                payload["data"] = msgs[-1].content if msgs else ""

            payload["llm_calls"] = state_update.get("llm_calls", 0)
            yield f"data: {json.dumps(payload)}\n\n"

    yield "data: {\"agent\": \"__done__\"}\n\n"


@app.post("/api/plan", response_model=None)
async def plan_trip(req: PlanRequest):
    if not req.query.strip():
        raise HTTPException(400, "Query is required")
    return StreamingResponse(
        event_stream(req.query, req.thread_id),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


# ---------------------------------------------------------------------------
# Non-streaming fallback
# ---------------------------------------------------------------------------
@app.post("/api/plan/sync", response_model=PlanResponse)
async def plan_trip_sync(req: PlanRequest):
    if not req.query.strip():
        raise HTTPException(400, "Query is required")

    config = {"configurable": {"thread_id": req.thread_id}}
    collected: PlanResponse = PlanResponse()

    for chunk in graph_app.stream(
        {
            "messages": [HumanMessage(content=req.query)],
            "user_query": req.query,
            "flight_results": "",
            "hotel_results": "",
            "itinerary": "",
            "llm_calls": 0,
        },
        config=config,
        stream_mode="updates",
    ):
        for node_name, state_update in chunk.items():
            if node_name == "flight_agent":
                collected.flight_results = state_update.get("flight_results", "")
            elif node_name == "hotel_agent":
                collected.hotel_results = state_update.get("hotel_results", "")
            elif node_name == "itinerary_agent":
                collected.itinerary = state_update.get("itinerary", "")
            elif node_name == "final_agent":
                msgs = state_update.get("messages", [])
                collected.final_response = msgs[-1].content if msgs else ""
            collected.llm_calls = state_update.get("llm_calls", collected.llm_calls)

    return collected


# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------
@app.get("/health")
async def health():
    db_ok = False
    if DATABASE_URL:
        try:
            conn = psycopg.connect(DATABASE_URL)
            conn.close()
            db_ok = True
        except Exception:
            pass
    return {"status": "ok", "database": "connected" if db_ok else "unavailable"}
