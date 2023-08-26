import { Workout, WeightUnit } from "../models/workout";
import { GarminActivity } from "../models/garmin";

export const prettifyGarminExerciseName = (
  name: string | null,
  category: string | undefined,
): string => {
  if (!name && !category) return "Unknown";
  if (!name) name = category as string;

  return name
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const parseGarminActivity = (a: GarminActivity): Workout => {
  return {
    sourceWorkoutId: String(a.activityId),
    name: a.activityName,
    startTime: new Date(a.beginTimestamp),
    duration: a.duration,
    workoutType: a.activityType.typeKey,
    exerciseSets:
      a.fullExerciseSets
        ?.filter((ges) => ges.setType === "ACTIVE")
        .map((ges) => {
          return {
            exercise: {
              category: ges.exercises[0].category,
              name: ges.exercises[0].name,
              displayName: prettifyGarminExerciseName(
                ges.exercises[0].name,
                ges.exercises[0].category,
              ),
            },
            repetitionCount: ges.repetitionCount,
            // Garmin seems to store it in grams
            weight: (ges.weight || 0) / 1000,
            // For now just default to kg.
            weightUnit: WeightUnit.KG,
            startTime: new Date(Date.parse(ges.startTime)),
            duration: ges.duration,
          };
        }) || [],
  };
};
