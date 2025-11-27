import MouseLight from "@/src/components/MouseLight";
import ApiHealth from "@/components/ui/api-health";
import Link from "next/link";
import GridBackground from "@/components/ui/grid-background";
import AuthHeader from "@/components/ui/auth-header";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col bg-black overflow-hidden ">
      <GridBackground />

      <MouseLight />

      <AuthHeader linkHref="/login" linkText="Login" />

      <main className="relative z-10 flex flex-1  flex-col items-center justify-start text-center p-8 max-w-4xl mx-auto">
        <div className="mb-8 inline-block px-4 py-2 rounded-full bg-zinc-800/50 border border-zinc-700">
          <span className="text-sm text-zinc-300">Administrative Panel</span>
        </div>

        <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 tracking-tight">
          Mercury Fleet
        </h1>

        <p className="text-lg md:text-xl text-zinc-400 mb-8 max-w-2xl leading-relaxed">
          Mercury Fleet is a high-performance Transportation Management System
          (TMS).
        </p>

        <div className="flex items-center gap-4 mb-8 mt-10">
          <Link
            href="/register"
            className="group relative px-8 cursor-pointer py-4 bg-white text-black font-semibold rounded-3xl hover:bg-zinc-200 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <span className="flex items-center gap-2 ">
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
          </Link>
        </div>
        <ApiHealth />
      </main>
    </div>
  );
}
