"use client";

const agents = [
  {
    id: "flight",
    icon: "✈️",
    name: "Flight Agent",
    desc: "Searches flights across providers for the best routes and prices",
    color: "from-sky-500 to-blue-600",
  },
  {
    id: "hotel",
    icon: "🏨",
    name: "Hotel Agent",
    desc: "Finds ideal accommodations matching your budget and preferences",
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: "itinerary",
    icon: "🗓️",
    name: "Itinerary Agent",
    desc: "Crafts a day-by-day schedule with activities and sightseeing",
    color: "from-amber-500 to-orange-600",
  },
  {
    id: "final",
    icon: "🧠",
    name: "Final Agent",
    desc: "Compiles everything into a polished, printable travel plan",
    color: "from-rose-500 to-pink-600",
  },
];

interface AgentPipelineProps {
  activeAgent: string | null;
  completedAgents: string[];
}

export default function AgentPipeline({
  activeAgent,
  completedAgents,
}: AgentPipelineProps) {
  return (
    <section id="pipeline" className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
      <div className="mb-10 text-center">
        <span className="text-xs font-semibold tracking-widest text-amber-400 uppercase">
          Architecture
        </span>
        <h2 className="mt-2 text-3xl font-bold text-white">
          Agent Pipeline
        </h2>
        <p className="mt-2 text-zinc-500">
          Four specialized AI agents collaborate to build your perfect trip
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {agents.map((agent, i) => {
          const isActive = activeAgent === agent.id;
          const isComplete = completedAgents.includes(agent.id);

          return (
            <div
              key={agent.id}
              className={`group relative overflow-hidden rounded-xl border p-5 transition-all duration-500 ${
                isActive
                  ? "border-amber-500/50 bg-amber-500/[0.04] shadow-lg shadow-amber-500/5"
                  : isComplete
                  ? "border-emerald-500/30 bg-emerald-500/[0.03]"
                  : "border-zinc-800 bg-zinc-900/30 hover:border-zinc-700"
              }`}
            >
              {isActive && (
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -inset-[100%] animate-gradient bg-gradient-to-r from-transparent via-amber-500/5 to-transparent" />
                </div>
              )}

              <div className="relative z-[1]">
                <div className="mb-3 flex items-center justify-between">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${agent.color} shadow-lg ${
                      isActive ? "animate-pulse-glow" : ""
                    }`}
                  >
                    <span className="text-lg">{agent.icon}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {isComplete && (
                      <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    {isActive && (
                      <span className="flex h-2 w-2">
                        <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-amber-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
                      </span>
                    )}
                    <span className="text-xs font-medium text-zinc-600">0{i + 1}</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white">{agent.name}</h3>
                <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                  {agent.desc}
                </p>
              </div>

              {i < agents.length - 1 && (
                <div className="absolute -right-3 top-1/2 hidden -translate-y-1/2 lg:block">
                  <svg className="h-5 w-5 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
