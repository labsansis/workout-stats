import { useRef, useState } from "react";
import { Exercise, ExerciseSet, Workout } from "../../models/workout";
import { WSTable } from "../WSTable/WSTable";
import dateFormat from "dateformat";

export function ExercisesSummary({ workouts }: ExercisesSummaryProps) {
  const [exerciseToPlot, setExerciseToPlot] = useState("");
  const plotRef = useRef<HTMLDivElement>(null);

  const handlePlotButtonClick = (key: string) => {
    setExerciseToPlot(key);
    if (plotRef.current) plotRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const setsByExercise: { [exerciseName: string]: ExerciseSet[] } = {};
  for (let w of workouts) {
    if (!w.exerciseSets) continue;
    for (let es of w.exerciseSets) {
      if (!(es.exercise.name in setsByExercise)) {
        setsByExercise[es.exercise.name] = [];
      }
      setsByExercise[es.exercise.name].push(es);
    }
  }

  return (
    <>
      <h1>Exercises</h1>
      <WSTable
        headers={["Exercise", "Total sets", "PR", "Last done", ""]}
        data={Object.keys(setsByExercise).map((k) => [
          setsByExercise[k][0].exercise.displayName,
          setsByExercise[k].length,
          setsByExercise[k]
            .map((es) => Math.max(es.weight || 0, 0))
            .reduce((weight1, weight2) => Math.max(weight1, weight2)) || "-",
          dateFormat(
            setsByExercise[k]
              .map((es) => es.startTime)
              .reduce((d1, d2) => (d1 > d2 ? d1 : d2)),
            "ddd dd mmm yyyy"
          ),
          <button
            onClick={() => handlePlotButtonClick(k)}
            className="bg-blue-600 text-white rounded-full px-2 font-medium text-s shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-blue-500 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
          >
            Plot
          </button>,
        ])}
      />
      <div className="mt-10" ref={plotRef}>
        {exerciseToPlot}
      </div>
    </>
  );
}

type ExercisesSummaryProps = {
  workouts: Workout[];
};
