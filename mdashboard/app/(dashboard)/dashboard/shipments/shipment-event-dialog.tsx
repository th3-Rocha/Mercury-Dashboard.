"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPicker } from "./map-picker-new";
import { Spinner } from "@/components/ui/spinner";
import { format } from "date-fns";
import { ShipmentEvent } from "@/lib/types";
import { Trash2, Clock, MapPin, X, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface ShipmentEventDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    shipmentId: string;
    events?: ShipmentEvent[];
    onAddEvent: (data: { latitude: number; longitude: number; description: string; recordedAt: Date }) => Promise<void>;
    onDeleteEvent: (eventId: string) => Promise<void>;
    isSubmitting?: boolean;
}

export function ShipmentEventDialog({
    open,
    onOpenChange,
    shipmentId,
    events = [],
    onAddEvent,
    onDeleteEvent,
    isSubmitting = false,
}: ShipmentEventDialogProps) {
    // Debug: log events prop whenever it changes
    console.log("[ShipmentEventDialog] events prop:", events, "length:", events?.length);

    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [description, setDescription] = useState("");
    const [recordedAt, setRecordedAt] = useState<Date>(new Date());
    const [deletingEventId, setDeletingEventId] = useState<string | null>(null);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await onAddEvent({
                latitude: Number(latitude),
                longitude: Number(longitude),
                description,
                recordedAt,
            });
            setLatitude("");
            setLongitude("");
            setDescription("");
            setRecordedAt(new Date());
        } catch (error) {
            console.error("Failed to add event:", error);
        }
    };

    const handleDeleteEvent = async (eventId: string) => {
        if (!confirm("Are you sure you want to delete this event?")) return;
        try {
            setDeletingEventId(eventId);
            await onDeleteEvent(eventId);
        } finally {
            setDeletingEventId(null);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-zinc-800 flex-none bg-linear-to-r from-zinc-900 to-zinc-900/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Clock className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">Shipment Events</h2>
                            <p className="text-sm text-zinc-400 mt-1">Track and manage shipment events with location data</p>
                        </div>
                    </div>
                    <button
                        onClick={() => onOpenChange(false)}
                        className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Events List Section */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-4">
                            <div className={cn("w-2 h-2 rounded-full", events.length > 0 ? "bg-green-500" : "bg-zinc-500")} />
                            <h3 className="text-sm font-semibold text-zinc-100">
                                Event History
                            </h3>
                            <span className="ml-auto text-xs px-2 py-1 bg-zinc-800 rounded text-zinc-400">
                                {events.length} {events.length === 1 ? "event" : "events"}
                            </span>
                        </div>

                        {events.length === 0 ? (
                            <div className="text-center py-12 text-zinc-500 bg-zinc-900/50 rounded-lg border border-zinc-800">
                                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No events recorded yet</p>
                                <p className="text-xs mt-1 text-zinc-600">Add your first event below</p>
                            </div>
                        ) : (
                            <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
                                {events.map((event, idx) => (
                                    <div
                                        key={event.id}
                                        className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 hover:border-zinc-600 hover:bg-zinc-800/70 transition-all group"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="shrink-0 w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/20 mt-0.5">
                                                <span className="text-xs font-semibold text-blue-400">{events.length - idx}</span>
                                            </div>
                                            <div className="flex-1 space-y-2 min-w-0">
                                                <p className="text-sm font-medium text-zinc-100 wrap-break-word">{event.description}</p>
                                                <div className="flex flex-col gap-1.5 text-xs text-zinc-400">
                                                    <div className="flex items-center gap-1.5">
                                                        <MapPin className="w-3.5 h-3.5 text-blue-400/60 shrink-0" />
                                                        <span className="font-mono bg-zinc-900/50 px-2 py-0.5 rounded break-all">
                                                            {event.latitude.toFixed(4)}, {event.longitude.toFixed(4)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock className="w-3.5 h-3.5 text-green-400/60 shrink-0" />
                                                        <span>{format(new Date(event.recordedAt), "MMM dd, yyyy HH:mm:ss")}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteEvent(event.id)}
                                                disabled={deletingEventId === event.id}
                                                className="p-2 hover:bg-red-900/20 text-red-400 hover:text-red-300 rounded-lg transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50 shrink-0"
                                                aria-label="Delete event"
                                            >
                                                {deletingEventId === event.id ? (
                                                    <Spinner className="w-4 h-4" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Divider */}
                    {events.length > 0 && <div className="border-t border-zinc-700" />}

                    {/* Add Event Form */}
                    <div className="space-y-4 bg-linear-to-br from-blue-500/5 to-transparent p-4 rounded-lg border border-blue-500/10">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full" />
                            <h3 className="text-sm font-semibold text-zinc-100">Add New Event</h3>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Location Picker */}
                            <div>
                                <label className="flex text-sm text-zinc-300 mb-2 font-medium gap-1">
                                    <MapPin className="w-4 h-4 text-blue-400" />
                                    Event Location
                                </label>
                                <MapPicker
                                    lat={latitude}
                                    lng={longitude}
                                    onLatChange={setLatitude}
                                    onLngChange={setLongitude}
                                    label="Select event location"
                                />
                            </div>

                            {/* Event Date & Time */}
                            <div>
                                <label className="flex text-sm text-zinc-300 mb-2 font-medium gap-1">
                                    <CalendarIcon className="w-4 h-4 text-blue-400" />
                                    Event Date & Time
                                </label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 hover:text-white",
                                                !recordedAt && "text-zinc-500"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {recordedAt ? format(recordedAt, "PPP 'at' HH:mm") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 bg-zinc-900 border-zinc-700" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={recordedAt}
                                            onSelect={(date) => {
                                                if (date) {
                                                    // Preserve the time when selecting a new date
                                                    const newDate = new Date(date);
                                                    newDate.setHours(recordedAt.getHours());
                                                    newDate.setMinutes(recordedAt.getMinutes());
                                                    setRecordedAt(newDate);
                                                }
                                            }}
                                            initialFocus
                                        />
                                        <div className="p-3 border-t border-zinc-700">
                                            <label className="text-xs text-zinc-400 mb-2 block">Time</label>
                                            <Input
                                                type="time"
                                                value={format(recordedAt, "HH:mm")}
                                                onChange={(e) => {
                                                    const [hours, minutes] = e.target.value.split(":");
                                                    const newDate = new Date(recordedAt);
                                                    newDate.setHours(parseInt(hours));
                                                    newDate.setMinutes(parseInt(minutes));
                                                    setRecordedAt(newDate);
                                                }}
                                                className="bg-zinc-800 border-zinc-700 text-white h-8"
                                            />
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="flex text-sm text-zinc-300 mb-2 font-medium gap-1">
                                    <Clock className="w-4 h-4 text-blue-400" />
                                    Description
                                </label>
                                <Input
                                    placeholder="e.g., Vehicle inspection, Cargo loading, Delivery complete..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-blue-500 focus:ring-blue-500/20"
                                />
                            </div>

                            {/* Submit */}
                            <Button
                                type="submit"
                                variant="secondary"
                                disabled={isSubmitting || !latitude || !longitude || !description.trim()}
                                className="w-full justify-center cursor-pointer bg-zinc-800 text-white border border-zinc-700 hover:bg-zinc-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Spinner className="w-4 h-4 mr-2" />
                                        Adding Event...
                                    </>
                                ) : (
                                    <>
                                        <Clock className="w-4 h-4 mr-2" />
                                        Add Event
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
