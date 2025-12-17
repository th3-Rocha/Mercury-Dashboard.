"use client";
import { useAuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCompanyContext } from "@/contexts/CompanyContext";
import { CompanyContextType } from "@/lib/types";
import { CompanySettingsForm } from "./company-settings-form";

export default function Company() {
  const { isAuthenticated } = useAuthContext();
  const { company, isLoading: contextLoading } = useCompanyContext();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  if (contextLoading) {
    return (
      <div className="w-full">
        <h1 className="text-white text-3xl font-bold mb-6">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h1 className="text-white text-3xl font-bold mb-6">
        Company Settings
      </h1>
      {company && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 mb-6">
          <h2 className="text-white text-xl font-semibold mb-4">Current Company Info</h2>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-zinc-400">Trade Name</dt>
              <dd className="text-white font-medium break-words">{company.tradeName}</dd>
            </div>
            <div>
              <dt className="text-zinc-400">Legal Name</dt>
              <dd className="text-white font-medium break-words">{company.legalName}</dd>
            </div>
            <div>
              <dt className="text-zinc-400">Tax ID</dt>
              <dd className="text-white font-medium break-words">{company.taxId}</dd>
            </div>
            <div>
              <dt className="text-zinc-400">Balance</dt>
              <dd className="text-white font-medium">${company.balance}</dd>
            </div>
            <div>
              <dt className="text-zinc-400">Support Email</dt>
              <dd className="text-white font-medium break-words">{company.supportEmail}</dd>
            </div>
            <div>
              <dt className="text-zinc-400">Main Phone</dt>
              <dd className="text-white font-medium break-words">{company.mainPhone}</dd>
            </div>
            <div>
              <dt className="text-zinc-400">Plan</dt>
              <dd className="text-white font-medium break-words">{company.subscriptionPlan}</dd>
            </div>
          </dl>
        </div>
      )}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
        <p className="text-zinc-400 mb-4">
          Update your company information below.
        </p>
        <CompanySettingsForm />
      </div>
    </div>
  );
}
