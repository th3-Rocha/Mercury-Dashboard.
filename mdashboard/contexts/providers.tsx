"use client";

import { CompanyProvider } from "@/contexts/CompanyContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { TrucksProvider } from "@/contexts/TrucksContext";
import { EmployeesProvider } from "@/contexts/EmployeesContext";
import { RecipientsProvider } from "@/contexts/RecipientsContext";
import { ShipmentsProvider } from "@/contexts/ShipmentsContext";
import { BalanceProvider } from "@/contexts/BalanceContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CompanyProvider>
        <BalanceProvider>
          <TrucksProvider>
            <EmployeesProvider>
              <RecipientsProvider>
                <ShipmentsProvider>{children}</ShipmentsProvider>
              </RecipientsProvider>
            </EmployeesProvider>
          </TrucksProvider>
        </BalanceProvider>
      </CompanyProvider>
    </AuthProvider>
  );
}
