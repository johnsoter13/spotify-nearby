// hooks/useOverlaps.ts
import { useEffect, useMemo, useState } from "react";
import * as Location from "expo-location";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { OverlapSession } from "./useOverlaps.types";

export function useCurrentPosition() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [status, setStatus] = useState<"idle" | "denied" | "loading" | "ready">("idle");

  useEffect(() => {
    (async () => {
      setStatus("loading");
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return setStatus("denied");
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setCoords({ lat: loc.coords.latitude, lng: loc.coords.longitude });
      setStatus("ready");
    })();
  }, []);

  return { coords, status };
}

function isoNowMinus(ms: number) {
  return new Date(Date.now() - ms).toISOString();
}

export function useOverlaps({
  coords,
  radiusM = 500,
  lookbackMs = 2 * 60 * 60 * 1000,
}: {
  coords: { lat: number; lng: number } | null;
  radiusM?: number;
  lookbackMs?: number;
}) {
  const path = useMemo(() => {
    if (!coords) return null;
    const start = isoNowMinus(lookbackMs);
    const end = new Date().toISOString();
    const qs = new URLSearchParams({
      lat: String(coords.lat),
      lng: String(coords.lng),
      radius: String(radiusM),
      start,
      end,
    }).toString();
    return `/api/listening/overlaps?${qs}`;
  }, [coords, radiusM, lookbackMs]);

  return useQuery({
    queryKey: ["overlaps", path],
    enabled: !!path,
    queryFn: ({ signal }) => api<OverlapSession[]>(path!, { method: "GET", signal }),
    staleTime: 20_000,
  });
}

// UI helpers (client-side distance)
export function haversineMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371000;
  const toRad = (v: number) => (v * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function metersToHuman(m: number | null) {
  if (m == null) return "";
  return m < 1000 ? `${Math.round(m)}m` : `${(m / 1000).toFixed(1)}km`;
}
