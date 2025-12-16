"use client";

import { useState } from "react";
import { Truck, CreateTruckData, UpdateTruckData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type TruckFormProps = {
    initialData?: Truck;
    onSubmit: (data: CreateTruckData | UpdateTruckData) => Promise<void>;
    onCancel: () => void;
    isSubmitting?: boolean;
};

export function TruckForm({
    initialData,
    onSubmit,
    onCancel,
    isSubmitting = false,
}: TruckFormProps) {
    const [licensePlate, setLicensePlate] = useState(
        initialData?.licensePlate || ""
    );
    const [maxPayload, setMaxPayload] = useState(
        initialData?.maxPayload?.toString() || ""
    );
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!licensePlate.trim()) {
            newErrors.licensePlate = "License plate is required";
        }

        if (!maxPayload) {
            newErrors.maxPayload = "Max payload is required";
        } else if (isNaN(Number(maxPayload)) || Number(maxPayload) <= 0) {
            newErrors.maxPayload = "Max payload must be a positive number";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        const data: UpdateTruckData = {
            licensePlate: licensePlate.trim(),
            maxPayload: Number(maxPayload),
        };

        try {
            await onSubmit(data);
            if (!initialData) {
                setLicensePlate("");
                setMaxPayload("");
                setErrors({});
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                    License Plate
                </label>
                <Input
                    type="text"
                    value={licensePlate}
                    onChange={(e) => setLicensePlate(e.target.value)}
                    placeholder="ABC-1234"
                    className="w-full"
                    disabled={isSubmitting}
                />
                {errors.licensePlate && (
                    <p className="text-red-400 text-sm mt-1">{errors.licensePlate}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Max Payload (kg)
                </label>
                <Input
                    type="number"
                    value={maxPayload}
                    onChange={(e) => setMaxPayload(e.target.value)}
                    placeholder="1000"
                    step="0.01"
                    min="0"
                    className="w-full"
                    disabled={isSubmitting}
                />
                {errors.maxPayload && (
                    <p className="text-red-400 text-sm mt-1">{errors.maxPayload}</p>
                )}
            </div>

            <div className="flex gap-3 pt-4">
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-white hover:bg-gray-100 disabled:opacity-50  cursor-pointer"
                >
                    {isSubmitting ? "Saving..." : initialData ? "Update Truck" : "Add Truck"}
                </Button>
                <Button
                    type="button"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="flex-1 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50  cursor-pointer"
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
}
