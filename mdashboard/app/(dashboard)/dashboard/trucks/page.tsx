"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCompanyContext } from "@/contexts/CompanyContext";
import { CreateTruckData, UpdateTruckData, Truck } from "@/lib/types";
import { useTrucksContext } from "@/contexts/TrucksContext";
import { TruckForm } from "./truck-form";
import { TruckCard } from "./truck-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";


export default function TrucksPage() {
    const { isAuthenticated } = useAuthContext();
    const { company } = useCompanyContext();
    const router = useRouter();
    const {
        trucks,
        isLoading,
        isMutating,
        error: fetchError,
        addTruck,
        updateTruck,
        removeTruck,
    } = useTrucksContext();

    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingTruck, setEditingTruck] = useState<Truck | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [truckToDelete, setTruckToDelete] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/");
        }
    }, [isAuthenticated, router]);

    const handleAddTruck = async (data: CreateTruckData) => {
        setError(null);
        try {
            await addTruck(data);
            setShowForm(false);
        } catch (err: any) {
            setError(err?.message || "Failed to create truck");
        }
    };

    const handleUpdateTruck = async (id: string, data: UpdateTruckData) => {
        setError(null);
        try {
            await updateTruck(id, data);
            setEditingTruck(null);
        } catch (err: any) {
            setError(err?.message || "Failed to update truck");
        }
    };

    const handleDeleteClick = (id: string) => {
        setTruckToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!truckToDelete) return;

        setError(null);
        try {
            await removeTruck(truckToDelete);
        } catch (err: any) {
            setError(err?.message || "Failed to delete truck");
        } finally {
            setTruckToDelete(null);
        }
    };

    const handleCancelEdit = () => {
        setEditingTruck(null);
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="w-full flex flex-col h-full min-h-0">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 flex-none">
                <h1 className="text-white text-3xl font-bold">Trucks</h1>
                <Button
                    onClick={() => {
                        setEditingTruck(null);
                        setShowForm(!showForm);
                    }}
                    className="flex bg-white hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    Add Truck
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
                {(showForm || editingTruck) && (
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
                        <h2 className="text-white text-xl font-semibold mb-4">
                            {editingTruck ? "Edit Truck" : "Add New Truck"}
                        </h2>
                        <TruckForm
                            initialData={editingTruck || undefined}
                            onSubmit={
                                editingTruck
                                    ? (data) => handleUpdateTruck(editingTruck.id, data)
                                    : (data) =>
                                        handleAddTruck({
                                            licensePlate: data.licensePlate!,
                                            maxPayload: data.maxPayload!,
                                        })
                            }
                            onCancel={() => {
                                setShowForm(false);
                                setEditingTruck(null);
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
                                    <Skeleton className="h-6 w-16 rounded" />
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
                ) : (trucks?.length || 0) === 0 ? (
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-12 text-center ">
                        <p className="text-zinc-400 text-lg">
                            No trucks yet. Add your first truck to get started.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-2">
                        {trucks?.map((truck) => (
                            <TruckCard
                                key={truck.id}
                                truck={truck}
                                onEdit={() => setEditingTruck(truck)}
                                onDelete={() => handleDeleteClick(truck.id)}
                                isDeleting={isMutating}
                            />
                        ))}
                    </div>
                )}
            </div>
            <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title="Delete Truck"
                description="Are you sure you want to delete this truck? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleDeleteConfirm}
                variant="destructive"
            />
        </div>
    );
}
