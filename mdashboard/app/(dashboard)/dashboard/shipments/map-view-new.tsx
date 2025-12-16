"use client";

import { useEffect, useState } from "react";
import { Map, MapTileLayer, MapMarker } from "@/components/ui/map";
import { useMapEvents } from "react-leaflet";
import type { LatLngExpression } from "leaflet";

// Component to handle map clicks
function MapClickHandler({ onMarkerClick }: { onMarkerClick: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            onMarkerClick(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

export interface MapViewProps {
    center: [number, number];
    zoom: number;
    onMarkerClick: (lat: number, lng: number) => void;
    markerLat: number;
    markerLng: number;
}

export default function MapView({ center, zoom, onMarkerClick, markerLat, markerLng }: MapViewProps) {
    const [userLocation, setUserLocation] = useState<LatLngExpression | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Try to get user location from IP
        const getLocation = async () => {
            try {
                const response = await fetch("https://ipapi.co/json/");
                const data = await response.json();
                const location: LatLngExpression = [data.latitude, data.longitude];
                setUserLocation(location);
            } catch (error) {
                // Default to center of USA if IP geolocation fails
                console.log("Using default location (center of USA)");
                setUserLocation([39.8283, -98.5795]);
            } finally {
                setLoading(false);
            }
        };

        getLocation();
    }, []);

    if (loading) {
        return (
            <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-400">
                Loading map...
            </div>
        );
    }

    const mapCenter = userLocation || [39.8283, -98.5795];

    return (
        <div className="w-full h-full flex items-center justify-center">
            <Map
                center={mapCenter as LatLngExpression}
                zoom={zoom}
                className="w-full h-full rounded-lg"
            >
                {/* Dark theme tile layer */}
                <MapTileLayer
                    name="Dark"
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                {/* Marker at the selected location */}
                <MapMarker position={[markerLat, markerLng] as LatLngExpression} />
                {/* Click handler */}
                <MapClickHandler onMarkerClick={onMarkerClick} />
            </Map>
        </div>
    );
}