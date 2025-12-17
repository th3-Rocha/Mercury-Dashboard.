"use client";

import { Button } from "@/components/ui/button";
import { Edit, Trash2, Package, Clock } from "lucide-react";
import type { Shipment, ShipmentStatus } from "@/lib/types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const statusColors: Record<ShipmentStatus, string> = {
    PENDING: "bg-yellow-600/20 text-yellow-400",
    IN_TRANSIT: "bg-blue-600/20 text-blue-400",
    DELIVERED: "bg-green-600/20 text-green-400",
    CANCELLED: "bg-red-600/20 text-red-400",
    RETURNING: "bg-purple-600/20 text-purple-400",
};

interface ShipmentCardProps {
    shipment: Shipment;
    onEdit: () => void;
    onDelete: () => void;
    onEvents: () => void;
    isDeleting: boolean;
}

export function ShipmentCard({ shipment, onEdit, onDelete, onEvents, isDeleting }: ShipmentCardProps) {
    return (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 sm:p-6 hover:border-zinc-700 transition-colors">
            {/* Header with Icon */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="bg-indigo-600/20 p-2 sm:p-3 rounded-lg">
                        <Package className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className="text-white font-semibold text-sm sm:text-lg truncate" title={shipment.deliveryAddress}>
                            {shipment.deliveryAddress.slice(0, 25)}{shipment.deliveryAddress.length > 25 ? "..." : ""}
                        </h3>
                        <p className="text-zinc-400 text-xs sm:text-sm">ID: {shipment.id.slice(0, 8)}...</p>
                    </div>
                </div>
                <span className={cn("px-2 py-1 rounded text-xs font-medium whitespace-nowrap", statusColors[shipment.status])}>
                    {shipment.status}
                </span>
            </div>

            <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between items-center py-1 border-b border-zinc-800">
                    <span className="text-zinc-400">From</span>
                    <span className="text-white font-medium truncate max-w-[140px]" title={shipment.startAddress}>
                        {shipment.startAddress.slice(0, 20)}{shipment.startAddress.length > 20 ? "..." : ""}
                    </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-zinc-800">
                    <span className="text-zinc-400">Cargo</span>
                    <span className="text-white font-medium">{shipment.cargoType} — {shipment.weight} kg</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-zinc-800">
                    <span className="text-zinc-400">Profit</span>
                    <span className="text-white font-medium">R$ {String(shipment.estimatedProfit)}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-zinc-800">
                    <span className="text-zinc-400">Start Date</span>
                    <span className="text-white font-medium">{format(new Date(shipment.startDate), "MMM dd, yyyy")}</span>
                </div>
                {shipment.employee && (
                    <div className="flex justify-between items-center py-1 border-b border-zinc-800">
                        <span className="text-zinc-400 flex-shrink-0">Employee</span>
                        <span className="text-white font-medium truncate max-w-[60%] ml-2">{shipment.employee.name}</span>
                    </div>
                )}
                {shipment.truck && (
                    <div className="flex justify-between items-center py-1 border-b border-zinc-800">
                        <span className="text-zinc-400 flex-shrink-0">Truck</span>
                        <span className="text-white font-medium truncate max-w-[60%] ml-2">{shipment.truck.licensePlate}</span>
                    </div>
                )}
                {shipment.recipient && (
                    <div className="flex justify-between items-center py-1">
                        <span className="text-zinc-400 flex-shrink-0">Recipient</span>
                        <span className="text-white font-medium truncate max-w-[60%] ml-2">{shipment.recipient.name}</span>
                    </div>
                )}
            </div>

            {shipment.events && shipment.events.length > 0 ? (
                <div className="mb-4 px-3 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-blue-400">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">{shipment.events.length} event{shipment.events.length !== 1 ? "s" : ""} recorded</span>
                    </div>
                </div>
            ) : (
                <div className="mb-4 px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-zinc-500">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">No events recorded</span>
                    </div>
                </div>
            )}

            <div className="flex gap-2 pt-4 border-t border-zinc-800">
                <Button
                    onClick={onEvents}
                    disabled={isDeleting}
                    variant="outline"
                    className="flex-1 flex cursor-pointer items-center justify-center gap-1 sm:gap-2 bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white hover:border-zinc-600 disabled:opacity-50 font-medium transition-colors text-xs sm:text-sm"
                    title="View and manage shipment events"
                >
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Events</span>
                </Button>
                <Button
                    onClick={onEdit}
                    disabled={isDeleting}
                    variant="outline"
                    className="flex-1 flex items-center cursor-pointer justify-center gap-1 sm:gap-2 bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white hover:border-zinc-600 disabled:opacity-50 font-medium transition-colors text-xs sm:text-sm"
                >
                    <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Edit</span>
                </Button>
                <Button
                    onClick={onDelete}
                    disabled={isDeleting}
                    variant="outline"
                    className="flex items-center cursor-pointer justify-center gap-1 sm:gap-2 bg-transparent border-zinc-700 text-zinc-400 hover:bg-red-950/50 hover:text-red-400 hover:border-red-800/50 disabled:opacity-50 font-medium transition-colors px-2 sm:px-4"
                >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
            </div>
        </div>
    );
}
