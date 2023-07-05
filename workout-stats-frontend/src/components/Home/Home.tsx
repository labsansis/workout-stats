import { useEffect, useState } from "react";
import { Workout } from "../../models/workout";
import { CardGrid } from "../cards/CardGrid";
import dateFormat from "dateformat";
import { WSTable } from "../WSTable/WSTable";
import { formatDuration } from "../../common/functions";

export function Home({ workouts }: HomeProps) {
  const [strengthWorkouts, setStrengthWorkouts] = useState<Workout[]>([]);

  const MILLISECONDS_IN_WEEK = 1000 * 3600 * 24 * 7;

  useEffect(() => {
    setStrengthWorkouts(
      workouts.filter((w) => w.workoutType === "strength_training")
    );
  }, [workouts]);

  const numWorkoutsPerWeek = (): number => {
    const minTs = Math.min(
      ...strengthWorkouts.map((w) => w.startTime.getTime())
    );
    const maxTs = Math.max(
      ...strengthWorkouts.map((w) => w.startTime.getTime())
    );

    if (maxTs === minTs) return 1;
    const diff = maxTs - minTs;
    const weeks = Math.ceil(diff / MILLISECONDS_IN_WEEK);
    return Math.round(strengthWorkouts.length / weeks);
  };

  const numWorkoutsLast7Days = (): number => {
    return strengthWorkouts.filter(
      (w) => w.startTime.getTime() > new Date().getTime() - MILLISECONDS_IN_WEEK
    ).length;
  };

  const byTimeDescending = (): Workout[] => {
    const ws = [...workouts];
    ws.sort((w1, w2) =>
      w1.startTime > w2.startTime ? -1 : w1.startTime < w2.startTime ? 1 : 0
    );
    return ws;
  };

  return (
    <>
      <CardGrid
        cards={[
          {
            label: "Strength Workouts",
            value: String(strengthWorkouts.length),
          },
          {
            label: "Other activities",
            value: String(workouts.length - strengthWorkouts.length),
          },
          {
            label: "Avg workouts per week",
            value: String(numWorkoutsPerWeek()),
          },
          {
            label: "Workouts in last 7 days",
            value: String(numWorkoutsLast7Days()),
          },
        ]}
      />
      <h1 className="pt-7">All activities</h1>
      <WSTable
        headers={["Date", "Workout Name", "Length", "# Sets"]}
        data={workouts.map((w) => [
          dateFormat(w.startTime, "ddd dd mmm yyyy"),
          w.name,
          formatDuration(w.duration),
          (w.exerciseSets && w.exerciseSets.length) || "-",
        ])}
      />
    </>
  );
}

type HomeProps = {
  workouts: Workout[];
};