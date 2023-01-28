import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export function HabitsEmpty() {
  const { navigate } = useNavigation();

  return (
    <View className="flex-col items-center flex w-full h-full justify-center gap-2">
      <Ionicons name="warning-outline" size={50} color="#3f3e19" />
      <Text className="text-zinc-600 text-sm text-center">
        Voce ainda nao esta monitorando nenhum habito,{" "}
        <Text className="text-lime-400 text-sm" onPress={() => navigate("new")}>
          comece cadastrando um.
        </Text>
      </Text>
    </View>
  );
}
