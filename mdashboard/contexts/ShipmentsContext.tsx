"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import useSWR from "swr";
import {
    ShipmentsContextType,
    Shipment,
    CreateShipmentData,
    UpdateShipmentData,
    ShipmentEvent,
} from "@/lib/types";
import {
    getShipments as apiGetShipments,
    createShipment as apiCreateShipment,
    updateShipment as apiUpdateShipment,
    deleteShipment as apiDeleteShipment,
    createShipmentEvent as apiCreateShipmentEvent,
    getShipmentEventsByShipmentId as apiGetShipmentEvents,
    deleteShipmentEvent as apiDeleteShipmentEvent,
} from "@/lib/api";
import { useAuthContext } from "./AuthContext";
import { useCompanyContext } from "./CompanyContext";

const ShipmentsContext = createContext<ShipmentsContextType | undefined>(undefined);

const fetcher = async () => {
    const res = await apiGetShipments();
    if (!res.success || !res.data) {
        throw new Error(res.error || "Failed to fetch shipments");
    }
    // Preload events for all shipments
    const shipmentsWithEvents = await Promise.all(
        res.data.map(async (shipment) => {
            try {
                const evRes = await apiGetShipmentEvents(shipment.id);
                if (evRes.success && evRes.data) {
                    const payload = evRes.data as any;
                    const events: ShipmentEvent[] = Array.isArray(payload)
                        ? payload
                        : Array.isArray(payload?.data)
                            ? payload.data
                            : Array.isArray(payload?.events)
                                ? payload.events
                                : [];
                    return { ...shipment, events };
                }
            } catch (e) {
                console.error(`Failed to fetch events for shipment ${shipment.id}:`, e);
            }
            return shipment;
        })
    );
    return shipmentsWithEvents;
};

export function ShipmentsProvider({ children }: { children: ReactNode }) {
    const { isAuthenticated } = useAuthContext();
    const { company } = useCompanyContext();
    const [isMutating, setIsMutating] = useState(false);

    const { data, error, isLoading, mutate } = useSWR<Shipment[] | null>(
        isAuthenticated && company?.id ? "shipments-data-key" : null,
        fetcher,
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
        }
    );

    const refreshShipments = async () => {
        await mutate();
    };

    const addShipment = async (payload: CreateShipmentData) => {
        setIsMutating(true);
        const res = await apiCreateShipment(payload);
        if (!res.success || !res.data) {
            setIsMutating(false);
            throw new Error(res.error || "Failed to create shipment");
        }
        await mutate((prev) => (prev ? [...prev, res.data!] : [res.data!]), false);
        setIsMutating(false);
    };

    const updateShipment = async (id: string, payload: UpdateShipmentData) => {
        setIsMutating(true);
        const res = await apiUpdateShipment(id, payload);
        if (!res.success || !res.data) {
            setIsMutating(false);
            throw new Error(res.error || "Failed to update shipment");
        }
        await mutate(
            (prev) => prev?.map((s) => (s.id === id ? res.data! : s)) || [],
            false
        );
        setIsMutating(false);
    };

    const removeShipment = async (id: string) => {
        setIsMutating(true);
        const res = await apiDeleteShipment(id);
        if (!res.success) {
            setIsMutating(false);
            throw new Error(res.error || "Failed to delete shipment");
        }
        await mutate((prev) => prev?.filter((s) => s.id !== id) || [], false);
        setIsMutating(false);
    };

    const loadShipmentEvents = async (shipmentId: string): Promise<ShipmentEvent[]> => {
        setIsMutating(true);
        try {
            const res = await apiGetShipmentEvents(shipmentId);
            console.log("[loadShipmentEvents] raw response:", JSON.stringify(res));

            if (!res.success) {
                console.error("[loadShipmentEvents] API error:", res.error);
                throw new Error(res.error || "Failed to fetch events");
            }

            // Extract events array from various possible response shapes
            const payload = res.data as any;
            let events: ShipmentEvent[] = [];

            if (Array.isArray(payload)) {
                events = payload;
            } else if (payload && typeof payload === "object") {
                // Try common envelope keys
                if (Array.isArray(payload.data)) {
                    events = payload.data;
                } else if (Array.isArray(payload.events)) {
                    events = payload.events;
                } else if (Array.isArray(payload.content)) {
                    events = payload.content;
                } else if (Array.isArray(payload.results)) {
                    events = payload.results;
                } else if (payload.data && Array.isArray(payload.data.events)) {
                    events = payload.data.events;
                } else if (payload.data && Array.isArray(payload.data.data)) {
                    events = payload.data.data;
                }
            }

            console.log("[loadShipmentEvents] parsed events count:", events.length);

            await mutate(
                (prev) => prev?.map((s) => (s.id === shipmentId ? { ...s, events } : s)) || [],
                false
            );
            return events;
        } finally {
            setIsMutating(false);
        }
    };

    const addShipmentEvent = async (
        shipmentId: string,
        eventData: { latitude: number; longitude: number; description: string; recordedAt: Date }
    ) => {
        setIsMutating(true);
        try {
            const res = await apiCreateShipmentEvent({
                shipmentId,
                latitude: eventData.latitude,
                longitude: eventData.longitude,
                description: eventData.description,
                recordedAt: eventData.recordedAt,
            });
            if (!res.success || !res.data) {
                throw new Error(res.error || "Failed to add event");
            }
            // Update local state: add new event to shipment
            const newEvent = res.data as ShipmentEvent;
            await mutate(
                (prev) => prev?.map((s) => {
                    if (s.id === shipmentId) {
                        return { ...s, events: [...(s.events || []), newEvent] };
                    }
                    return s;
                }) || [],
                false
            );
            return newEvent;
        } finally {
            setIsMutating(false);
        }
    };

    const deleteShipmentEvent = async (shipmentId: string, eventId: string) => {
        setIsMutating(true);
        try {
            const res = await apiDeleteShipmentEvent(eventId);
            if (!res.success) {
                throw new Error(res.error || "Failed to delete event");
            }
            // Update local state: remove event from shipment
            await mutate(
                (prev) => prev?.map((s) => {
                    if (s.id === shipmentId) {
                        return { ...s, events: (s.events || []).filter((e) => e.id !== eventId) };
                    }
                    return s;
                }) || [],
                false
            );
        } finally {
            setIsMutating(false);
        }
    };

    const contextValue: ShipmentsContextType = {
        shipments: data || null,
        isLoading,
        isMutating,
        error: error?.message || null,
        refreshShipments,
        addShipment,
        updateShipment,
        removeShipment,
        addShipmentEvent,
        deleteShipmentEvent,
        loadShipmentEvents,
    };

    return (
        <ShipmentsContext.Provider value={contextValue}>
            {children}
        </ShipmentsContext.Provider>
    );
}

export function useShipmentsContext() {
    const context = useContext(ShipmentsContext);
    if (context === undefined) {
        throw new Error("useShipmentsContext must be used within a ShipmentsProvider");
    }
    return context;
}
