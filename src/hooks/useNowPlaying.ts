import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import * as Location from "expo-location";
import { useShareListening } from "./useShareListening";
import { NowPlaying } from "./useNowPlaying.types";

export function useNowPlaying() {
  const shareListening = useShareListening();

  return useQuery<NowPlaying>({
    queryKey: ["nowPlaying"],
    queryFn: async () => {
      const data = await api<NowPlaying>("/api/now-playing");

      if (data.isPlaying && data.track && data.artist && data.spotifyId) {
        try {
          // Get current location
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status === "granted") {
            const loc = await Location.getCurrentPositionAsync({});

            // Reuse mutation hook
            shareListening.mutate({
              trackName: data.track,
              artistName: data.artist,
              spotifyId: data.spotifyId!,
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
              startedAt: data.startedAt,
              endedAt:   data.endedAt,
              clientAt:  new Date().toISOString(),
            });
          }
        } catch (e) {
          console.warn("Failed to share listening:", e);
        }
      }

      return data;
    },
    refetchInterval: (query) => {
      const data = query.state.data as NowPlaying | undefined;

      if (!data?.isPlaying || !data.durationMs || !data.progressMs) {
        return 15_000; // default poll when idle
      }

      const timeLeft = data.durationMs - data.progressMs;
      return Math.max(timeLeft + 2000, 5000); // sync to track end
    },
  });
}