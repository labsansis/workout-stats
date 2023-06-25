import { Workout } from "../../models/workout"
import dateFormat from "dateformat";
import { WSTable } from "../WSTable/WSTable";

export function WorkoutSummary({ workouts }: WorkoutSummaryProps) {
    workouts = [...workouts];
    // sort in reverse order by date
    workouts.sort((w1, w2) => w1.startTime > w2.startTime ? -1 : (w1.startTime < w2.startTime ? 1 : 0));

    const formatDuration = (duration: number): string => {
        let h = Math.floor(duration / 3600);
        let m = Math.floor((duration % 3600) / 60);
        let s = Math.floor(duration % 60);
        return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
    }

    return <div>
        <h1>Workout summary</h1>
        <WSTable headers={["Date", "Workout Name", "Length", "# Sets"]} data={workouts.map(w => [
            dateFormat(w.startTime, "ddd dd mmm yyyy"),
            w.name,
            formatDuration(w.duration),
            (w.exerciseSets && w.exerciseSets.length) || "-"
        ])} />
    </div>
}


type WorkoutSummaryProps = {
    workouts: Workout[]
}