"use client";
import MouseLight from "@/src/components/MouseLight";
import AuthHeader from "@/components/ui/auth-header";
import GridBackground from "@/components/ui/grid-background";
import Content from "@/components/ui/content";
import Sidebar from "@/components/ui/sidebar";

export default function Dashboard() {
  return (
    <div className="relative flex min-h-screen flex-col bg-black overflow-hidden">
      <GridBackground />

      <MouseLight />

      <AuthHeader linkHref="/login" linkText="Login" />

      <main className="relative z-10 flex-1 flex items-start justify-center p-6">
        <div className="w-fit">
          <div className="rounded-lg p-6 flex gap-6">
            <div className="shrink-0">
              <Sidebar />
            </div>
            <div className="flex-1">
              <Content />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
