import { Workout } from "../../models/workout";
import dateFormat from "dateformat";
import { WSTable } from "../WSTable/WSTable";
import { formatDuration } from "../../common/functions";
import Toggle from "../Toggle/Toggle";
import { useState } from "react";
import "./StrengthWorkoutList.css";

export function StrengthWorkoutList({ workouts }: StrengthWorkoutListProps) {
  const [condensed, setCondensed] = useState(true);
  workouts = [...workouts.filter((w) => w.workoutType === "strength_training")];
  // sort in reverse order by date
  workouts.sort((w1, w2) =>
    w1.startTime > w2.startTime ? -1 : w1.startTime < w2.startTime ? 1 : 0
  );

  const formatWeight = (weight: number | undefined): string => {
    if (!weight || weight <= 0) return "-";
    return String(weight);
  };

  const genFullView = () => {
    return workouts.map((w) => (
      <div className="mb-4">
        <div className="workout-title">
          {dateFormat(w.startTime, "ddd dd mmm yyyy")} | {w.name} |{" "}
          {formatDuration(w.duration)}
        </div>
        <WSTable
          key={`stregnth-list-table-full-${w.sourceWorkoutId}`}
          headers={["Exercise", "Weight", "Reps", "Time"]}
          data={(w.exerciseSets || []).map((es) => [
            es.exercise.displayName,
            formatWeight(es.weight),
            es.repetitionCount,
            formatDuration(es.duration),
          ])}
          fixed
          lightHeader
        />
      </div>
    ));
  };

  const genCondensedView = () => {
    return workouts.map((w) => {
      const condensedByExercise: { [key: string]: CondensedExerciseData } = {};
      for (let es of w.exerciseSets || []) {
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
      for (let es of w.exerciseSets || []) {
        const en = es.exercise.displayName;
        if (seen.has(en)) continue;
        seen.add(en);
        condensedArr.push(condensedByExercise[en]);
      }

      return (
        <div className="mb-4">
          <div className="workout-title">
            {dateFormat(w.startTime, "ddd dd mmm yyyy")} | {w.name} |{" "}
            {formatDuration(w.duration)}
          </div>
          <WSTable
            key={`stregnth-list-table-condensed-${w.sourceWorkoutId}`}
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
        </div>
      );
    });
  };

  return (
    <>
      <h1>Strength workouts</h1>
      <div className="mb-10">
        <Toggle
          default={true}
          handleChange={setCondensed}
          label="Condensed view"
        />
      </div>
      {condensed ? genCondensedView() : genFullView()}
    </>
  );
}

type StrengthWorkoutListProps = {
  workouts: Workout[];
};

type CondensedExerciseData = {
  exerciseName: string;
  maxWeight: number;
  sets: number;
  totalReps: number;
};
