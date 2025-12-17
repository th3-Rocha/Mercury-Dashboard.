"use client";

import { createContext, useContext, ReactNode, useState } from "react";
import useSWR from "swr";
import { CompanyContextType, Company, UpdateCompanyData } from "@/lib/types";
import { getCompanyData, updateCompany as apiUpdateCompany } from "@/lib/api";
import { useAuthContext } from "./AuthContext";

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

const fetcher = async () => {
  const res = await getCompanyData();
  if (!res.success || !res.data) {
    throw new Error(res.error || "Failed to fetch company data");
  }
  return res.data;
};

export function CompanyProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuthContext();

  const { data, error, isLoading, mutate } = useSWR<Company | null>(
    isAuthenticated ? "company-data-key" : null,
    fetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  );

  const updateCompany = async (updateData: UpdateCompanyData) => {
    const res = await apiUpdateCompany(updateData);
    if (res.success) {
      await mutate();
    } else {
      throw new Error(res.error || "Failed to update company");
    }
  };

  const clearCompany = async () => {
    await mutate(null, false);
  };

  const contextValue: CompanyContextType = {
    company: data || null,
    isLoading,
    error: error?.message || null,
    fetchCompany: async () => void mutate(),
    updateCompany,
    clearCompany,
  };

  return (
    <CompanyContext.Provider value={contextValue}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompanyContext() {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error("useCompanyContext must be used within a CompanyProvider");
  }
  return context;
}
