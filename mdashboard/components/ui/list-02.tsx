
"use client";

import { Navigation, Truck } from "lucide-react";
import { useMemo } from "react";
import { Map, MapMarker, MapTileLayer } from "@/components/ui/map";
import { useShipmentsContext } from "@/contexts/ShipmentsContext";

export default function ViewTrucksMapRealtime() {
  const { shipments, isLoading } = useShipmentsContext();

  const points = useMemo(() => {
    if (!shipments) return [];
    return shipments
      .map((s) => {
        // Prefer explicit current lat/lng, then latest event, then delivery, then start.
        const latestEvent = (s.events || [])
          .slice()
          .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime())[0];

        const lat =
          (typeof s.currentLat === "number" ? s.currentLat : undefined) ??
          (latestEvent ? latestEvent.latitude : undefined) ??
          s.deliveryLat ??
          s.startLat;
        const lng =
          (typeof s.currentLng === "number" ? s.currentLng : undefined) ??
          (latestEvent ? latestEvent.longitude : undefined) ??
          s.deliveryLng ??
          s.startLng;

        if (typeof lat !== "number" || typeof lng !== "number") return null;

        return {
          id: s.id,
          title: s.deliveryAddress,
          status: s.status,
          lat,
          lng,
        };
      })
      .filter(Boolean) as { id: string; title: string; status: string; lat: number; lng: number }[];
  }, [shipments]);

  const mapCenter = useMemo<[number, number]>(() => {
    if (points.length === 0) return [-23.5505, -46.6333]; // São Paulo fallback
    const [first] = points;
    return [first.lat, first.lng];
  }, [points]);

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <Truck className="w-4 h-4 text-zinc-300" />
          <div>
            <p className="text-sm font-semibold">Live Shipment Map</p>
          </div>
        </div>

      </div>

      <div className="w-full h-122 rounded-lg border border-zinc-800 overflow-hidden">
        {isLoading ? (
          <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-400">
            Loading map...
          </div>
        ) : (
          <Map center={mapCenter} zoom={3} className="w-full h-full rounded-none">
            <MapTileLayer
              name="Dark"
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            {points.map((p) => (
              <MapMarker
                key={p.id}
                position={[p.lat, p.lng]}
                icon={<Truck className="w-5 h-5 text-emerald-300" />}
              >
                <div className="text-xs text-zinc-900">
                  <p className="font-semibold">{p.title}</p>
                  <p className="capitalize text-zinc-700">{p.status.replace(/_/g, " ")}</p>
                </div>
              </MapMarker>
            ))}
          </Map>
        )}
      </div>

      {!isLoading && points.length === 0 && (
        <div className="text-xs text-zinc-500">No shipment locations available yet.</div>
      )}
    </div>
  );
}
