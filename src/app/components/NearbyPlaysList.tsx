import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import {
  useCurrentPosition,
  useOverlaps,
  haversineMeters,
  metersToHuman,
} from "../../hooks/useOverlaps";
import { OverlapSession } from "../../hooks/useOverlaps.types";

type Props = {
  radiusM?: number;
  lookbackMs?: number;
  title?: string;
};

export default function NearbyPlaysList({
  radiusM = 500,
  lookbackMs = 2 * 60 * 60 * 1000,
  title = "Played Near You",
}: Props) {
  // Hooks: location + overlaps
  const { coords, status: locStatus } = useCurrentPosition();
  const { data, isLoading, isFetching, refetch } = useOverlaps({ coords, radiusM, lookbackMs });

  // Enrich with client-side distance; newest first
  const sessions = useMemo<(OverlapSession & { distanceMeters: number | null })[]>(
    () => {
      if (!data) return [];
      return data
        .map((s) => {
          const d =
            coords && s.latitude != null && s.longitude != null
              ? haversineMeters(coords.lat, coords.lng, s.latitude!, s.longitude!)
              : null;
          return { ...s, distanceMeters: d };
        })
        .sort((a, b) => (a.startedAt < b.startedAt ? 1 : -1));
    },
    [data, coords]
  );

  return (
    <ScrollView className="flex-1 px-6 pb-20">
      <View>
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-lg font-semibold text-white">{title}</Text>
          <TouchableOpacity onPress={() => refetch()}>
            <Text className="text-purple-200 text-xs underline">
              {isFetching ? "Refreshing…" : "Refresh"}
            </Text>
          </TouchableOpacity>
        </View>

        {locStatus === "loading" && (
          <View className="py-4">
            <ActivityIndicator />
            <Text className="text-white/70 mt-2">Getting your location…</Text>
          </View>
        )}

        {locStatus === "denied" && (
          <Text className="text-white/70 mt-2">
            Location permission denied — enable it to see nearby plays.
          </Text>
        )}

        {coords && isLoading && (
          <Text className="text-white/70 mt-2">Loading nearby plays…</Text>
        )}

        {coords && !isLoading && sessions.length === 0 && (
          <Text className="text-white/70 mt-2">No recent plays nearby.</Text>
        )}

        {sessions.map((s) => (
          <View
            key={s.id}
            className="bg-white/10 rounded-xl p-4 mb-3 border border-white/20"
          >
            <View className="flex-row items-center gap-3">
              <View className="flex-1">
                <Text className="font-medium text-sm text-white">
                  {s.user?.displayName ?? "Someone nearby"}
                  {s.distanceMeters != null ? ` • ${metersToHuman(s.distanceMeters)}` : ""}
                </Text>
                <Text className="font-semibold text-sm text-white">{s.trackName}</Text>
                <Text className="text-gray-300 text-xs">{s.artistName}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
