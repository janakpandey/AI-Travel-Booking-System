# ✈️ AI Travel Booking System (Multi-Agent AI)

An intelligent AI-powered travel planning system built using **LangGraph multi-agent architecture**, **Groq LLM (LLaMA 3.3)**, **Streamlit frontend**, and real-time APIs for flights and web search.

The system automatically generates a complete travel plan including:

- ✈️ Flight options (AviationStack API)
- 🏨 Hotel suggestions (Tavily Search)
- 🗓️ Day-wise itinerary (LLM-generated)
- 🧠 Final optimized travel plan

---

# 🚀 Features

- 🧠 Multi-Agent AI system using LangGraph
- ✈️ Flight search using AviationStack API
- 🏨 Hotel recommendations using Tavily Search
- 🧳 AI-generated travel itinerary
- 💬 Persistent memory using PostgreSQL checkpointing
- ⚡ Groq LLaMA 3.3 70B for fast inference
- 🎨 Modern Streamlit UI with live agent visualization
- 📥 Downloadable travel plan (.md format)

---

# 🧱 System Architecture


User Query
↓
Flight Agent ✈️
↓
Hotel Agent 🏨
↓
Itinerary Agent 🗓️
↓
Final Agent 🧠
↓
Final Travel Plan Output


---

# 🛠️ Tech Stack

- **Frontend:** Streamlit  
- **Backend:** Python  
- **AI Model:** Groq LLaMA 3.3 70B (ChatGroq)  
- **Orchestration:** LangGraph  
- **Database:** PostgreSQL (Checkpoint Memory)  
- **APIs:**
  - AviationStack (Flight Data)
  - Tavily (Web Search)
- **Environment:** python-dotenv  

---

# 📁 Project Structure


.
├── main.py # LangGraph multi-agent backend

├── frontend.py # Streamlit UI

├── tools/

│ ├── flight_tool.py # Flight API integration

│ ├── tavily_tool.py # Web search tool

├── travel_plans/ # Saved generated plans

├── .env # API keys (NOT pushed to GitHub)

├── requirements.txt

└── README.md


---
# ▶️ Run the Project
Start Streamlit UI
streamlit run frontend.py
# 🧠 How It Works
User enters a travel query
Flight Agent fetches flight data
Hotel Agent searches hotels
Itinerary Agent builds a day-wise plan
Final Agent formats complete travel plan
Output is shown in UI and saved as markdown

# ⚙️ Installation

## 1. Clone repository
```bash
git clone https://github.com/your-username/AI-Travel-Booking-System.git
cd AI-Travel-Booking-System
2. Create virtual environment
python -m venv venv
venv\Scripts\activate   # Windows
3. Install dependencies
pip install -r requirements.txt
🔑 Environment Variables

Create a .env file in the root directory:

DATABASE_URL=postgresql://user:password@localhost:5432/dbname
AVIATIONSTACK_API_KEY=your_api_key
TAVILY_API_KEY=your_api_key
GROQ_API_KEY=your_api_key


