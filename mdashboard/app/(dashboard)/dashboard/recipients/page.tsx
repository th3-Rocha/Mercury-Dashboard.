"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCompanyContext } from "@/contexts/CompanyContext";
import { Recipient, CreateRecipientData, UpdateRecipientData } from "@/lib/types";
import { useRecipientsContext } from "@/contexts/RecipientsContext";
import { RecipientForm } from "./recipient-form";
import { RecipientCard } from "./recipient-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export default function RecipientsPage() {
    const { isAuthenticated } = useAuthContext();
    const { company } = useCompanyContext();
    const router = useRouter();
    const {
        recipients,
        isLoading,
        isMutating,
        error: fetchError,
        addRecipient,
        updateRecipient,
        removeRecipient,
    } = useRecipientsContext();

    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingRecipient, setEditingRecipient] = useState<Recipient | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [recipientToDelete, setRecipientToDelete] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, router]);

    const handleAddRecipient = async (data: CreateRecipientData) => {
        setError(null);
        try {
            await addRecipient(data);
            setShowForm(false);
        } catch (err: any) {
            setError(err?.message || "Failed to create recipient");
        }
    };

    const handleUpdateRecipient = async (id: string, data: UpdateRecipientData) => {
        setError(null);
        try {
            await updateRecipient(id, data);
            setEditingRecipient(null);
        } catch (err: any) {
            setError(err?.message || "Failed to update recipient");
        }
    };

    const handleDeleteClick = (id: string) => {
        setRecipientToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!recipientToDelete) return;

        setError(null);
        try {
            await removeRecipient(recipientToDelete);
        } catch (err: any) {
            setError(err?.message || "Failed to delete recipient");
        } finally {
            setRecipientToDelete(null);
        }
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="w-full flex flex-col h-full min-h-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0 flex-none">
                <h1 className="text-white text-2xl sm:text-3xl font-bold">Recipients</h1>
                <Button
                    onClick={() => {
                        setEditingRecipient(null);
                        setShowForm(!showForm);
                    }}
                    className="flex bg-white hover:bg-gray-100 disabled:opacity-50 cursor-pointer w-full sm:w-auto justify-center"
                >
                    <Plus className="w-4 h-4" />
                    Add Recipient
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
                {(showForm || editingRecipient) && (
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
                        <h2 className="text-white text-xl font-semibold mb-4">
                            {editingRecipient ? "Edit Recipient" : "Add New Recipient"}
                        </h2>
                        <RecipientForm
                            initialData={editingRecipient || undefined}
                            onSubmit={
                                editingRecipient
                                    ? (data) => handleUpdateRecipient(editingRecipient.id, data)
                                    : (data) => handleAddRecipient(data)
                            }
                            onCancel={() => {
                                setShowForm(false);
                                setEditingRecipient(null);
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
                ) : (recipients?.length || 0) === 0 ? (
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-12 text-center ">
                        <p className="text-zinc-400 text-lg">
                            No recipients yet. Add your first recipient to get started.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pb-2">
                        {recipients?.map((recipient) => (
                            <RecipientCard
                                key={recipient.id}
                                recipient={recipient}
                                onEdit={() => setEditingRecipient(recipient)}
                                onDelete={() => handleDeleteClick(recipient.id)}
                                isDeleting={isMutating}
                            />
                        ))}
                    </div>
                )}
            </div>
            <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title="Delete Recipient"
                description="Are you sure you want to delete this recipient? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleDeleteConfirm}
                variant="destructive"
            />
        </div>
    );
}
