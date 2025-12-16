"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import useSWR from "swr";
import {
    TrucksContextType,
    Truck,
    CreateTruckData,
    UpdateTruckData,
} from "@/lib/types";
import {
    getTrucks as apiGetTrucks,
    createTruck as apiCreateTruck,
    updateTruck as apiUpdateTruck,
    deleteTruck as apiDeleteTruck,
} from "@/lib/api";
import { useAuthContext } from "./AuthContext";
import { useCompanyContext } from "./CompanyContext";

const TrucksContext = createContext<TrucksContextType | undefined>(undefined);

const fetcher = async () => {
    const res = await apiGetTrucks();
    if (!res.success || !res.data) {
        throw new Error(res.error || "Failed to fetch trucks");
    }
    return res.data;
};

export function TrucksProvider({ children }: { children: ReactNode }) {
    const { isAuthenticated } = useAuthContext();
    const { company } = useCompanyContext();
    const [isMutating, setIsMutating] = useState(false);

    const { data, error, isLoading, mutate } = useSWR<Truck[] | null>(
        isAuthenticated && company?.id ? "trucks-data-key" : null,
        fetcher,
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
        }
    );

    const refreshTrucks = async () => {
        await mutate();
    };

    const addTruck = async (payload: CreateTruckData) => {
        setIsMutating(true);
        const res = await apiCreateTruck(payload);
        if (!res.success || !res.data) {
            setIsMutating(false);
            throw new Error(res.error || "Failed to create truck");
        }
        await mutate((prev) => (prev ? [...prev, res.data!] : [res.data!]), false);
        setIsMutating(false);
    };

    const updateTruck = async (id: string, payload: UpdateTruckData) => {
        setIsMutating(true);
        const res = await apiUpdateTruck(id, payload);
        if (!res.success || !res.data) {
            setIsMutating(false);
            throw new Error(res.error || "Failed to update truck");
        }
        await mutate(
            (prev) => prev?.map((truck) => (truck.id === id ? res.data! : truck)) || [],
            false
        );
        setIsMutating(false);
    };

    const removeTruck = async (id: string) => {
        setIsMutating(true);
        const res = await apiDeleteTruck(id);
        if (!res.success) {
            setIsMutating(false);
            throw new Error(res.error || "Failed to delete truck");
        }
        await mutate((prev) => prev?.filter((truck) => truck.id !== id) || [], false);
        setIsMutating(false);
    };

    const contextValue: TrucksContextType = {
        trucks: data || null,
        isLoading,
        isMutating,
        error: error?.message || null,
        refreshTrucks,
        addTruck,
        updateTruck,
        removeTruck,
    };

    return <TrucksContext.Provider value={contextValue}>{children}</TrucksContext.Provider>;
}

export function useTrucksContext() {
    const context = useContext(TrucksContext);
    if (context === undefined) {
        throw new Error("useTrucksContext must be used within a TrucksProvider");
    }
    return context;
}
