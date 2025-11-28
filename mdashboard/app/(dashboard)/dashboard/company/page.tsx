"use client";
import { useAuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCompanyContext } from "@/contexts/CompanyContext";
import { CompanyContextType } from "@/lib/types";

export default function Company() {
  const { isAuthenticated } = useAuthContext();
  const { name, hexColor, status, walletBalance } = useCompanyContext();
  const router = useRouter();
  const [companyData, setCompanyData] = useState<CompanyContextType>({
    id: "1",
    name: name,
    status: status,
    walletBalance: walletBalance,
    hexColor: hexColor,
    isLoading: false,
    fetchCompany: async () => {},
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleFormSubmit = async (data: CompanyContextType) => {
    setIsLoading(true);
    console.log("Formulário enviado:", data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setCompanyData(data);
    setIsLoading(false);
    alert("Informações da empresa salvas com sucesso!");
  };

  return (
    <div className="relative flex  flex-col overflow-hidden">
      <main className="relative z-10 flex-1 flex items-start justify-center p-6">
        <div className="w-full max-w-4xl">
          <h1 className="text-white text-3xl font-bold mb-6">
            Company Settings
          </h1>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
            <p className="text-zinc-400 mb-4">
              Manage your company information and settings.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
