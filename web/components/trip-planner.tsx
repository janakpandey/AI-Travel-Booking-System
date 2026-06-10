"use client";

import { useState } from "react";

const quickTrips = [
  "7-day Japan under ₹2L",
  "Paris trip for 5 days",
  "Dubai weekend getaway",
  "Bali backpacking 10 days",
  "Rome & Amalfi Coast",
  "Thailand budget trip",
];

interface TripPlannerProps {
  onGenerate: (query: string) => void;
  loading: boolean;
}

export default function TripPlanner({ onGenerate, loading }: TripPlannerProps) {
  const [query, setQuery] = useState("");

  const handleQuick = (val: string) => {
    setQuery(val);
    const input = document.querySelector<HTMLTextAreaElement>("#trip-input");
    if (input) {
      input.value = val;
      input.style.height = "auto";
      input.style.height = `${input.scrollHeight}px`;
    }
  };

  return (
    <section id="planner" className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="mb-8 text-center">
        <span className="text-xs font-semibold tracking-widest text-amber-400 uppercase">
          Planner
        </span>
        <h2 className="mt-2 text-3xl font-bold text-white">Design Your Trip</h2>
        <p className="mt-2 text-zinc-500">
          Describe your dream vacation — our agents will handle the rest
        </p>
      </div>

      <div className="glass overflow-hidden rounded-2xl border border-zinc-800">
        <div className="border-b border-zinc-800 bg-zinc-800/20 px-5 py-3">
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
            <svg className="h-4 w-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Trip Description
          </div>
        </div>

        <div className="p-5">
          <div className="mb-4 flex flex-wrap gap-2">
            {quickTrips.map((trip) => (
              <button
                key={trip}
                onClick={() => handleQuick(trip)}
                className="rounded-full border border-zinc-700 bg-zinc-800/40 px-3.5 py-1.5 text-xs font-medium text-zinc-400 transition-all hover:border-amber-500/30 hover:bg-amber-500/5 hover:text-amber-300"
              >
                {trip}
              </button>
            ))}
          </div>

          <textarea
            id="trip-input"
            rows={4}
            placeholder="e.g. Plan a complete 7-day Japan trip including flights, hotels and sightseeing under ₹2 lakhs..."
            className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-800/20 p-4 text-sm text-zinc-200 placeholder-zinc-600 outline-none transition-all focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = `${el.scrollHeight}px`;
            }}
          />

          <div className="mt-4 flex items-center gap-4">
            <button
              onClick={() => onGenerate(query)}
              disabled={loading || !query.trim()}
              className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-amber-500/15 transition-all hover:shadow-amber-500/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Generate My Travel Plan
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </>
              )}
            </button>
            {query && (
              <button
                onClick={() => {
                  setQuery("");
                  const input = document.querySelector<HTMLTextAreaElement>("#trip-input");
                  if (input) {
                    input.value = "";
                    input.style.height = "auto";
                  }
                }}
                className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
