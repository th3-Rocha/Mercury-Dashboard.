"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCompanyContext } from "@/contexts/CompanyContext";
import { Shipment, ShipmentEvent, CreateShipmentData, UpdateShipmentData } from "@/lib/types";
import { useShipmentsContext } from "@/contexts/ShipmentsContext";
import { ShipmentForm } from "./shipment-form";
import { ShipmentCard } from "./shipment-card";
import { ShipmentEventDialog } from "./shipment-event-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export default function ShipmentsPage() {
  const { isAuthenticated } = useAuthContext();
  const { company } = useCompanyContext();
  const router = useRouter();
  const {
    shipments,
    isLoading,
    isMutating,
    error: fetchError,
    addShipment,
    updateShipment,
    removeShipment,
    addShipmentEvent,
    deleteShipmentEvent,
  } = useShipmentsContext();

  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);
  const [eventsShipmentId, setEventsShipmentId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shipmentToDelete, setShipmentToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const handleOpenEvents = async (shipmentId: string) => {
    setEventsShipmentId(shipmentId);
  };

  const handleAddShipment = async (data: CreateShipmentData) => {
    setError(null);
    try {
      await addShipment(data);
      setShowForm(false);
    } catch (err: any) {
      setError(err?.message || "Failed to create shipment");
    }
  };

  const handleUpdateShipment = async (id: string, data: UpdateShipmentData) => {
    setError(null);
    try {
      await updateShipment(id, data);
      setEditingShipment(null);
    } catch (err: any) {
      setError(err?.message || "Failed to update shipment");
    }
  };

  const handleDeleteClick = (id: string) => {
    setShipmentToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!shipmentToDelete) return;
    setError(null);
    try {
      await removeShipment(shipmentToDelete);
    } catch (err: any) {
      setError(err?.message || "Failed to delete shipment");
    } finally {
      setShipmentToDelete(null);
    }
  };

  const handleAddEvent = async (data: { latitude: number; longitude: number; description: string; recordedAt: Date }) => {
    if (!eventsShipmentId) return;
    setError(null);
    try {
      await addShipmentEvent(eventsShipmentId, data);
      // Context will handle the refresh internally
    } catch (err: any) {
      setError(err?.message || "Failed to add event");
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!eventsShipmentId) return;
    setError(null);
    try {
      await deleteShipmentEvent(eventsShipmentId, eventId);
      // Context will handle the refresh internally
    } catch (err: any) {
      setError(err?.message || "Failed to delete event");
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  const currentShipment = eventsShipmentId ? shipments?.find((s) => s.id === eventsShipmentId) : null;

  return (
    <div className="w-full flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-none">
        <h1 className="text-white text-3xl font-bold">Shipments</h1>
        <Button
          onClick={() => {
            setEditingShipment(null);
            setShowForm(!showForm);
          }}
          className="flex bg-white hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Shipment
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
        {(showForm || editingShipment) && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
            <h2 className="text-white text-xl font-semibold mb-4">
              {editingShipment ? "Edit Shipment" : "Add New Shipment"}
            </h2>
            <ShipmentForm
              initialData={editingShipment || undefined}
              onSubmit={
                editingShipment
                  ? (data) => handleUpdateShipment(editingShipment.id, data as UpdateShipmentData)
                  : (data) => handleAddShipment(data as CreateShipmentData)
              }
              onCancel={() => {
                setShowForm(false);
                setEditingShipment(null);
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
                  <Skeleton className="h-6 w-20 rounded" />
                </div>
                <div className="space-y-3 mb-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <Skeleton className="h-12 w-full mb-4 rounded-lg" />
                <div className="flex gap-2 pt-4 border-t border-zinc-800">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 w-10" />
                </div>
              </div>
            ))}
          </div>
        ) : (shipments?.length || 0) === 0 ? (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-12 text-center">
            <p className="text-zinc-400 text-lg">
              No shipments yet. Add your first shipment to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-2">
            {shipments?.map((shipment) => (
              <ShipmentCard
                key={shipment.id}
                shipment={shipment}
                onEdit={() => setEditingShipment(shipment)}
                onDelete={() => handleDeleteClick(shipment.id)}
                onEvents={() => handleOpenEvents(shipment.id)}
                isDeleting={isMutating}
              />
            ))}
          </div>
        )}
      </div>

      {/* Events Dialog */}
      <ShipmentEventDialog
        open={eventsShipmentId !== null}
        onOpenChange={(open: boolean) => {
          if (!open) {
            setEventsShipmentId(null);
          }
        }}
        shipmentId={eventsShipmentId || ""}
        events={currentShipment?.events || []}
        onAddEvent={handleAddEvent}
        onDeleteEvent={handleDeleteEvent}
        isSubmitting={isMutating}
      />
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Shipment"
        description="Are you sure you want to delete this shipment? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        variant="destructive"
      />
    </div>
  );
}
