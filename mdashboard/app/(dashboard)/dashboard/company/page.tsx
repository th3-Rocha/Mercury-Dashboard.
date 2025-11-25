"use client";
import MouseLight from "@/src/components/MouseLight";
import AuthHeader from "@/components/ui/auth-header";
import GridBackground from "@/components/ui/grid-background";
import { useAuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Company() {
  const { isAuthenticated } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="relative flex min-h-screen flex-col bg-black overflow-hidden">
      <GridBackground />
      <MouseLight />
      <AuthHeader linkHref="/login" linkText="Login" />

      <main className="relative z-10 flex-1 flex items-start justify-center p-6">
        <div className="w-full max-w-4xl">
          <h1 className="text-white text-3xl font-bold mb-6">
            Company Settings
          </h1>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
            <p className="text-zinc-400">
              Manage your company information and settings.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
