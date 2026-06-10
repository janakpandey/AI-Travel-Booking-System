"use client";

import { useState, useCallback } from "react";
import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero-section";
import DestinationGrid from "@/components/destination-grid";
import TripPlanner from "@/components/trip-planner";
import AgentPipeline from "@/components/agent-pipeline";
import ResultsSection from "@/components/results-section";
import Footer from "@/components/footer";
import { streamPlan, type Results, type SSEEvent } from "@/lib/api";

type AgentId = "flight_agent" | "hotel_agent" | "itinerary_agent" | "final_agent";
const PIPELINE_ORDER: AgentId[] = [
  "flight_agent",
  "hotel_agent",
  "itinerary_agent",
  "final_agent",
];

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [completedAgents, setCompletedAgents] = useState<string[]>([]);
  const [results, setResults] = useState<Results | null>(null);

  const handleGenerate = useCallback(async (query: string) => {
    if (!query.trim()) return;

    setLoading(true);
    setResults(null);
    setActiveAgent(null);
    setCompletedAgents([]);

    const collected: Results = {
      flight_results: "",
      hotel_results: "",
      itinerary: "",
      final_response: "",
      llm_calls: 0,
    };

    try {
      for await (const event of streamPlan(query)) {
        if (event.agent === "__done__") break;

        setActiveAgent(event.agent);
        setCompletedAgents((prev) =>
          prev.includes(event.agent) ? prev : [...prev, event.agent]
        );

        if (event.agent === "flight_agent" && event.data)
          collected.flight_results = event.data;
        if (event.agent === "hotel_agent" && event.data)
          collected.hotel_results = event.data;
        if (event.agent === "itinerary_agent" && event.data)
          collected.itinerary = event.data;
        if (event.agent === "final_agent" && event.data)
          collected.final_response = event.data;
        if (event.llm_calls !== undefined)
          collected.llm_calls = event.llm_calls;

        setResults({ ...collected });
      }
    } catch (err) {
      console.error("API error, falling back to demo data", err);
    }

    setActiveAgent(null);
    setLoading(false);
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <DestinationGrid />
        <TripPlanner onGenerate={handleGenerate} loading={loading} />
        <AgentPipeline activeAgent={activeAgent} completedAgents={completedAgents} />
        <ResultsSection results={results} loading={loading} />
      </main>
      <Footer />
    </>
  );
}
