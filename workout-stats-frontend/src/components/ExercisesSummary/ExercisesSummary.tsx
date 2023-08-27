import { ReactElement, useRef, useState } from "react";
import { ExerciseSet } from "../../models/workout";
import { WSTable } from "../WSTable/WSTable";
import dateFormat from "dateformat";
import Chart, { Props as ApexChartProps } from "react-apexcharts";
import { useRecoilValue } from "recoil";
import { strengthWorkoutsState } from "../../common/recoilStateDefs";
import WorkoutDataFetch from "../WorkoutDataFetch/WorkoutDataFetch";
import { sortBy } from "lodash";

export function ExercisesSummary() {
  const [exerciseToPlot, setExerciseToPlot] = useState("");
  const plotRef = useRef<HTMLDivElement>(null);
  const workouts = useRecoilValue(strengthWorkoutsState);

  const handlePlotButtonClick = (key: string) => {
    setExerciseToPlot(key);
    if (plotRef.current) plotRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const setsByExercise: {
    [exerciseName: string]: ExerciseSetWithWorkoutStartTime[];
  } = {};
  for (let w of workouts) {
    if (!w.exerciseSets) continue;
    for (let es of w.exerciseSets) {
      if (!(es.exercise.name in setsByExercise)) {
        setsByExercise[es.exercise.name] = [];
      }
      setsByExercise[es.exercise.name].push({
        ...es,
        workoutStartTime: w.startTime,
      });
    }
  }

  const getExercisePR = (key: string): ReactElement => {
    const { weight, reps } = setsByExercise[key]
      .map((es) => {
        return { weight: es.weight || 0, reps: es.repetitionCount || 0 };
      })
      .reduce((a, b) => {
        return {
          weight: Math.max(a.weight, b.weight),
          reps: Math.max(a.reps, b.reps),
        };
      });
    if (weight > 0) {
      return (
        <>
          {weight} <span className="text-gray-400">kg</span>
        </>
      );
    }
    return (
      <>
        {reps} <span className="text-gray-400">reps</span>
      </>
    );
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
  const extractExercisePRSeries = (
    exerciseKey: string,
  ): { dates: string[]; prs: number[]; metricKey: string } => {
    const prByDay: {
      [day: string]: { weight: number; reps: number; date: Date };
    } = {};
    for (let es of setsByExercise[exerciseKey]) {
      let ds = dateFormat(es.workoutStartTime, "dd mmm yyyy");

      prByDay[ds] = {
        weight: Math.max(prByDay[ds]?.weight || 0, es.weight || 0),
        reps: Math.max(prByDay[ds]?.reps || 0, es.repetitionCount || 0),
        date: es.workoutStartTime,
      };
    }

    const dayDatePR = Object.keys(prByDay).map((day) => {
      return {
        day,
        date: prByDay[day].date,
        weight: prByDay[day].weight,
        reps: prByDay[day].reps,
      };
    });
    dayDatePR.sort((a, b) => (a.date > b.date ? 1 : a.date < b.date ? -1 : 0));
    // what we called "day" before interally now becomes "date" for external use
    const dates = dayDatePR.map((ddw) => ddw.day);
    const weights = dayDatePR.map((ddw) => ddw.weight);
    const reps = dayDatePR.map((ddw) => ddw.reps);
    const metricKey = Math.max(...weights) > 0 ? "kg" : "reps";
    const prs = Math.max(...weights) > 0 ? weights : reps;
    return { dates, prs, metricKey };
  };

  const prepChartProps = (exerciseKey: string): ApexChartProps => {
    let { dates, prs, metricKey } = extractExercisePRSeries(exerciseKey);
    return {
      type: "line",
      series: [
        {
          name: setsByExercise[exerciseKey][0].exercise.displayName,
          data: prs,
        },
      ],
      options: {
        title: {
          text: setsByExercise[exerciseKey][0].exercise.displayName,
        },
        colors: ["#155D75"],
        labels: dates,
        xaxis: {
          type: "datetime",
        },
        yaxis: {
          title: {
            text: metricKey === "kg" ? "Weight (kg)" : "Reps",
          },
        },
        markers: {
          size: 2,
        },
      },
    };
  };

  if (!workouts?.length) {
    return <WorkoutDataFetch />;
  }

  return (
    <>
      <h1>Exercises</h1>
      <WSTable
        headers={["Exercise", "Total sets", "PR", "Last done", ""]}
        // look into a table solution to not have to do the sorting manually
        data={sortBy(
          Object.keys(setsByExercise).map((key) => {
            return { key, sets: setsByExercise[key] };
          }),
          (o) => o.key,
        ).map(({ key, sets }) => [
          sets[0].exercise.displayName,
          sets.length,
          getExercisePR(key) || "-",
          dateFormat(getLatestDate(key), "ddd dd mmm yyyy"),
          <button
            onClick={() => handlePlotButtonClick(key)}
            className="bg-cyan-800 text-white rounded-full px-2 font-medium text-s shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-cyan-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
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

type ExerciseSetWithWorkoutStartTime = ExerciseSet & { workoutStartTime: Date };
enum MetricType {
  WEIGHT,
  REPS,
}
