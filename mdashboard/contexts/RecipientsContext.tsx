"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import useSWR from "swr";
import {
    RecipientsContextType,
    Recipient,
    CreateRecipientData,
    UpdateRecipientData,
} from "@/lib/types";
import {
    getRecipients as apiGetRecipients,
    createRecipient as apiCreateRecipient,
    updateRecipient as apiUpdateRecipient,
    deleteRecipient as apiDeleteRecipient,
} from "@/lib/api";
import { useAuthContext } from "./AuthContext";
import { useCompanyContext } from "./CompanyContext";

const RecipientsContext = createContext<RecipientsContextType | undefined>(undefined);

const fetcher = async () => {
    const res = await apiGetRecipients();
    if (!res.success || !res.data) {
        throw new Error(res.error || "Failed to fetch recipients");
    }
    return res.data;
};

export function RecipientsProvider({ children }: { children: ReactNode }) {
    const { isAuthenticated } = useAuthContext();
    const { company } = useCompanyContext();
    const [isMutating, setIsMutating] = useState(false);

    const { data, error, isLoading, mutate } = useSWR<Recipient[] | null>(
        isAuthenticated && company?.id ? "recipients-data-key" : null,
        fetcher,
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
        }
    );

    const refreshRecipients = async () => {
        await mutate();
    };

    const addRecipient = async (payload: CreateRecipientData) => {
        setIsMutating(true);
        const res = await apiCreateRecipient(payload);
        if (!res.success || !res.data) {
            setIsMutating(false);
            throw new Error(res.error || "Failed to create recipient");
        }
        await mutate((prev) => (prev ? [...prev, res.data!] : [res.data!]), false);
        setIsMutating(false);
    };

    const updateRecipient = async (id: string, payload: UpdateRecipientData) => {
        setIsMutating(true);
        const res = await apiUpdateRecipient(id, payload);
        if (!res.success || !res.data) {
            setIsMutating(false);
            throw new Error(res.error || "Failed to update recipient");
        }
        await mutate(
            (prev) => prev?.map((rec) => (rec.id === id ? res.data! : rec)) || [],
            false
        );
        setIsMutating(false);
    };

    const removeRecipient = async (id: string) => {
        setIsMutating(true);
        const res = await apiDeleteRecipient(id);
        if (!res.success) {
            setIsMutating(false);
            throw new Error(res.error || "Failed to delete recipient");
        }
        await mutate((prev) => prev?.filter((rec) => rec.id !== id) || [], false);
        setIsMutating(false);
    };

    const contextValue: RecipientsContextType = {
        recipients: data || null,
        isLoading,
        isMutating,
        error: error?.message || null,
        refreshRecipients,
        addRecipient,
        updateRecipient,
        removeRecipient,
    };

    return (
        <RecipientsContext.Provider value={contextValue}>
            {children}
        </RecipientsContext.Provider>
    );
}

export function useRecipientsContext() {
    const context = useContext(RecipientsContext);
    if (context === undefined) {
        throw new Error("useRecipientsContext must be used within a RecipientsProvider");
    }
    return context;
}
