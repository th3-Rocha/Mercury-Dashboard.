"use client";

import { useMemo } from "react";
import { ArrowRight, Clock, MapPin, PackageCheck } from "lucide-react";
import { useShipmentsContext } from "@/contexts/ShipmentsContext";
import { cn } from "@/lib/utils";

interface EventItem {
  id: string;
  shipmentId: string;
  shipmentTitle: string;
  description: string;
  recordedAt: Date;
  progress: number;
  statusLabel: string;
  locationLabel?: string;
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function ShipmentEventsList({ className }: { className?: string }) {
  const { shipments, isLoading } = useShipmentsContext();

  const events = useMemo<EventItem[]>(() => {
    if (!shipments) return [];

    const list: EventItem[] = [];
    for (const shipment of shipments) {
      const evs = shipment.events || [];
      evs.forEach((ev) => {
        // Progress by distance covered: start -> event -> destination
        const hasCoords =
          typeof shipment.startLat === "number" &&
          typeof shipment.startLng === "number" &&
          typeof shipment.deliveryLat === "number" &&
          typeof shipment.deliveryLng === "number";

        let progress = 0;
        if (hasCoords) {
          const total = haversineKm(
            shipment.startLat,
            shipment.startLng,
            shipment.deliveryLat,
            shipment.deliveryLng
          );
          const covered = haversineKm(
            shipment.startLat,
            shipment.startLng,
            ev.latitude,
            ev.longitude
          );
          if (total > 0) {
            progress = Math.min(100, Math.max(0, Math.round((covered / total) * 100)));
          }
        }

        list.push({
          id: ev.id,
          shipmentId: shipment.id,
          shipmentTitle: shipment.deliveryAddress,
          description: ev.description,
          recordedAt: new Date(ev.recordedAt),
          progress,
          statusLabel: shipment.status,
          locationLabel: `${ev.latitude.toFixed(4)}, ${ev.longitude.toFixed(4)}`,
        });
      });
    }

    return list.sort((a, b) => b.recordedAt.getTime() - a.recordedAt.getTime());
  }, [shipments]);

  if (isLoading) {
    return (
      <div className={cn("space-y-3", className)}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/50 animate-pulse space-y-3">
            <div className="flex justify-between items-start">
              <div className="h-10 w-10 rounded-lg bg-zinc-800/70" />
              <div className="h-6 w-16 rounded bg-zinc-800/70" />
            </div>
            <div className="h-4 w-3/4 rounded bg-zinc-800/70" />
            <div className="h-4 w-1/2 rounded bg-zinc-800/70" />
            <div className="h-2 w-full rounded bg-zinc-800/70" />
          </div>
        ))}
      </div>
    );
  }

  if (!events.length) {
    return (
      <div className={cn("text-sm text-zinc-500 bg-zinc-900/50 border border-zinc-800 rounded-lg p-4", className)}>
        No shipment events recorded yet.
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {events.slice(0, 9).map((item) => (
        <div
          key={item.id}
          className={cn(
            "flex flex-col gap-3 p-4",
            "bg-zinc-900/50 border border-zinc-800 rounded-lg",
            "hover:border-zinc-700 transition-colors"
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="p-2 rounded-lg bg-zinc-800 text-zinc-100">
              <PackageCheck className="w-4 h-4" />
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-zinc-800 text-zinc-300 capitalize">
              {item.statusLabel.replace(/_/g, " ")}
            </span>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-white line-clamp-2">{item.description}</p>
            <p className="text-xs text-zinc-400 line-clamp-1">{item.shipmentTitle}</p>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{item.recordedAt.toLocaleString()}</span>
          </div>

          {item.locationLabel && (
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <MapPin className="w-3.5 h-3.5" />
              <span className="truncate">{item.locationLabel}</span>
            </div>
          )}

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>Progress</span>
              <span className="text-white font-medium">{item.progress}%</span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full"
                style={{ width: `${item.progress}%` }}
              />
            </div>
          </div>


        </div>
      ))}
    </div>
  );
}

