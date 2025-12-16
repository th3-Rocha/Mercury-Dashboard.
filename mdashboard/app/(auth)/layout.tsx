"use client";

import { Spinner } from "@/components/ui/spinner";
import { useAuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function AuthLayout({
    children,
}: {
    children: ReactNode;
}) {
    const { isAuthenticated, isChecking } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        if (!isChecking && isAuthenticated) {
            router.replace("/dashboard");
        }
    }, [isAuthenticated, isChecking, router]);

    if (isChecking || isAuthenticated) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Spinner className="size-6" />
            </div>
        );
    }

    return <>{children}</>;
}
