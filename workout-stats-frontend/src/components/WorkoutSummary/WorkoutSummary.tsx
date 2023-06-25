import { Workout } from "../../models/workout";
import dateFormat from "dateformat";
import { WSTable } from "../WSTable/WSTable";
import { formatDuration } from "../../common/functions";

export function WorkoutSummary({ workouts }: WorkoutSummaryProps) {
  workouts = [...workouts];
  // sort in reverse order by date
  workouts.sort((w1, w2) =>
    w1.startTime > w2.startTime ? -1 : w1.startTime < w2.startTime ? 1 : 0
  );

  return (
    <div>
      <h1>Workout summary</h1>
      <WSTable
        headers={["Date", "Workout Name", "Length", "# Sets"]}
        data={workouts.map((w) => [
          dateFormat(w.startTime, "ddd dd mmm yyyy"),
          w.name,
          formatDuration(w.duration),
          (w.exerciseSets && w.exerciseSets.length) || "-",
        ])}
      />
    </div>
  );
}

type WorkoutSummaryProps = {
  workouts: Workout[];
};
