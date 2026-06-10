"use client";

interface ResultsData {
  flight_results: string;
  hotel_results: string;
  itinerary: string;
  final_response: string;
  llm_calls: number;
}

interface ResultsSectionProps {
  results: ResultsData | null;
  loading: boolean;
}

export default function ResultsSection({ results, loading }: ResultsSectionProps) {
  if (!results && !loading) return null;

  if (loading) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-3">
              <svg className="h-6 w-6 animate-spin text-amber-400" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="text-lg font-semibold text-zinc-300">Agents are planning your trip...</span>
            </div>
            <p className="text-sm text-zinc-500">
              Flight, hotel, itinerary, and final agents are working in parallel
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (!results) return null;

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="mb-6 text-center">
        <span className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">
          Complete
        </span>
        <h2 className="mt-2 text-3xl font-bold text-white">Your Travel Plan</h2>
      </div>

      {/* Metrics */}
      <div className="mb-8 grid grid-cols-3 gap-3 sm:gap-4">
        {[
          { label: "Agents", value: "4", icon: "🤖" },
          { label: "LLM Calls", value: String(results.llm_calls), icon: "⚡" },
          { label: "Status", value: "✅ Ready", icon: "" },
        ].map((m) => (
          <div
            key={m.label}
            className="glass-light rounded-xl border border-zinc-800 p-4 text-center"
          >
            <div className="text-2xl font-bold text-amber-400">{m.value}</div>
            <div className="mt-0.5 text-xs font-medium text-zinc-500">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Agent Results */}
      <div className="mb-6 space-y-4">
        {[
          { title: "✈️ Flights", content: results.flight_results, border: "border-l-sky-500" },
          { title: "🏨 Hotels", content: results.hotel_results, border: "border-l-emerald-500" },
          { title: "🗓️ Itinerary", content: results.itinerary, border: "border-l-amber-500" },
        ].map((section) => (
          <div
            key={section.title}
            className={`rounded-xl border border-zinc-800 border-l-4 ${section.border} bg-zinc-900/30 p-5`}
          >
            <h3 className="mb-2 text-sm font-bold text-white">{section.title}</h3>
            <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap text-zinc-400">
              {section.content || (
                <span className="italic text-zinc-600">No data returned</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Final Plan */}
      {results.final_response && (
        <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-zinc-900/80 via-zinc-900/50 to-zinc-900/80 p-6 shadow-xl shadow-amber-500/5 sm:p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.03] to-transparent" />
          <div className="relative z-[1]">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg">
                <span className="text-lg">🧠</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Final Travel Plan</h3>
                <p className="text-xs text-zinc-500">Compiled by the Final Agent</p>
              </div>
            </div>
            <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap leading-relaxed text-zinc-300">
              {results.final_response}
            </div>
          </div>
        </div>
      )}

      {/* Download */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Plan auto-saved to your history
        </div>
        <button
          onClick={() => {
            const content = [
              "# Travel Plan",
              "",
              "## ✈️ Flights",
              results.flight_results || "N/A",
              "",
              "## 🏨 Hotels",
              results.hotel_results || "N/A",
              "",
              "## 🗓️ Itinerary",
              results.itinerary || "N/A",
              "",
              "## 🧠 Final Plan",
              results.final_response || "N/A",
              "",
              "---",
              "*Generated by AeroPlanner*",
            ].join("\n");
            const blob = new Blob([content], { type: "text/markdown" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `travel-plan-${Date.now()}.md`;
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 transition-all hover:bg-zinc-700 hover:text-white"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Plan
        </button>
      </div>
    </section>
  );
}
