"use client";

import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import type { MapViewProps } from "./map-view-new";

interface MapPickerProps {
    lat: string;
    lng: string;
    onLatChange: (value: string) => void;
    onLngChange: (value: string) => void;
    label: string;
}

export function MapPicker({ lat, lng, onLatChange, onLngChange, label }: MapPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [mapLat, setMapLat] = useState(lat ? Number(lat) : -23.5505);
    const [mapLng, setMapLng] = useState(lng ? Number(lng) : -46.6333);
    const [MapView, setMapView] = useState<React.ComponentType<MapViewProps> | null>(null);

    useEffect(() => {
        // Dynamically import map view on client side
        import("./map-view-new").then((mod) => {
            setMapView(() => mod.default);
        });
    }, []);

    useEffect(() => {
        if (lat) setMapLat(Number(lat));
        if (lng) setMapLng(Number(lng));
    }, [lat, lng]);

    const handleMapClick = (clickLat: number, clickLng: number) => {
        setMapLat(clickLat);
        setMapLng(clickLng);
        onLatChange(String(clickLat));
        onLngChange(String(clickLng));
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    className="w-full flex items-center justify-start gap-2 border-zinc-700 bg-zinc-900 hover:bg-zinc-800"
                >
                    <MapPin className="w-4 h-4" />
                    <span>
                        {lat && lng
                            ? `${parseFloat(lat).toFixed(4)}, ${parseFloat(lng).toFixed(4)}`
                            : "Click to select on map"}
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full max-w-2xl p-4 bg-zinc-900 border-zinc-700  w-96">
                <div className="space-y-4">
                    <div>
                        <p className="text-sm font-medium text-zinc-200 mb-2">{label}</p>
                        <p className="text-xs text-zinc-400 mb-3">Click on the map to select location</p>
                    </div>

                    {/* Map Container */}
                    <div className="w-full h-96 rounded-lg border border-zinc-700 overflow-hidden">
                        {MapView && (
                            <MapView
                                center={[mapLat, mapLng]}
                                zoom={3}
                                onMarkerClick={handleMapClick}
                                markerLat={mapLat}
                                markerLng={mapLng}
                            />
                        )}
                        {!MapView && (
                            <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                                Loading map...
                            </div>
                        )}
                    </div>


                    {/* Close Button */}
                    <div className="flex w-full justify-end gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setIsOpen(false)}
                            className="border-zinc-700 w-full"
                        >
                            Done
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
