"use client";

import { Button } from "@/components/ui/button";
import { Edit, Trash2, MapPin } from "lucide-react";
import type { Recipient } from "@/lib/types";
import { format } from "date-fns";

export function RecipientCard({
    recipient,
    onEdit,
    onDelete,
    isDeleting,
}: {
    recipient: Recipient;
    onEdit: () => void;
    onDelete: () => void;
    isDeleting: boolean;
}) {
    return (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-colors">
            {/* Header with Icon */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="bg-amber-600/20 p-3 rounded-lg">
                        <MapPin className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                        <h3 className="text-white font-semibold text-lg">
                            {recipient.name}
                        </h3>
                        <p className="text-zinc-400 text-sm">
                            ID: {recipient.id.slice(0, 8)}...
                        </p>
                    </div>
                </div>
            </div>

            {/* Details */}
            <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                    <span className="text-zinc-400 text-sm">Email</span>
                    <span className="text-white font-medium text-sm">{recipient.email}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                    <span className="text-zinc-400 text-sm">Phone</span>
                    <span className="text-white font-medium text-sm">{recipient.phone}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                    <span className="text-zinc-400 text-sm">Address</span>
                    <span className="text-white font-medium text-sm truncate max-w-xs">{recipient.fullAddress}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                    <span className="text-zinc-400 text-sm">Created</span>
                    <span className="text-white font-medium text-sm">
                        {format(new Date(recipient.createdAt), "MMM dd, yyyy")}
                    </span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-zinc-800">
                <Button
                    onClick={onEdit}
                    disabled={isDeleting}
                    variant="outline"
                    className="flex-1 flex items-center cursor-pointer justify-center gap-2 bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white hover:border-zinc-600 disabled:opacity-50 font-medium transition-colors"
                >
                    <Edit className="w-4 h-4" />
                    Edit
                </Button>
                <Button
                    onClick={onDelete}
                    disabled={isDeleting}
                    variant="outline"
                    className="flex items-center cursor-pointer justify-center gap-2 bg-transparent border-zinc-700 text-zinc-400 hover:bg-red-950/50 hover:text-red-400 hover:border-red-800/50 disabled:opacity-50 font-medium transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
