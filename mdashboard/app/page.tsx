import MouseLight from "@/src/components/MouseLight";
import ApiHealth from "@/components/ui/api-health";
export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col bg-black overflow-hidden">
      {/* Grid Background */}
      <div
        className="absolute inset-0 bg-black"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Radial Light Effect - Follows Mouse */}
      <MouseLight />

      {/* Header */}
      <header className="relative z-10 border-b border-zinc-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
              <span className="text-black font-bold text-lg">M</span>
            </div>
            <span className="text-white font-semibold text-xl">Mercury</span>
          </div>

          <button className="px-6 py-2 bg-white text-black cursor-pointer font-medium rounded-lg hover:bg-zinc-200 transition-colors">
            Login
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 flex flex-1  flex-col items-center justify-center text-center p-8 max-w-4xl mx-auto">
        <div className="mb-8 inline-block px-4 py-2 rounded-full bg-zinc-800/50 border border-zinc-700">
          <span className="text-sm text-zinc-300">Administrative Panel</span>
        </div>

        <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 tracking-tight">
          Mercury Dashboard
        </h1>

        <p className="text-lg md:text-xl text-zinc-400 mb-8 max-w-2xl leading-relaxed">
          Administrative panel focused on performance, user experience and
          direct integration with Mercury API built with Laravel and PHP. A
          fast, responsive interface fully connected to the backend.
        </p>

        <div className="flex items-center gap-4 mb-8">
          <button className="group relative px-8 cursor-pointer py-4 bg-white text-black font-semibold rounded-3xl hover:bg-zinc-200 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105">
            <span className="flex items-center gap-2">
              Sign Up
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
          </button>
        </div>
        <ApiHealth />
      </main>
    </div>
  );
}
