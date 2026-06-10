"use client";

import { useState, useCallback } from "react";
import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero-section";
import DestinationGrid from "@/components/destination-grid";
import TripPlanner from "@/components/trip-planner";
import AgentPipeline from "@/components/agent-pipeline";
import ResultsSection from "@/components/results-section";
import Footer from "@/components/footer";

type AgentId = "flight" | "hotel" | "itinerary" | "final";
const AGENT_IDS: AgentId[] = ["flight", "hotel", "itinerary", "final"];

interface Results {
  flight_results: string;
  hotel_results: string;
  itinerary: string;
  final_response: string;
  llm_calls: number;
}

const SAMPLE_RESULTS: Results = {
  flight_results:
    "**✈️ Japan Round Trip**\n\n- **Tokyo Narita (NRT)** — Departure: 15 Oct 2026\n  - *ANA* NH 801 → ₹38,200 (Economy)\n  - *Japan Airlines* JL 002 → ₹42,500 (Premium Eco)\n- **Osaka KIX → Mumbai** — Return: 22 Oct 2026\n  - *IndiGo* 6E 1014 → ₹29,800 (Economy)\n  - *ANA* NH 847 → ₹52,000 (Business)\n\n**💡 Best Value:** IndiGo 6E 1014 at ₹29,800 — direct flight, good timing.",
  hotel_results:
    "**🏨 Stay Options**\n\n| Hotel | Location | Rating | Price/Night |\n|-------|----------|--------|-------------|\n| The Mitsui | Tokyo | ⭐ 4.8 | ₹18,500 |\n| Hotel Gajoen | Tokyo | ⭐ 4.6 | ₹12,200 |\n| Cross Hotel | Osaka | ⭐ 4.5 | ₹9,800 |\n| MIMARU Suites | Kyoto | ⭐ 4.7 | ₹11,400 |\n\n**💰 Total (7 nights):** ₹76,300 — mix of luxury & mid-range.",
  itinerary:
    "**🗓️ 7-Day Japan Itinerary**\n\n**Day 1-3: Tokyo**\n- Day 1: Arrive NRT → Shibuya & Shinjuku evening walk\n- Day 2: Tsukiji Outer Market → Senso-ji → Akihabara\n- Day 3: Meiji Shrine → Harajuku → Shibuya Sky\n\n**Day 4: Hakone**\n- Day trip: Hakone Loop → Onsen → Mt. Fuji view\n\n**Day 5-6: Kyoto**\n- Day 5: Shinkansen to Kyoto → Fushimi Inari → Nishiki Market\n- Day 6: Arashiyama Bamboo → Kinkaku-ji → Gion walk\n\n**Day 7: Osaka**\n- Namba → Dotonbori → Osaka Castle → KIX departure",
  final_response:
    "## 🌟 Your Complete Japan Adventure\n\n**🗓️ 15–22 October 2026 · 7 Days**\n\n### Trip Summary\n| Component | Details | Cost |\n|-----------|---------|------|\n| ✈️ Flights | Mumbai → Tokyo · Osaka → Mumbai | **₹68,000** |\n| 🏨 Hotels | 7 nights mixed category | **₹76,300** |\n| 🚄 Transport | Shinkansen + local IC cards | **₹22,000** |\n| 🍜 Food & Activities | ~₹5,000/day | **₹35,000** |\n| **Total Estimate** | | **~₹2,01,300** |\n\n### ✨ Highlights\n- **Tokyo:** 3 days exploring Shibuya, Akihabara & Asakusa\n- **Hakone:** Onsen day trip with iconic Mt. Fuji views\n- **Kyoto:** 2 days of temples, bamboo groves & geisha streets\n- **Osaka:** Final night in Dotonbori's electric food scene\n\n### ⚡ Pro Tips\n- Book Shinkansen tickets 3 days ahead via SmartEX\n- Get a Suica/Pasmo card at the airport for local transit\n- Visit Fushimi Inari at 7 AM to avoid crowds\n- Carry cash — many smaller spots in Kyoto are cash-only\n\n*All prices are estimates in INR. Book early for best rates.* 🎌",
  llm_calls: 12,
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

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

    for (const agentId of AGENT_IDS) {
      setActiveAgent(agentId);
      await sleep(1200 + Math.random() * 800);
      setCompletedAgents((prev) => [...prev, agentId]);
    }

    setActiveAgent(null);
    await sleep(400);
    setResults(SAMPLE_RESULTS);
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
