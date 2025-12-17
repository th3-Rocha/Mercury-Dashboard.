"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

import type { Shipment, CreateShipmentData, UpdateShipmentData, CargoType, Employee, Truck, Recipient } from "@/lib/types";
import { useTrucksContext } from "@/contexts/TrucksContext";
import { useEmployeesContext } from "@/contexts/EmployeesContext";
import { useRecipientsContext } from "@/contexts/RecipientsContext";
import { MapPicker } from "./map-picker-new";

interface ShipmentFormProps {
    initialData?: Shipment;
    onSubmit: (data: CreateShipmentData | UpdateShipmentData) => void;
    onCancel: () => void;
    isSubmitting: boolean;
}

export function ShipmentForm({ initialData, onSubmit, onCancel, isSubmitting }: ShipmentFormProps) {
    const { employees } = useEmployeesContext();
    const { trucks } = useTrucksContext();
    const { recipients } = useRecipientsContext();

    const [startAddress, setStartAddress] = useState(initialData?.startAddress ?? "");
    const [startLat, setStartLat] = useState(String(initialData?.startLat ?? ""));
    const [startLng, setStartLng] = useState(String(initialData?.startLng ?? ""));
    const [deliveryAddress, setDeliveryAddress] = useState(initialData?.deliveryAddress ?? "");
    const [deliveryLat, setDeliveryLat] = useState(String(initialData?.deliveryLat ?? ""));
    const [deliveryLng, setDeliveryLng] = useState(String(initialData?.deliveryLng ?? ""));
    const [cargoType, setCargoType] = useState<CargoType>(initialData?.cargoType ?? ("SOLID" as CargoType));
    const [weight, setWeight] = useState(String(initialData?.weight ?? ""));
    const [estimatedProfit, setEstimatedProfit] = useState(String(initialData?.estimatedProfit ?? ""));
    const [startDate, setStartDate] = useState(initialData?.startDate ?? "");
    const [status, setStatus] = useState(initialData?.status ?? "PENDING");
    const [calendarOpen, setCalendarOpen] = useState(false);

    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
        initialData?.employee || (employees?.find((e) => e.id === initialData?.employeeId) ?? null)
    );
    const [selectedTruck, setSelectedTruck] = useState<Truck | null>(
        initialData?.truck || (trucks?.find((t) => t.id === initialData?.truckId) ?? null)
    );
    const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(
        initialData?.recipient || (recipients?.find((r) => r.id === initialData?.recipientId) ?? null)
    );

    const [employeeOpen, setEmployeeOpen] = useState(false);
    const [truckOpen, setTruckOpen] = useState(false);
    const [recipientOpen, setRecipientOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (initialData) {
            // Update mode - include all editable fields
            const updateData: UpdateShipmentData = {
                startAddress,
                startLat: Number(startLat),
                startLng: Number(startLng),
                deliveryAddress,
                deliveryLat: Number(deliveryLat),
                deliveryLng: Number(deliveryLng),
                cargoType,
                weight: Number(weight),
                estimatedProfit: Number(estimatedProfit),
                startDate,
                status: String(status).trim(),
                employeeId: selectedEmployee?.id || "",
                truckId: selectedTruck?.id || "",
                recipientId: selectedRecipient?.id || "",
            };

            onSubmit(updateData);
        } else {
            const createData: CreateShipmentData = {
                startAddress,
                startLat: Number(startLat),
                startLng: Number(startLng),
                deliveryAddress,
                deliveryLat: Number(deliveryLat),
                deliveryLng: Number(deliveryLng),
                cargoType,
                weight: Number(weight),
                estimatedProfit: Number(estimatedProfit),
                startDate,
                status: String(status),
                currentLat: Number(startLat),
                currentLng: Number(startLng),
                employeeId: selectedEmployee?.id || "",
                truckId: selectedTruck?.id || "",
                recipientId: selectedRecipient?.id || "",
            };
            onSubmit(createData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Origin */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-sm text-zinc-300 mb-1">Start Address</label>
                    <Input value={startAddress} onChange={(e) => setStartAddress(e.target.value)} />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm text-zinc-300 mb-1">Start Coordinates</label>
                    <MapPicker
                        lat={startLat}
                        lng={startLng}
                        onLatChange={setStartLat}
                        onLngChange={setStartLng}
                        label="Select start location"
                    />
                </div>
            </div>

            {/* Delivery */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-sm text-zinc-300 mb-1">Delivery Address</label>
                    <Input value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm text-zinc-300 mb-1">Delivery Coordinates</label>
                    <MapPicker
                        lat={deliveryLat}
                        lng={deliveryLng}
                        onLatChange={setDeliveryLat}
                        onLngChange={setDeliveryLng}
                        label="Select delivery location"
                    />
                </div>
            </div>

            {/* Cargo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm text-zinc-300 mb-1">Cargo Type</label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <button
                                type="button"
                                className="w-full flex items-center justify-between rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 shadow-sm hover:bg-zinc-800"
                            >
                                {cargoType}
                                <ChevronDown className="ml-2 h-4 w-4 text-zinc-400" />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-40 p-1 bg-zinc-900 border-zinc-700">
                            {(["SOLID", "LIQUID"] as CargoType[]).map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setCargoType(t)}
                                    className={cn(
                                        "w-full text-left px-3 py-2 text-sm rounded hover:bg-zinc-800 text-zinc-100",
                                        cargoType === t && "bg-zinc-800"
                                    )}
                                >
                                    {t}
                                </button>
                            ))}
                        </PopoverContent>
                    </Popover>
                </div>
                <div>
                    <label className="block text-sm text-zinc-300 mb-1">Weight (kg)</label>
                    <Input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
                </div>
                <div>
                    <label className="block text-sm text-zinc-300 mb-1">Estimated Profit</label>
                    <Input type="number" value={estimatedProfit} onChange={(e) => setEstimatedProfit(e.target.value)} />
                </div>
            </div>

            {/* Status & Location Updates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm text-zinc-300 mb-1">Status</label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <button
                                type="button"
                                className="w-full flex items-center justify-between rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 shadow-sm hover:bg-zinc-800"
                            >
                                {status}
                                <ChevronDown className="ml-2 h-4 w-4 text-zinc-400" />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-40 p-1 bg-zinc-900 border-zinc-700">
                            {(["PENDING", "IN_TRANSIT", "DELIVERED", "CANCELLED", "RETURNING"] as const).map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setStatus(s)}
                                    className={cn(
                                        "w-full text-left px-3 py-2 text-sm rounded hover:bg-zinc-800 text-zinc-100",
                                        status === s && "bg-zinc-800"
                                    )}
                                >
                                    {s}
                                </button>
                            ))}
                        </PopoverContent>
                    </Popover>
                </div>

            </div>

            {/* Start Date */}
            <div>
                <label className="block text-sm text-zinc-300 mb-1">Start Date</label>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                        <button
                            type="button"
                            className="w-full md:w-64 flex items-center justify-between rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 shadow-sm hover:bg-zinc-800"
                        >
                            {startDate ? format(new Date(startDate), "yyyy-MM-dd") : <span className="text-zinc-400">Select date</span>}
                            <CalendarIcon className="ml-2 h-4 w-4 text-zinc-400" />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-zinc-900 border-zinc-700">
                        <Calendar
                            mode="single"
                            selected={startDate ? new Date(startDate) : undefined}
                            onSelect={(date) => {
                                setStartDate(date ? format(date, "yyyy-MM-dd") : "");
                                setCalendarOpen(false);
                            }}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>

            {/* Employee Selector */}
            <div>
                <label className="block text-sm text-zinc-300 mb-1">Employee</label>
                <Popover open={employeeOpen} onOpenChange={setEmployeeOpen}>
                    <PopoverTrigger asChild>
                        <button
                            type="button"
                            className="w-full flex items-center justify-between rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 shadow-sm hover:bg-zinc-800"
                        >
                            {selectedEmployee ? (
                                <span className="truncate mr-2">{selectedEmployee.name} — CPF: {selectedEmployee.cpf}</span>
                            ) : (
                                <span className="text-zinc-400">Select employee</span>
                            )}
                            <ChevronDown className="ml-2 h-4 w-4 text-zinc-400 flex-shrink-0" />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 max-h-60 overflow-y-auto p-1 bg-zinc-900 border-zinc-700">
                        {employees?.length === 0 && <p className="text-zinc-400 text-sm px-3 py-2">No employees found</p>}
                        {employees?.map((emp) => (
                            <button
                                key={emp.id}
                                type="button"
                                onClick={() => {
                                    setSelectedEmployee(emp);
                                    setEmployeeOpen(false);
                                }}
                                className={cn(
                                    "w-full flex items-center justify-between text-left px-3 py-2 text-sm rounded hover:bg-zinc-800 text-zinc-100",
                                    selectedEmployee?.id === emp.id && "bg-zinc-800"
                                )}
                            >
                                <span className="truncate mr-2">{emp.name} — CPF: {emp.cpf}</span>
                                {selectedEmployee?.id === emp.id && <Check className="h-4 w-4 text-green-400 flex-shrink-0" />}
                            </button>
                        ))}
                    </PopoverContent>
                </Popover>
            </div>

            {/* Truck Selector */}
            <div>
                <label className="block text-sm text-zinc-300 mb-1">Truck</label>
                <Popover open={truckOpen} onOpenChange={setTruckOpen}>
                    <PopoverTrigger asChild>
                        <button
                            type="button"
                            className="w-full flex items-center justify-between rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 shadow-sm hover:bg-zinc-800"
                        >
                            {selectedTruck ? (
                                <span className="truncate mr-2">{selectedTruck.licensePlate} — {selectedTruck.maxPayload} kg</span>
                            ) : (
                                <span className="text-zinc-400">Select truck</span>
                            )}
                            <ChevronDown className="ml-2 h-4 w-4 text-zinc-400 flex-shrink-0" />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 max-h-60 overflow-y-auto p-1 bg-zinc-900 border-zinc-700">
                        {trucks?.length === 0 && <p className="text-zinc-400 text-sm px-3 py-2">No trucks found</p>}
                        {trucks?.map((truck) => (
                            <button
                                key={truck.id}
                                type="button"
                                onClick={() => {
                                    setSelectedTruck(truck);
                                    setTruckOpen(false);
                                }}
                                className={cn(
                                    "w-full flex items-center justify-between text-left px-3 py-2 text-sm rounded hover:bg-zinc-800 text-zinc-100",
                                    selectedTruck?.id === truck.id && "bg-zinc-800"
                                )}
                            >
                                <span className="truncate mr-2">{truck.licensePlate} — {truck.maxPayload} kg</span>
                                {selectedTruck?.id === truck.id && <Check className="h-4 w-4 text-green-400 flex-shrink-0" />}
                            </button>
                        ))}
                    </PopoverContent>
                </Popover>
            </div>

            {/* Recipient Selector */}
            <div>
                <label className="block text-sm text-zinc-300 mb-1">Recipient</label>
                <Popover open={recipientOpen} onOpenChange={setRecipientOpen}>
                    <PopoverTrigger asChild>
                        <button
                            type="button"
                            className="w-full flex items-center justify-between rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 shadow-sm hover:bg-zinc-800"
                        >
                            {selectedRecipient ? (
                                <span className="truncate mr-2">{selectedRecipient.name} — {selectedRecipient.email}</span>
                            ) : (
                                <span className="text-zinc-400">Select recipient</span>
                            )}
                            <ChevronDown className="ml-2 h-4 w-4 text-zinc-400 flex-shrink-0" />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 max-h-60 overflow-y-auto p-1 bg-zinc-900 border-zinc-700">
                        {recipients?.length === 0 && <p className="text-zinc-400 text-sm px-3 py-2">No recipients found</p>}
                        {recipients?.map((rec) => (
                            <button
                                key={rec.id}
                                type="button"
                                onClick={() => {
                                    setSelectedRecipient(rec);
                                    setRecipientOpen(false);
                                }}
                                className={cn(
                                    "w-full flex items-center justify-between text-left px-3 py-2 text-sm rounded hover:bg-zinc-800 text-zinc-100",
                                    selectedRecipient?.id === rec.id && "bg-zinc-800"
                                )}
                            >
                                <span className="truncate mr-2">{rec.name} — {rec.email}</span>
                                {selectedRecipient?.id === rec.id && <Check className="h-4 w-4 text-green-400 flex-shrink-0" />}
                            </button>
                        ))}
                    </PopoverContent>
                </Popover>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
                <Button type="submit" className="bg-white text-black hover:bg-gray-100" disabled={isSubmitting}>
                    {initialData ? "Save" : "Create"}
                </Button>
                <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                    Cancel
                </Button>
            </div>
        </form>
    );
}
