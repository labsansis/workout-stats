import { useRef, useState } from "react";
import { ExerciseSet, Workout } from "../../models/workout";
import { WSTable } from "../WSTable/WSTable";
import dateFormat from "dateformat";
import Chart, { Props as ApexChartProps } from "react-apexcharts";

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

  const getExercisePR = (key: string): number => {
    return setsByExercise[key]
      .map((es) => Math.max(es.weight || 0, 0))
      .reduce((weight1, weight2) => Math.max(weight1, weight2));
  };

  const getLatestDate = (key: string): Date => {
    return setsByExercise[key]
      .map((es) => es.startTime)
      .reduce((d1, d2) => (d1 > d2 ? d1 : d2));
  };

  /**
   * Scans through all sets of the given exercise and produces a series at daily granularity.
   * `dates` is a list of strings in the shape "01 Jan 2022", all unique and sorted in ascending order.
   * `weights` is the highest weight of that day corresponding to every element of `dates`.
   */
  const extractExerciseWeightSeries = (
    exerciseKey: string
  ): { dates: string[]; weights: number[] } => {
    const weightByDay: { [day: string]: { weight: number; date: Date } } = {};
    for (let es of setsByExercise[exerciseKey]) {
      let ds = dateFormat(es.startTime, "dd mmm yyyy");
      weightByDay[ds] = {
        weight: Math.max(weightByDay[ds]?.weight || 0, es.weight || 0),
        date: es.startTime,
      };
    }

    const dayDateWeight = Object.keys(weightByDay).map((day) => {
      return {
        day,
        date: weightByDay[day].date,
        weight: weightByDay[day].weight,
      };
    });
    dayDateWeight.sort((a, b) =>
      a.date > b.date ? 1 : a.date < b.date ? -1 : 0
    );
    // what we called "day" before interally now becomes "date" for external use
    const dates = dayDateWeight.map((ddw) => ddw.day);
    const weights = dayDateWeight.map((ddw) => ddw.weight);
    return { dates, weights };
  };

  const prepChartProps = (exerciseKey: string): ApexChartProps => {
    let { dates, weights } = extractExerciseWeightSeries(exerciseKey);
    return {
      type: "line",
      series: [
        {
          name: setsByExercise[exerciseKey][0].exercise.displayName,
          data: weights,
        },
      ],
      options: {
        title: {
          text: setsByExercise[exerciseKey][0].exercise.displayName,
        },
        labels: dates,
        xaxis: {
          type: "datetime",
        },
        yaxis: {
          title: {
            text: "Weight (kg)",
          },
        },
        markers: {
          size: 2,
        },
      },
    };
  };

  return (
    <>
      <h1>Exercises</h1>
      <WSTable
        headers={["Exercise", "Total sets", "PR", "Last done", ""]}
        data={Object.keys(setsByExercise).map((k) => [
          setsByExercise[k][0].exercise.displayName,
          setsByExercise[k].length,
          getExercisePR(k) || "-",
          dateFormat(getLatestDate(k), "ddd dd mmm yyyy"),
          <button
            onClick={() => handlePlotButtonClick(k)}
            className="bg-blue-600 text-white rounded-full px-2 font-medium text-s shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-blue-500 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
          >
            Plot
          </button>,
        ])}
      />
      <div className="mt-10 w-full lg:w-1/2" ref={plotRef}>
        {exerciseToPlot && <Chart {...prepChartProps(exerciseToPlot)} />}
      </div>
    </>
  );
}

type ExercisesSummaryProps = {
  workouts: Workout[];
};
