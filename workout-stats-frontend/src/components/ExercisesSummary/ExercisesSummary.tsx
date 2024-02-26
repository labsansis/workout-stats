import { ReactElement, useRef, useState } from "react";
import { ExerciseSet } from "../../models/workout";
import { WSTable } from "../WSTable/WSTable";
import dateFormat from "dateformat";
import Chart, { Props as ApexChartProps } from "react-apexcharts";
import { useRecoilValue } from "recoil";
import { strengthWorkoutsState, userState } from "../../common/recoilStateDefs";
import WorkoutDataFetch from "../WorkoutDataFetch/WorkoutDataFetch";
import { sortBy } from "lodash";
import { convertWeight, formatWeightDecimals } from "../../common/functions";

export function ExercisesSummary() {
  const [exerciseToPlot, setExerciseToPlot] = useState("");
  const plotRef = useRef<HTMLDivElement>(null);
  const workouts = useRecoilValue(strengthWorkoutsState);
  const user = useRecoilValue(userState);

  const weightUnit = user?.preferredUnits === "imperial" ? "lbs" : "kg";

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
      const key = es.exercise.name || es.exercise.category;
      if (!(key in setsByExercise)) {
        setsByExercise[key] = [];
      }
      setsByExercise[key].push({
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
          {formatWeightDecimals(convertWeight(weight, user))}{" "}
          <span className="text-gray-400">{weightUnit}</span>
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
    const weights = dayDatePR.map((ddw) => convertWeight(ddw.weight, user));
    const reps = dayDatePR.map((ddw) => ddw.reps);
    const metricKey = Math.max(...weights) > 0 ? "kg" : "reps";
    const prs = Math.max(...weights) > 0 ? weights : reps;
    return { dates, prs, metricKey };
  };

  /**
   * Scans through all sets of the given exercise and produces a series at daily granularity.
   * `dates` is a list of strings in the shape "01 Jan 2022", all unique and sorted in ascending order.
   * `volumes` is the total volume of that exercise in that day corresponding to every element of `dates`.
   * `metricKey` is either "kg" indicating that the volume is given in terms of total weight
   *             lifted, or "reps" indicating that the volume is given in terms of total reps
   *             done (for bodyweight exercises).
   */
  const extractExerciseVolumeSeries = (
    exerciseKey: string,
  ): { dates: string[]; volumes: number[]; metricKey: "kg" | "reps" } => {
    const volByDay: {
      [day: string]: { volume: number; reps: number; date: Date };
    } = {};
    for (let es of setsByExercise[exerciseKey]) {
      let ds = dateFormat(es.workoutStartTime, "dd mmm yyyy");

      volByDay[ds] = {
        volume:
          (volByDay[ds]?.volume || 0) + (es.weight || 0) * es.repetitionCount,
        reps: (volByDay[ds]?.reps || 0) + es.repetitionCount,
        date: es.workoutStartTime,
      };
    }

    const dayDateVol = Object.keys(volByDay).map((day) => {
      return {
        day,
        date: volByDay[day].date,
        volume: volByDay[day].volume,
        reps: volByDay[day].reps,
      };
    });
    dayDateVol.sort((a, b) => (a.date > b.date ? 1 : a.date < b.date ? -1 : 0));
    // what we called "day" before interally now becomes "date" for external use
    const dates = dayDateVol.map((ddw) => ddw.day);
    const volumes = dayDateVol.map((ddw) => convertWeight(ddw.volume, user));
    const reps = dayDateVol.map((ddw) => ddw.reps);
    const metricKey = Math.max(...volumes) > 0 ? "kg" : "reps";
    const rvs = metricKey == "kg" ? volumes : reps;
    return { dates, volumes: rvs, metricKey };
  };

  const prepChartProps = (exerciseKey: string): ApexChartProps => {
    const { dates, prs, metricKey } = extractExercisePRSeries(exerciseKey);
    const volSeries = extractExerciseVolumeSeries(exerciseKey);
    return {
      type: "line",
      series: [
        {
          name: metricKey === "kg" ? "Max weight" : "Max reps",
          data: prs,
        },
        {
          name: metricKey === "kg" ? "Volume" : "Total reps",
          data: volSeries.volumes,
        },
      ],
      options: {
        title: {
          text: setsByExercise[exerciseKey][0].exercise.displayName,
        },
        colors: ["#155D75", "#ff6600"],
        labels: dates,
        xaxis: {
          type: "datetime",
        },
        yaxis: [
          {
            title: {
              text:
                metricKey === "kg"
                  ? `Weight (${weightUnit})`
                  : "Reps (for max)",
            },
          },
          {
            opposite: true,
            title: {
              text:
                metricKey === "kg"
                  ? `Volume (${weightUnit})`
                  : "Reps (for total)",
            },
          },
        ],
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
