import { Workout } from "../../models/workout";
import { CardGrid } from "../cards/CardGrid";
import { useRecoilValue } from "recoil";
import {
  strengthWorkoutsState,
  workoutsState,
} from "../../common/recoilStateDefs";
import WorkoutDataFetch from "../WorkoutDataFetch/WorkoutDataFetch";
import YearCalendar from "../YearCalendar/YearCalendar";

export function Home() {
  const strengthWorkouts = useRecoilValue<Workout[]>(strengthWorkoutsState);
  const workouts = useRecoilValue<Workout[]>(workoutsState);

  const MILLISECONDS_IN_WEEK = 1000 * 3600 * 24 * 7;

  const numWorkoutsPerWeek = (): number => {
    const minTs = Math.min(
      ...strengthWorkouts.map((w) => w.startTime.getTime()),
    );
    const maxTs = Math.max(
      ...strengthWorkouts.map((w) => w.startTime.getTime()),
    );

    if (maxTs === minTs) return 1;
    const diff = maxTs - minTs;
    const weeks = Math.ceil(diff / MILLISECONDS_IN_WEEK);
    return Math.round(strengthWorkouts.length / weeks);
  };

  const numWorkoutsLast7Days = (): number => {
    return strengthWorkouts.filter(
      (w) =>
        w.startTime.getTime() > new Date().getTime() - MILLISECONDS_IN_WEEK,
    ).length;
  };

  if (!workouts?.length) {
    return <WorkoutDataFetch />;
  }

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

      <WorkoutCalendar />
    </>
  );
}

function WorkoutCalendar() {
  const strengthWorkouts = useRecoilValue<Workout[]>(strengthWorkoutsState);

  return (
    <>
      <h1 className="mt-10">Calendar</h1>
      <YearCalendar
        weekStartDay={1}
        events={strengthWorkouts.map((w) => {
          return {
            date: w.startTime,
            eventData: w,
          };
        })}
        shadingFn={(dayEvents) => {
          if (dayEvents.length > 1) return "#D946EF";
          if (dayEvents.length === 1) return "#BEF264";
        }}
        labels={{
          "#BEF264": "One workout",
          "#D946EF": "Multiple workouts",
        }}
        eventsFormatFn={(events) => {
          return (
            <div className="w-[15em] sm:w-[20em]">
              {events.map((e) => {
                const w = e.eventData;
                const exercises = [];
                const eset = new Set();
                const hoursMinutes = (d: Date) => {
                  return `${d.getHours().toString().padStart(2, "0")}:${d
                    .getMinutes()
                    .toString()
                    .padStart(2, "0")}`;
                };
                for (let es of w.exerciseSets || []) {
                  if (eset.has(es.exercise.displayName)) continue;
                  eset.add(es.exercise.displayName);
                  exercises.push(es.exercise.displayName);
                }
                let exerciseText = "";
                if (exercises.length === 0) {
                  exerciseText = "No exercises recorded";
                } else if (exercises.length <= 2) {
                  exerciseText = exercises.join(" and ");
                } else {
                  exerciseText =
                    exercises.slice(0, 2).join(", ") +
                    " and " +
                    (exercises.length - 2) +
                    " more";
                }
                return (
                  <div
                    className="text-sm inline-grid grid-cols-[min-content_1fr] gap-1 py-1 border-b last:border-b-0"
                    key={`event-description-${e.date.toDateString()}`}
                  >
                    <div className="font-medium pr-3">
                      {hoursMinutes(e.date)}
                    </div>
                    <div>{exerciseText}</div>
                  </div>
                );
              })}
            </div>
          );
        }}
      />
    </>
  );
}
