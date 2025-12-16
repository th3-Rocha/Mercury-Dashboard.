"use client";

import Sidebar from "@/components/ui/sidebar";
import { useAuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="relative flex flex-col min-h-screen">
            <main className="relative z-10 flex-1 min-h-0 flex items-start justify-center p-2 sm:p-4 md:p-6">
                <div className="w-full h-full min-h-0">
                    <div className="rounded-lg p-2 sm:p-4 md:p-6 flex gap-2 sm:gap-4 md:gap-6 h-full min-h-0">
                        <div className="shrink-0 sticky top-12 self-start hidden lg:block">
                            <Sidebar />
                        </div>
                        <div className="lg:hidden">
                            <Sidebar />
                        </div>
                        <div className="flex-1 min-w-0 overflow-y-auto">
                            {children}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
