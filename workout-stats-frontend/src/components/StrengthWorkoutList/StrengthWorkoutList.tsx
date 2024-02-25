import dateFormat from "dateformat";
import { WSTable } from "../WSTable/WSTable";
import {
  convertWeight,
  formatDuration,
  formatWeightDecimals,
} from "../../common/functions";
import { ReactElement, useState } from "react";
import "./StrengthWorkoutList.css";
import { useRecoilValue } from "recoil";
import { strengthWorkoutsState, userState } from "../../common/recoilStateDefs";
import WorkoutDataFetch from "../WorkoutDataFetch/WorkoutDataFetch";
import { Workout } from "../../models/workout";
import { BiCollapseVertical, BiExpandVertical } from "react-icons/bi";

export function StrengthWorkoutList() {
  const workouts = [...useRecoilValue(strengthWorkoutsState)];
  // sort in reverse order by date
  workouts.sort((w1, w2) =>
    w1.startTime > w2.startTime ? -1 : w1.startTime < w2.startTime ? 1 : 0,
  );

  if (!workouts?.length) {
    return <WorkoutDataFetch />;
  }

  return (
    <>
      <h1>Strength workouts</h1>
      {workouts.map((w) => (
        <StrengthWorkoutTable
          key={`workout-table-${w.sourceWorkoutId}`}
          workout={w}
        />
      ))}
    </>
  );
}

type CondensedExerciseData = {
  exerciseName: string;
  maxWeight: number;
  sets: number;
  totalReps: number;
};

function StrengthWorkoutTable({ workout }: StrengthWorkoutTableProps) {
  const [condensed, setCondensed] = useState(true);
  const user = useRecoilValue(userState);

  const weightUnit = user?.preferredUnits === "imperial" ? "lbs" : "kg";

  const formatWeight = (weight: number | undefined): string | ReactElement => {
    if (!weight || weight <= 0) return "-";
    return (
      <>
        {formatWeightDecimals(convertWeight(weight, user))}{" "}
        <span className="text-gray-400">{weightUnit}</span>
      </>
    );
  };

  const genFullView = () => {
    return (
      <WSTable
        key={`stregnth-list-table-full-${workout.sourceWorkoutId}`}
        headers={["Exercise", "Weight", "Reps", "Time"]}
        data={(workout.exerciseSets || []).map((es) => [
          es.exercise.displayName,
          formatWeight(es.weight),
          es.repetitionCount,
          formatDuration(es.duration),
        ])}
        fixed
        lightHeader
      />
    );
  };

  const genCondensedView = () => {
    const condensedByExercise: { [key: string]: CondensedExerciseData } = {};
    for (let es of workout.exerciseSets || []) {
      const en = es.exercise.displayName;
      const ced = condensedByExercise[en] || {
        exerciseName: en,
        maxWeight: 0,
        sets: 0,
        totalReps: 0,
      };
      ced.maxWeight = Math.max(ced.maxWeight, es.weight || 0);
      ced.sets += 1;
      ced.totalReps += es.repetitionCount;
      condensedByExercise[en] = ced;
    }

    const condensedArr: CondensedExerciseData[] = [];
    const seen = new Set();
    for (let es of workout.exerciseSets || []) {
      const en = es.exercise.displayName;
      if (seen.has(en)) continue;
      seen.add(en);
      condensedArr.push(condensedByExercise[en]);
    }

    return (
      <WSTable
        key={`stregnth-list-table-condensed-${workout.sourceWorkoutId}`}
        headers={["Exercise", "Max Weight", "Sets", "Total Reps"]}
        data={condensedArr.map((ced) => [
          ced.exerciseName,
          formatWeight(ced.maxWeight),
          ced.sets,
          ced.totalReps,
        ])}
        fixed
        lightHeader
      />
    );
  };

  return (
    <div className="mb-4">
      <div className="workout-title">
        <button onClick={() => setCondensed(!condensed)} className="px-2">
          {condensed ? (
            <BiExpandVertical className="text-cyan-800" />
          ) : (
            <BiCollapseVertical className="text-cyan-800" />
          )}
        </button>
        {dateFormat(workout.startTime, "ddd dd mmm yyyy")} | {workout.name} |{" "}
        {formatDuration(workout.duration)}
      </div>
      {condensed ? genCondensedView() : genFullView()}
    </div>
  );
}

type StrengthWorkoutTableProps = {
  workout: Workout;
};
