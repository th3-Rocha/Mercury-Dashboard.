"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useRef,
} from "react";

import { CompanyContextType } from "@/lib/types";
import { getCompanyData } from "@/lib/api";
import { CompanyStatus } from "@/lib/types";

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState<string>("");
  const [hexColor, setHexColor] = useState<string>("#000000");
  const [status, setStatus] = useState<CompanyStatus>(CompanyStatus.ACTIVE);
  const [walletBalance, setWalletBalance] = useState(0);

  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchCompany = useCallback(async () => {
    try {
      const res = await getCompanyData();

      if (isMounted.current && res.success && res.data) {
        setName(res.data.data.name);
        setStatus(res.data.data.status);
        setWalletBalance(Number(res.data.data.walletBalance));
        setHexColor(res.data.data.hexColor);
      }
    } catch (error) {
      console.error("Erro ao buscar empresa:", error);
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, []);

  // Mover a chamada para dentro de um useEffect separado
  useEffect(() => {
    if (isMounted.current) {
      fetchCompany();
    }
  }, [fetchCompany]);

  return (
    <CompanyContext.Provider
      value={{ name, status, walletBalance, hexColor, isLoading, fetchCompany }}
    >
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
