"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import useSWR from "swr";
import {
    BalanceContextType,
    BalanceEvent,
    CreateBalanceEventData,
    UpdateBalanceEventData,
} from "@/lib/types";
import {
    getBalanceEvents as apiGetBalanceEvents,
    createBalanceEvent as apiCreateBalanceEvent,
    updateBalanceEvent as apiUpdateBalanceEvent,
    deleteBalanceEvent as apiDeleteBalanceEvent,
} from "@/lib/api";
import { useAuthContext } from "./AuthContext";
import { useCompanyContext } from "./CompanyContext";

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

const fetcher = async () => {
    const res = await apiGetBalanceEvents();
    if (!res.success || !res.data) {
        throw new Error(res.error || "Failed to fetch balance events");
    }
    return res.data;
};

export function BalanceProvider({ children }: { children: ReactNode }) {
    const { isAuthenticated } = useAuthContext();
    const { company } = useCompanyContext();
    const [isMutating, setIsMutating] = useState(false);

    const { data, error, isLoading, mutate } = useSWR<BalanceEvent[] | null>(
        isAuthenticated && company?.id ? "balance-events-data-key" : null,
        fetcher,
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
        }
    );

    const refreshBalanceEvents = async () => {
        await mutate();
    };

    const addBalanceEvent = async (payload: CreateBalanceEventData) => {
        setIsMutating(true);
        const res = await apiCreateBalanceEvent(payload);
        if (!res.success || !res.data) {
            setIsMutating(false);
            throw new Error(res.error || "Failed to create balance event");
        }
        await mutate((prev) => (prev ? [...prev, res.data!] : [res.data!]), false);
        setIsMutating(false);
    };

    const updateBalanceEvent = async (id: string, payload: UpdateBalanceEventData) => {
        setIsMutating(true);
        const res = await apiUpdateBalanceEvent(id, payload);
        if (!res.success || !res.data) {
            setIsMutating(false);
            throw new Error(res.error || "Failed to update balance event");
        }
        await mutate(
            (prev) => prev?.map((ev) => (ev.id === id ? res.data! : ev)) || [],
            false
        );
        setIsMutating(false);
    };

    const removeBalanceEvent = async (id: string) => {
        setIsMutating(true);
        const res = await apiDeleteBalanceEvent(id);
        if (!res.success) {
            setIsMutating(false);
            throw new Error(res.error || "Failed to delete balance event");
        }
        await mutate((prev) => prev?.filter((ev) => ev.id !== id) || [], false);
        setIsMutating(false);
    };

    const contextValue: BalanceContextType = {
        balanceEvents: data || null,
        isLoading,
        isMutating,
        error: error?.message || null,
        refreshBalanceEvents,
        addBalanceEvent,
        updateBalanceEvent,
        removeBalanceEvent,
    };

    return (
        <BalanceContext.Provider value={contextValue}>
            {children}
        </BalanceContext.Provider>
    );
}

export function useBalanceContext() {
    const context = useContext(BalanceContext);
    if (context === undefined) {
        throw new Error("useBalanceContext must be used within a BalanceProvider");
    }
    return context;
}
