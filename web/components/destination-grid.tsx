const destinations = [
  { name: "Tokyo", flag: "🇯🇵", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=75", desc: "Cherry blossoms & neon nights" },
  { name: "Paris", flag: "🇫🇷", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=75", desc: "City of light & love" },
  { name: "Bangkok", flag: "🇹🇭", image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400&q=75", desc: "Street food & temples" },
  { name: "Rome", flag: "🇮🇹", image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&q=75", desc: "Ancient history & pasta" },
  { name: "Dubai", flag: "🇦🇪", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=75", desc: "Future meets desert" },
  { name: "Bali", flag: "🇮🇩", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=75", desc: "Tropical paradise" },
];

export default function DestinationGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <span className="text-xs font-semibold tracking-widest text-amber-400 uppercase">
          Explore
        </span>
        <h2 className="mt-2 text-3xl font-bold text-white">
          Popular Destinations
        </h2>
        <p className="mt-2 text-zinc-500">
          Start typing a destination or pick one below
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
        {destinations.map((dest) => (
          <button
            key={dest.name}
            className="group relative aspect-[4/5] cursor-pointer overflow-hidden rounded-xl border border-zinc-800 transition-all duration-300 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/5"
            onClick={() => {
              const input = document.querySelector<HTMLTextAreaElement>("#trip-input");
              if (input) {
                input.value = `Plan a trip to ${dest.name}`;
                input.focus();
                input.dispatchEvent(new Event("input", { bubbles: true }));
              }
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={dest.image}
              alt={dest.name}
              className="absolute inset-0 h-full w-full object-cover brightness-75 transition-all duration-500 group-hover:scale-110 group-hover:brightness-90"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3 text-left">
              <div className="text-sm font-bold text-white">
                {dest.flag} {dest.name}
              </div>
              <div className="mt-0.5 text-xs text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100">
                {dest.desc}
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
