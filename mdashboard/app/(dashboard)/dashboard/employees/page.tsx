"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCompanyContext } from "@/contexts/CompanyContext";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { EmployeeForm } from "./employee-form";
import { EmployeeCard } from "./employee-card";
import { Employee, CreateEmployeeData, UpdateEmployeeData } from "@/lib/types";
import { useEmployeesContext } from "@/contexts/EmployeesContext";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export default function EmployeesPage() {
    const { isAuthenticated } = useAuthContext();
    const { company } = useCompanyContext();
    const router = useRouter();
    const {
        employees,
        isLoading,
        isMutating,
        error: fetchError,
        addEmployee,
        updateEmployee,
        removeEmployee,
    } = useEmployeesContext();

    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, router]);

    const handleAddEmployee = async (data: CreateEmployeeData) => {
        setError(null);
        try {
            await addEmployee(data);
            setShowForm(false);
        } catch (err: any) {
            setError(err?.message || "Failed to create employee");
        }
    };

    const handleUpdateEmployee = async (id: string, data: UpdateEmployeeData) => {
        setError(null);
        try {
            await updateEmployee(id, data);
            setEditingEmployee(null);
        } catch (err: any) {
            setError(err?.message || "Failed to update employee");
        }
    };

    const handleDeleteClick = (id: string) => {
        setEmployeeToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!employeeToDelete) return;
        setError(null);
        try {
            await removeEmployee(employeeToDelete);
        } catch (err: any) {
            setError(err?.message || "Failed to delete employee");
        } finally {
            setEmployeeToDelete(null);
        }
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="w-full flex flex-col h-full min-h-0">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 flex-none">
                <h1 className="text-white text-3xl font-bold">Employees</h1>
                <Button
                    onClick={() => {
                        setEditingEmployee(null);
                        setShowForm(!showForm);
                    }}
                    className="flex bg-white hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    Add Employee
                </Button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto space-y-6 pb-2">
                {/* Error Message */}
                {(error || fetchError) && (
                    <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-lg">
                        {error || fetchError}
                    </div>
                )}

                {/* Add/Edit Form */}
                {(showForm || editingEmployee) && (
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
                        <h2 className="text-white text-xl font-semibold mb-4">
                            {editingEmployee ? "Edit Employee" : "Add New Employee"}
                        </h2>
                        <EmployeeForm
                            initialData={editingEmployee || undefined}
                            onSubmit={
                                editingEmployee
                                    ? (data) => handleUpdateEmployee(editingEmployee.id, data)
                                    : (data) => handleAddEmployee(data as CreateEmployeeData)
                            }
                            onCancel={() => {
                                setShowForm(false);
                                setEditingEmployee(null);
                            }}
                            isSubmitting={isMutating}
                        />
                    </div>
                )}

                {/* Loading / Empty / List */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="w-12 h-12 rounded-lg" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-5 w-32" />
                                            <Skeleton className="h-4 w-24" />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3 mb-4">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                </div>
                                <div className="flex gap-2 pt-4 border-t border-zinc-800">
                                    <Skeleton className="h-10 flex-1" />
                                    <Skeleton className="h-10 w-10" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (employees?.length || 0) === 0 ? (
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-12 text-center ">
                        <p className="text-zinc-400 text-lg">
                            No employees yet. Add your first employee to get started.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-2">
                        {employees?.map((emp) => (
                            <EmployeeCard
                                key={emp.id}
                                employee={emp}
                                onEdit={() => setEditingEmployee(emp)}
                                onDelete={() => handleDeleteClick(emp.id)}
                                isDeleting={isMutating}
                            />
                        ))}
                    </div>
                )}
            </div>
            <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title="Delete Employee"
                description="Are you sure you want to delete this employee? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleDeleteConfirm}
                variant="destructive"
            />
        </div>
    );
}
