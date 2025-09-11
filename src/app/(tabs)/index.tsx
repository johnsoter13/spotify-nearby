import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

interface NearbyListener {
  id: number;
  name: string;
  distance: string;
  track: string;
  artist: string;
  genre: string;
  energy: number;
}

interface TrendingTrack {
  id: number;
  track: string;
  artist: string;
  plays: number;
  genre: string;
}

export default function HomeScreen() {
  const [currentTab, setCurrentTab] = useState<"discover" | "trending">(
    "discover"
  );
  const [likedTracks, setLikedTracks] = useState<Set<number>>(new Set());

  const nearbyListeners: NearbyListener[] = [
    { id: 1, name: "Alex", distance: "50m", track: "Midnight City", artist: "M83", genre: "Electronic", energy: 85 },
    { id: 2, name: "Sarah", distance: "120m", track: "Blinding Lights", artist: "The Weeknd", genre: "Pop", energy: 92 },
    { id: 3, name: "Mike", distance: "200m", track: "Bohemian Rhapsody", artist: "Queen", genre: "Rock", energy: 78 },
  ];

  const trendingNearby: TrendingTrack[] = [
    { id: 1, track: "As It Was", artist: "Harry Styles", plays: 23, genre: "Pop" },
    { id: 2, track: "Heat Waves", artist: "Glass Animals", plays: 18, genre: "Indie" },
    { id: 3, track: "Stay", artist: "The Kid LAROI", plays: 15, genre: "Pop" },
  ];

  const currentlyPlaying = {
    track: "Industry Baby",
    artist: "Lil Nas X ft. Jack Harlow",
    isSharing: true,
  };

  const toggleLike = (id: number) => {
    const newLiked = new Set(likedTracks);
    if (newLiked.has(id)) {
      newLiked.delete(id);
    } else {
      newLiked.add(id);
    }
    setLikedTracks(newLiked);
  };

  return (
    <LinearGradient
      colors={["#6b21a8", "#1e3a8a", "#312e81"]} // purple-900 → blue-900 → indigo-900
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{flex: 1}}
    >
      <View className="flex-1 text-white">
        <View className="px-6 pt-12 pb-6">
          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-2xl font-bold text-white">Discover</Text>
              <View className="flex-row items-center gap-1 mt-1">
                <Text className="text-purple-200 text-sm">
                  Downtown Vancouver • 12 listeners nearby
                </Text>
              </View>
            </View>
          </View>
          {currentlyPlaying.isSharing && (
            <View className="bg-white/15 rounded-2xl p-4 mb-6 border border-white/20">
              <View className="flex-row items-center gap-3">
                <View className="flex-1">
                  <Text className="text-xs text-green-300">You're sharing</Text>
                  <Text className="font-semibold text-sm text-white">
                    {currentlyPlaying.track}
                  </Text>
                  <Text className="text-xs text-gray-300">
                    {currentlyPlaying.artist}
                  </Text>
                </View>
                <View className="w-2 h-2 bg-green-400 rounded-full" />
              </View>
            </View>
          )}
        </View>
        <View className="px-6 mb-6">
          <View className="flex-row bg-white/10 rounded-full p-1">
            <TouchableOpacity
              onPress={() => setCurrentTab("discover")}
              className={`flex-1 py-2 rounded-full items-center ${
                currentTab === "discover" ? "bg-white" : ""
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  currentTab === "discover" ? "text-purple-900" : "text-white/70"
                }`}
              >
                Discover
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setCurrentTab("trending")}
              className={`flex-1 py-2 rounded-full items-center ${
                currentTab === "trending" ? "bg-white" : ""
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  currentTab === "trending" ? "text-purple-900" : "text-white/70"
                }`}
              >
                Trending
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView className="flex-1 px-6 pb-20">
          {currentTab === "discover" ? (
            <View>
              <Text className="text-lg font-semibold text-white mb-4">
                People Around You
              </Text>
              {nearbyListeners.map((listener) => (
                <View
                  key={listener.id}
                  className="bg-white/10 rounded-xl p-4 mb-3 border border-white/20"
                >
                  <View className="flex-row items-center gap-3">
                    <View className="flex-1">
                      <Text className="font-medium text-sm text-white">
                        {listener.name} • {listener.distance}
                      </Text>
                      <Text className="font-semibold text-sm text-white">
                        {listener.track}
                      </Text>
                      <Text className="text-gray-300 text-xs">{listener.artist}</Text>
                    </View>
                    <View className="flex-col gap-2">
                      <TouchableOpacity
                        onPress={() => toggleLike(listener.id)}
                        className={`w-8 h-8 rounded-full items-center justify-center ${
                          likedTracks.has(listener.id) ? "bg-red-500" : "bg-white/20"
                        }`}
                      >
                      </TouchableOpacity>
                      <TouchableOpacity className="w-8 h-8 bg-green-500 rounded-full items-center justify-center">
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View>
              <Text className="text-lg font-semibold text-white mb-4">
                Trending in Your Area
              </Text>
              {trendingNearby.map((track, index) => (
                <View
                  key={track.id}
                  className="bg-white/10 rounded-xl p-4 mb-3 border border-white/20"
                >
                  <View className="flex-row items-center gap-4">
                    <View className="w-8 h-8 bg-yellow-400 rounded-full items-center justify-center">
                      <Text className="text-xs font-bold">{index + 1}</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="font-semibold text-sm text-white">
                        {track.track}
                      </Text>
                      <Text className="text-gray-300 text-xs">{track.artist}</Text>
                    </View>
                    <TouchableOpacity className="w-10 h-10 bg-green-500 rounded-full items-center justify-center">
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </LinearGradient>
  );
}
