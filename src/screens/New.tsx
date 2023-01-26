import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { BackButton } from "../components/BackButton";
import { Checkbox } from "../components/Checkbox";
import { Feather } from "@expo/vector-icons";
import colors from "tailwindcss/colors";
import { api } from "../lib/axios";
import { useState } from "react";

const availableWeekDays = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sábado",
];

export function New() {
  const [title, setTitle] = useState("");
  const [weekDays, setWeekDay] = useState<number[]>([]);

  function handleToogleWeekDay(weekDayIndex: number) {
    if (weekDays.includes(weekDayIndex)) {
      setWeekDay((prevState) =>
        prevState.filter((weekDay) => weekDay !== weekDayIndex)
      );
    } else {
      setWeekDay((prevState) => [...prevState, weekDayIndex]);
    }
  }

  async function handleCreatenewHabit() {
    try {
      if (!title.trim() || weekDays.length === 0) {
        Alert.alert(
          "Novo Habito",
          "Informe o nome do habito e escolha a periodicidade"
        );
      }
      await api.post("/habits", { title, weekDays });

      setTitle("");
      setWeekDay([]);
      Alert.alert("Novo Habito", "Habito criado com sucesso");
    } catch (error) {
      console.log(error);
      Alert.alert("Ops", "Nao foi possivel criar o novo habito");
    }
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />
        <Text className="mt-6 text-white font-extrabold text-3xl">
          Criar hábito
        </Text>
        <Text className="mt-4 text-white font-semibold text-base">
          Qual o seu comprometimento?
        </Text>

        <TextInput
          className="h-12 pl-4 rounded-lg mt-3  bg-zinc-800 text-white focus:border-2 focus:border-lime-400"
          placeholder="ex: Exercícios, dormir bem, etc..."
          placeholderTextColor={colors.zinc[400]}
          onChangeText={setTitle}
          value={title}
        />
        <Text className="mt-4 mb-3 text-white font-semibold text-base">
          Qual a recorrência?
        </Text>
        {availableWeekDays.map((weekday, index) => (
          <Checkbox
            key={weekday}
            title={weekday}
            checked={weekDays.includes(index)}
            onPress={() => handleToogleWeekDay(index)}
          />
        ))}
        <TouchableOpacity
          activeOpacity={0.7}
          className="w-full h-14 flex-row items-center justify-center bg-lime-600 rounded-md mt-6"
          onPress={() => handleCreatenewHabit()}
        >
          <Feather name="check" size={20} color={colors.white} />
          <Text className="font-semibold tex-base text-white ml-2">
            Confirmar
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
