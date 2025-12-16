"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import type { Employee, CreateEmployeeData } from "@/lib/types";

export function EmployeeForm({
    initialData,
    onSubmit,
    onCancel,
    isSubmitting,
}: {
    initialData?: Employee;
    onSubmit: (data: CreateEmployeeData) => void;
    onCancel: () => void;
    isSubmitting: boolean;
}) {
    const [name, setName] = useState(initialData?.name ?? "");
    const [cnh, setCnh] = useState(initialData?.cnh ?? "");
    const [cnhExpiration, setCnhExpiration] = useState(initialData?.cnhExpiration ?? "");
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [cpf, setCpf] = useState(initialData?.cpf ?? "");
    const [salary, setSalary] = useState(String(initialData?.salary ?? ""));

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit({ name, cnh, cnhExpiration, cpf, salary: Number(salary) });
            }}
            className="space-y-4"
        >
            <div>
                <label className="block text-sm text-zinc-300 mb-1">Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
                <label className="block text-sm text-zinc-300 mb-1">CNH</label>
                <Input value={cnh} onChange={(e) => setCnh(e.target.value)} />
            </div>
            <div>
                <label className="block text-sm text-zinc-300 mb-1">CNH Expiration</label>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                        <button
                            type="button"
                            className="w-full flex items-center justify-between rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 shadow-sm hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                            onClick={() => setCalendarOpen((open) => !open)}
                        >
                            {cnhExpiration ? format(new Date(cnhExpiration), "yyyy-MM-dd") : <span className="text-zinc-400">Select date</span>}
                            <CalendarIcon className="ml-2 h-4 w-4 text-zinc-400" />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-zinc-900 border-zinc-700">
                        <Calendar
                            mode="single"
                            selected={cnhExpiration ? new Date(cnhExpiration) : undefined}
                            onSelect={(date) => {
                                setCnhExpiration(date ? format(date, "yyyy-MM-dd") : "");
                                setCalendarOpen(false);
                            }}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <div>
                <label className="block text-sm text-zinc-300 mb-1">CPF</label>
                <Input value={cpf} onChange={(e) => setCpf(e.target.value)} />
            </div>
            <div>
                <label className="block text-sm text-zinc-300 mb-1">Salary</label>
                <Input type="number" value={salary} onChange={(e) => setSalary(e.target.value)} />
            </div>

            <div className="flex gap-2">
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
