"use client";
import Content from "@/components/ui/content";
import Sidebar from "@/components/ui/sidebar";

export default function Dashboard() {
  return (
    <div className="relative flex flex-col  overflow-hidden ">
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
