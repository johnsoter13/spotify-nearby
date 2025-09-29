import { View, Text } from "react-native";
import { useNowPlaying } from "../../hooks/useNowPlaying";

export default function NowPlaying(){
  const { data, isLoading } = useNowPlaying();

  if (isLoading) return <Text>Loading...</Text>;
  if (!data?.isPlaying) return <Text>Not playing anything</Text>;

  return (
    <View className="bg-white/15 rounded-2xl p-4 mb-6 border border-white/20">
      <View className="flex-row items-center gap-3">
        <View className="flex-1">
          <Text className="text-xs text-green-300">You're sharing</Text>
          <Text className="font-semibold text-sm text-white">
            {data.track}
          </Text>
          <Text className="text-xs text-gray-300">
            {data.artist}
          </Text>
        </View>
        <View className="w-2 h-2 bg-green-400 rounded-full" />
      </View>
    </View>
  );
}