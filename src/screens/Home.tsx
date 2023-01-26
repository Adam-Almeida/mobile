import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Text, View, ScrollView, Alert } from "react-native";
import { HabitDay, DAY_SIZE } from "../components/HabitDay";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { api } from "../lib/axios";
import { generateDatesFromYearBeginning } from "../utils/generate-dates-from-year-beginning";

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];
const datesFromYearsStart = generateDatesFromYearBeginning();
const minimumSummaryDateSize = 18 * 5;
const amountOfDaysToFill = minimumSummaryDateSize - datesFromYearsStart.length;

type SummaryProps = Array<{
  id: string;
  date: string;
  amount: number;
  completed: number;
}>;

export function Home() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<SummaryProps | null>(null);
  const { navigate } = useNavigation();

  async function fetchData() {
    try {
      setLoading(true);
      const response = await api.get("/summary");
      setSummary(response.data);
    } catch (error) {
      Alert.alert("Ops", "Nao foi possivel carregar o sumario de habitos");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <View className="bg-background px-8 pt-16 flex-1">
      <Header />
      <View className="flex-row mt-6 mb-2">
        {weekDays.map((day, i) => {
          return (
            <Text
              className="text-zinc-400 text-xl font-bold text-center mx-1"
              style={{ width: DAY_SIZE }}
              key={`${day}-${i}`}
            >
              {day}
            </Text>
          );
        })}
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {summary && (
          <View className="flex-row flex-wrap">
            {datesFromYearsStart.map((date) => {
              const dayWitHabits = summary.find((day) => {
                return dayjs(date).isSame(day.date, "day");
              });
              return (
                <HabitDay
                  key={date.toISOString()}
                  date={date}
                  amountOfHabits={dayWitHabits?.amount}
                  amountCompleted={dayWitHabits?.completed}
                  onPress={() =>
                    navigate("habit", { date: date.toISOString() })
                  }
                />
              );
            })}

            {amountOfDaysToFill > 0 &&
              Array.from({ length: amountOfDaysToFill }).map((_, i) => {
                return (
                  <View
                    className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                    style={{ width: DAY_SIZE, height: DAY_SIZE }}
                    key={i}
                  />
                );
              })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
