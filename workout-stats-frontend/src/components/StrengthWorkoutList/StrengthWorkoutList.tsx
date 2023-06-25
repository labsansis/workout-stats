import { ExerciseSet, WeightUnit, Workout } from "../../models/workout";
import dateFormat from "dateformat";
import { WSTable } from "../WSTable/WSTable";
import { formatDuration } from "../../common/functions";

export function StrengthWorkoutList({ workouts }: StrengthWorkoutListProps) {
  workouts = [...workouts.filter((w) => w.workoutType === "strength_training")];
  // sort in reverse order by date
  workouts.sort((w1, w2) =>
    w1.startTime > w2.startTime ? -1 : w1.startTime < w2.startTime ? 1 : 0
  );

  const formatWeight = (es: ExerciseSet): string => {
    if (!es.weight || es.weight <= 0) return "-";
    return String(es.weight);
  };

  return (
    <>
      <h1>Strength workouts</h1>
      {workouts.map((w) => (
        <div className="mb-10">
          <div className="text-lg mb-4">
            {dateFormat(w.startTime, "ddd dd mmm yyyy")} | {w.name} |{" "}
            {formatDuration(w.duration)}
          </div>
          <WSTable
            headers={["Exercise", "Weight", "Reps", "Time"]}
            data={(w.exerciseSets || []).map((es) => [
              es.exercise.displayName,
              formatWeight(es),
              es.repetitionCount,
              formatDuration(es.duration),
            ])}
            fixed
            lightHeader
          />
        </div>
      ))}
    </>
  );
}

type StrengthWorkoutListProps = {
  workouts: Workout[];
};
