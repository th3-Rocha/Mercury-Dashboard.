"use client";

import { Button } from "@/components/ui/button";
import { Edit, Trash2, IdCardLanyard } from "lucide-react";
import type { Employee } from "@/lib/types";
import { format } from "date-fns";

export function EmployeeCard({
    employee,
    onEdit,
    onDelete,
    isDeleting,
}: {
    employee: Employee;
    onEdit: () => void;
    onDelete: () => void;
    isDeleting: boolean;
}) {
    return (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 sm:p-6 hover:border-zinc-700 transition-colors">
            {/* Header with Icon */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="bg-green-600/20 p-2 sm:p-3 rounded-lg">
                        <IdCardLanyard className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                    </div>
                    <div>
                        <h3 className="text-white font-semibold text-base sm:text-lg">
                            {employee.name}
                        </h3>
                        <p className="text-zinc-400 text-xs sm:text-sm">
                            ID: {employee.id.slice(0, 8)}...
                        </p>
                    </div>
                </div>
            </div>

            {/* Details */}
            <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                    <span className="text-zinc-400 text-sm">CNH</span>
                    <span className="text-white font-medium">{employee.cnh}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                    <span className="text-zinc-400 text-sm">CNH Expiration</span>
                    <span className="text-white font-medium text-sm">
                        {employee.cnhExpiration ? format(new Date(employee.cnhExpiration), "MMM dd, yyyy") : "-"}
                    </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                    <span className="text-zinc-400 text-sm">CPF</span>
                    <span className="text-white font-medium text-sm">{employee.cpf}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                    <span className="text-zinc-400 text-sm">Salary</span>
                    <span className="text-white font-medium text-sm">R$ {String(employee.salary)}</span>
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
