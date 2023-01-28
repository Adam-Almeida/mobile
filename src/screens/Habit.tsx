import { useRoute } from "@react-navigation/native";
import { Alert, ScrollView, Text, View } from "react-native";
import dayjs from "dayjs";
import { BackButton } from "../components/BackButton";
import { ProgressBar } from "../components/ProgressBar";
import { Checkbox } from "../components/Checkbox";
import { useEffect, useState } from "react";
import { Loading } from "../components/Loading";
import { api } from "../lib/axios";
import { generateProgressPercentage } from "../utils/generate-progress-percentage";
import { HabitsEmpty } from "../components/HabitsEmpty";
import clsx from "clsx";

interface Params {
  date: string;
}

interface DayInfoProps {
  completedHabits: string[];
  possibleHabits: {
    id: string;
    title: string;
  }[];
}

export function Habit() {
  const [loading, setLoading] = useState(true);
  const [dayInfo, setDayInfo] = useState<DayInfoProps | null>(null);
  const [completedHabits, setCompletedhabits] = useState<string[]>([]);

  const route = useRoute();
  const { date } = route.params as Params;

  const parsedDate = dayjs(date);
  const isDateInPast = parsedDate.endOf("day").isBefore(new Date());
  const dayOfWeek = parsedDate.format("dddd");
  const dayOfMonth = parsedDate.format("DD/MM");

  async function fetchHabits() {
    try {
      setLoading(true);
      const response = await api.get("/day", { params: { date } });
      setDayInfo(response.data);
      setCompletedhabits(response.data.completedHabits);
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Ops",
        "Nao foi possivel carregas as informacoes dos habitos"
      );
    } finally {
      setLoading(false);
    }
  }

  const habitsProgress = dayInfo?.possibleHabits.length
    ? generateProgressPercentage(
        dayInfo.possibleHabits.length,
        completedHabits.length
      )
    : 0;

  async function handleToggleHabit(habitId: string) {
    try {
      await api.patch(`/habits/${habitId}/toogle`);

      if (completedHabits.includes(habitId)) {
        setCompletedhabits((prevstate) =>
          prevstate.filter((habit) => habit !== habitId)
        );
      } else {
        setCompletedhabits((prevstate) => [...prevstate, habitId]);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Ops", "Nao foi possivel atualizar o status do habito.");
    }
  }

  useEffect(() => {
    fetchHabits();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />
        <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
          {dayOfWeek}
        </Text>
        <Text className=" text-white font-extrabold text-3xl">
          {dayOfMonth}
        </Text>
        <ProgressBar progress={habitsProgress} />
        <View
          className={clsx("mt-6", {
            ["opacity-50"]: isDateInPast,
          })}
        >
          {dayInfo?.possibleHabits ? (
            dayInfo.possibleHabits.map((habit) => (
              <Checkbox
                key={habit.id}
                title={habit.title}
                checked={completedHabits.includes(habit.id)}
                onPress={() => handleToggleHabit(habit.id)}
                disabled={isDateInPast}
              />
            ))
          ) : (
            <HabitsEmpty />
          )}
        </View>
        {isDateInPast && (
          <Text className="text-zinc-600 text-sm text-center mt-10">
            Voce nao pode editar habitos de uma data passada
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
