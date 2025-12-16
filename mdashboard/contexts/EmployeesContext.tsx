"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import useSWR from "swr";
import {
    EmployeesContextType,
    Employee,
    CreateEmployeeData,
    UpdateEmployeeData,
} from "@/lib/types";
import {
    getEmployees as apiGetEmployees,
    createEmployee as apiCreateEmployee,
    updateEmployee as apiUpdateEmployee,
    deleteEmployee as apiDeleteEmployee,
} from "@/lib/api";
import { useAuthContext } from "./AuthContext";
import { useCompanyContext } from "./CompanyContext";

const EmployeesContext = createContext<EmployeesContextType | undefined>(undefined);

const fetcher = async () => {
    const res = await apiGetEmployees();
    if (!res.success || !res.data) {
        throw new Error(res.error || "Failed to fetch employees");
    }
    return res.data;
};

export function EmployeesProvider({ children }: { children: ReactNode }) {
    const { isAuthenticated } = useAuthContext();
    const { company } = useCompanyContext();
    const [isMutating, setIsMutating] = useState(false);

    const { data, error, isLoading, mutate } = useSWR<Employee[] | null>(
        isAuthenticated && company?.id ? "employees-data-key" : null,
        fetcher,
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
        }
    );

    const refreshEmployees = async () => {
        await mutate();
    };

    const addEmployee = async (payload: CreateEmployeeData) => {
        setIsMutating(true);
        const res = await apiCreateEmployee(payload);
        if (!res.success || !res.data) {
            setIsMutating(false);
            throw new Error(res.error || "Failed to create employee");
        }
        await mutate((prev) => (prev ? [...prev, res.data!] : [res.data!]), false);
        setIsMutating(false);
    };

    const updateEmployee = async (id: string, payload: UpdateEmployeeData) => {
        setIsMutating(true);
        const res = await apiUpdateEmployee(id, payload);
        if (!res.success || !res.data) {
            setIsMutating(false);
            throw new Error(res.error || "Failed to update employee");
        }
        await mutate(
            (prev) => prev?.map((emp) => (emp.id === id ? res.data! : emp)) || [],
            false
        );
        setIsMutating(false);
    };

    const removeEmployee = async (id: string) => {
        setIsMutating(true);
        const res = await apiDeleteEmployee(id);
        if (!res.success) {
            setIsMutating(false);
            throw new Error(res.error || "Failed to delete employee");
        }
        await mutate((prev) => prev?.filter((emp) => emp.id !== id) || [], false);
        setIsMutating(false);
    };

    const contextValue: EmployeesContextType = {
        employees: data || null,
        isLoading,
        isMutating,
        error: error?.message || null,
        refreshEmployees,
        addEmployee,
        updateEmployee,
        removeEmployee,
    };

    return (
        <EmployeesContext.Provider value={contextValue}>
            {children}
        </EmployeesContext.Provider>
    );
}

export function useEmployeesContext() {
    const context = useContext(EmployeesContext);
    if (context === undefined) {
        throw new Error("useEmployeesContext must be used within an EmployeesProvider");
    }
    return context;
}
