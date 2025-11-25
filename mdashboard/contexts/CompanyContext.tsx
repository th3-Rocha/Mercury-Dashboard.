"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { CompanyContextType } from "@/lib/types";
import { getCompanyData } from "@/lib/api";

import { Shipment } from "@/lib/types";

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ children }: { children: ReactNode }) {
  const [name, setName] = useState<string>("a");
  const [status, setStatus] = useState<"trial" | "active" | "suspended">(
    "trial"
  );
  const [walletBalance, setWalletBalance] = useState(0);

  useEffect(() => {
    async function fetchCompany() {
      const res = await getCompanyData();

      if (res.success && res.data) {
        setName(res.data.data.name);
        setStatus(res.data.data.status);
        setWalletBalance(Number(res.data.data.walletBalance));
      }
    }
    fetchCompany();
  }, []);

  return (
    <CompanyContext.Provider value={{ name, status, walletBalance }}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompanyContext() {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error("useCompanyContext must be used within an AuthProvider");
  }
  return context;
}
