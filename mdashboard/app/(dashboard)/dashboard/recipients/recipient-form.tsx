"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { Recipient, CreateRecipientData } from "@/lib/types";

export function RecipientForm({
    initialData,
    onSubmit,
    onCancel,
    isSubmitting,
}: {
    initialData?: Recipient;
    onSubmit: (data: CreateRecipientData) => void;
    onCancel: () => void;
    isSubmitting: boolean;
}) {
    const [name, setName] = useState(initialData?.name ?? "");
    const [email, setEmail] = useState(initialData?.email ?? "");
    const [phone, setPhone] = useState(initialData?.phone ?? "");
    const [fullAddress, setFullAddress] = useState(initialData?.fullAddress ?? "");

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit({ name, email, phone, fullAddress });
            }}
            className="space-y-4"
        >
            <div>
                <label className="block text-sm text-zinc-300 mb-1">Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
                <label className="block text-sm text-zinc-300 mb-1">Email</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
                <label className="block text-sm text-zinc-300 mb-1">Phone</label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div>
                <label className="block text-sm text-zinc-300 mb-1">Full Address</label>
                <Input value={fullAddress} onChange={(e) => setFullAddress(e.target.value)} />
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
