import { useMe } from "../../hooks/useMe";
import { Text, TouchableOpacity, Image } from "react-native";

export default function Avatar() {
  const { data, isLoading } = useMe();
  
  return (
    !isLoading && <TouchableOpacity
      onPress={() => {
        // later: router.push("/profile")
      }}
      className="w-10 h-10 rounded-full overflow-hidden bg-white/20 items-center justify-center"
    >
      {data?.avatarUrl ? (
        <Image
          source={{ uri: data?.avatarUrl }}
          className="w-full h-full"
          resizeMode="cover"
        />
      ) : (
        <Text className="text-white font-bold">
          {data?.display_name?.charAt(0) ?? "?"}
        </Text>
      )}
    </TouchableOpacity>
  )
};