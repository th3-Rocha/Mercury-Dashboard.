"use client";

import { Truck } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Truck as TruckIcon } from "lucide-react";
import { format } from "date-fns";

type TruckCardProps = {
    truck: Truck;
    onEdit: () => void;
    onDelete: () => void;
    isDeleting?: boolean;
};

export function TruckCard({
    truck,
    onEdit,
    onDelete,
    isDeleting = false,
}: TruckCardProps) {
    return (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 sm:p-6 hover:border-zinc-700 transition-colors">
            {/* Header with Icon */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="bg-blue-600/20 p-2 sm:p-3 rounded-lg">
                        <TruckIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className="text-white font-semibold text-base sm:text-lg break-words overflow-hidden">
                            {truck.licensePlate}
                        </h3>
                        <p className="text-zinc-400 text-xs sm:text-sm truncate">
                            ID: {truck.id.slice(0, 8)}...
                        </p>
                    </div>
                </div>
            </div>

            {/* Details */}
            <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                    <span className="text-zinc-400 text-sm">Max Payload</span>
                    <span className="text-white font-medium">{truck.maxPayload} kg</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                    <span className="text-zinc-400 text-sm">Created</span>
                    <span className="text-white font-medium text-sm">
                        {format(new Date(truck.createdAt), "MMM dd, yyyy")}
                    </span>
                </div>
                <div className="flex justify-between items-center py-2">
                    <span className="text-zinc-400 text-sm">Updated</span>
                    <span className="text-white font-medium text-sm">
                        {format(new Date(truck.updatedAt), "MMM dd, yyyy")}
                    </span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-zinc-800">
                <Button
                    onClick={onEdit}
                    disabled={isDeleting}
                    variant="outline"
                    className="flex-1 flex items-center cursor-pointer justify-center gap-1 sm:gap-2 bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white hover:border-zinc-600 disabled:opacity-50 font-medium transition-colors text-sm"
                >
                    <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Edit</span>
                </Button>
                <Button
                    onClick={onDelete}
                    disabled={isDeleting}
                    variant="outline"
                    className="flex items-center cursor-pointer justify-center gap-1 sm:gap-2 bg-transparent border-zinc-700 text-zinc-400 hover:bg-red-950/50 hover:text-red-400 hover:border-red-800/50 disabled:opacity-50 font-medium transition-colors px-3 sm:px-4"
                >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
            </div>
        </div>
    );
}
