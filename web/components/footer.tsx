export default function Footer() {
  return (
    <footer className="border-t border-zinc-800/50 bg-zinc-950/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg">
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                </svg>
              </div>
              <span className="text-base font-bold text-white">
                Aero<span className="text-amber-400">Planner</span>
              </span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-zinc-500">
              Multi-agent AI travel system powered by LangGraph, Groq, and more.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-semibold tracking-widest text-zinc-400 uppercase">
              Agents
            </h4>
            <ul className="space-y-2">
              {["Flight Agent", "Hotel Agent", "Itinerary Agent", "Final Agent"].map((a) => (
                <li key={a}>
                  <span className="text-xs text-zinc-600">{a}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-semibold tracking-widest text-zinc-400 uppercase">
              Tech Stack
            </h4>
            <ul className="space-y-2">
              {["LangGraph", "Groq · LLaMA 3", "PostgreSQL", "Tavily Search", "AviationStack"].map(
                (t) => (
                  <li key={t}>
                    <span className="text-xs text-zinc-600">{t}</span>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-semibold tracking-widest text-zinc-400 uppercase">
              Resume Project
            </h4>
            <p className="text-xs leading-relaxed text-zinc-600">
              Built with Next.js 16, Tailwind CSS v4, TypeScript. Demonstrates
              multi-agent orchestration, parallel execution, and modern full-stack
              architecture.
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-zinc-800/50 pt-6 text-center">
          <p className="text-xs text-zinc-700">
            &copy; {new Date().getFullYear()} AeroPlanner &mdash; Multi-Agent AI Travel System
          </p>
        </div>
      </div>
    </footer>
  );
}
