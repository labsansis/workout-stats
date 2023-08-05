import exerciseMuscleGroups from "../../resources/exercise-muscle-groups.json";
import { useRecoilValue } from "recoil";
import { strengthWorkoutsState } from "../../common/recoilStateDefs";
import { ExerciseSet } from "../../models/workout";
import Chart, { Props as ApexChartProps } from "react-apexcharts";
import { useEffect, useRef, useState } from "react";
import { sortBy, sum } from "lodash";
import PillSelect from "../PillSelect/PillSelect";
import { CardGrid } from "../cards/CardGrid";
import AnimatedNumber from "../AnimatedNumber/AnimatedNumber";

export default function TrainingVolume() {
  const workouts = useRecoilValue(strengthWorkoutsState);
  const [earliestDate, setEarliestDate] = useState(
    new Date(new Date().getTime() - 7 * 24 * 3600 * 1000),
  );
  const [groupingLevel, setGroupingLevel] = useState("coarse");
  const [volumeType, setVolumeType] = useState("sets");
  const [chartHeight, setChartHeight] = useState("auto");
  const chartParentRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    setChartHeight(
      chartParentRef.current && chartParentRef.current.offsetWidth > 500
        ? "auto"
        : "300px",
    );
  });

  const muscleGroupsCoarseMapping: { [key: string]: string } = {
    ABDUCTORS: "LEGS",
    ABS: "CORE",
    ADDUCTORS: "LEGS",
    BICEPS: "ARMS",
    CALVES: "LEGS",
    CHEST: "CHEST",
    FOREARM: "ARMS",
    GLUTES: "LEGS",
    HAMSTRINGS: "LEGS",
    HIPS: "LEGS",
    LATS: "BACK",
    LOWER_BACK: "BACK",
    NECK: "SHOULDERS",
    OBLIQUES: "CORE",
    QUADS: "LEGS",
    SHOULDERS: "SHOULDERS",
    TRAPS: "BACK",
    TRICEPS: "ARMS",
  };

  const granuralMuscleGroups = sortBy(Object.keys(muscleGroupsCoarseMapping));

  const coarseMuscleGroups = sortBy(
    Array.from(new Set(Object.values(muscleGroupsCoarseMapping))),
  );

  const calculateTotalVolume = () => {
    return sum(
      workouts
        .filter((w) => w.startTime >= earliestDate)
        .map((w) => extractVolumeFromSets(w.exerciseSets || [])),
    );
  };

  const getMuscleGroups = (
    exerciseName: string,
  ): SingleExerciseMuscleGroups => {
    if (exerciseName in exerciseMuscleGroups) {
      return (
        exerciseMuscleGroups as { [key: string]: SingleExerciseMuscleGroups }
      )[exerciseName];
    }
    return {
      primaryMuscles: [],
      secondaryMuscles: [],
    };
  };

  const muscleMapFn = (muscle: string): string => {
    if (groupingLevel === "coarse") {
      return muscleGroupsCoarseMapping[muscle] || "";
    }
    return muscle;
  };

  const groupSetsByPrimaryMuscle = () => {
    const res = new Map<string, ExerciseSet[]>();

    for (let workout of workouts) {
      if (workout.startTime < earliestDate) {
        continue;
      }
      for (let es of workout.exerciseSets || []) {
        const pms =
          getMuscleGroups(es.exercise.name).primaryMuscles ||
          getMuscleGroups(es.exercise.category).primaryMuscles;
        const pms_set = new Set(pms.map(muscleMapFn));
        for (let muscle of Array.from(pms_set)) {
          res.set(muscle, [...(res.get(muscle) || []), es]);
        }
      }
    }
    return res;
  };

  const extractVolumeFromSets = (ess: ExerciseSet[]) => {
    if (volumeType === "weight")
      return Math.round(
        ess
          .map((es) => (es.weight || 0) * es.repetitionCount)
          .reduce((a, b) => a + b),
      );
    return ess.length;
  };

  const extractVolumePerMuscle = (
    groupedExercises: Map<string, ExerciseSet[]>,
  ) => {
    const res = new Map<string, number>();

    for (let [muscle, ess] of Array.from(groupedExercises)) {
      res.set(muscle, extractVolumeFromSets(ess));
    }
    return res;
  };

  const volumePerMuscle = extractVolumePerMuscle(groupSetsByPrimaryMuscle());
  const keys =
    groupingLevel === "coarse" ? coarseMuscleGroups : granuralMuscleGroups;
  const yAxisTitle = volumeType === "weight" ? "Total Weight" : "# Sets";
  const prepChartProps = (): ApexChartProps => {
    return {
      type: "bar",
      series: [
        {
          name: yAxisTitle,
          data: keys.map((k) => {
            return { x: k, y: volumePerMuscle.get(k) || 0 };
          }),
        },
      ],
      options: {
        title: {
          text: "Training Volume By Muscle Group",
        },
        yaxis: {
          title: {
            text: yAxisTitle,
          },
        },
      },
      height: chartHeight,
    };
  };

  return (
    <>
      <div className="flex flex-wrap">
        <PillSelect
          title="Timeframe"
          options={[
            { title: "Last 7 days", value: 7 },
            { title: "14 days", value: 14 },
            { title: "30 days", value: 30 },
            { title: "Since start", value: -1 },
          ]}
          onChange={(days) => {
            if (days === -1) setEarliestDate(new Date(0));
            else
              setEarliestDate(
                new Date(new Date().getTime() - days * 24 * 3600 * 1000),
              );
          }}
          defaultValue={7}
        />
        <PillSelect
          title="View"
          options={[
            { title: "Simpler", value: "coarse" },
            { title: "Detailed", value: "granular" },
          ]}
          onChange={setGroupingLevel}
          defaultValue={"coarse"}
        />
        <PillSelect
          title="Metric"
          options={[
            { title: "Sets", value: "sets" },
            { title: "Weight", value: "weight" },
          ]}
          onChange={setVolumeType}
          defaultValue={"sets"}
        />
      </div>

      <CardGrid
        cards={[
          {
            label: volumeType === "weight" ? "Total Weight" : "Total Sets",
            value: <AnimatedNumber value={calculateTotalVolume()} />,
          },
        ]}
      />
      <div className="mt-10 w-full xl:w-3/5" ref={chartParentRef}>
        <Chart {...prepChartProps()} />
      </div>
    </>
  );
}

type SingleExerciseMuscleGroups = {
  primaryMuscles: string[];
  secondaryMuscles: string[];
};
