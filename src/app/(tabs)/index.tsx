import { View, Text } from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";
import Avatar from "../components/Avatar";
import NowPlaying from "../components/NowPlaying";
import NearbyPlaysList from "../components/NearbyPlaysList";

export default function HomeScreen() {
  return (
    <ScreenWrapper>
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
            <Avatar />
          </View>
          <NowPlaying />
        </View>
        <NearbyPlaysList radiusM={500} lookbackMs={2 * 60 * 60 * 1000} />
      </View>
    </ScreenWrapper>
  );
}
