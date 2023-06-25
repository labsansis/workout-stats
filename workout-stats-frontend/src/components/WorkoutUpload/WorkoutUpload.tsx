import { useEffect, useState } from "react";
import { GarminActivity } from "../../models/garmin";
import {
  Exercise,
  ExerciseSet,
  WeightUnit,
  Workout,
} from "../../models/workout";
import { FileUpload } from "../FileUpload/FileUpload";

/**
 * A component to upload one or more workout files, parse them and return structured workouts.
 *
 * Currently only files coming from the Garmin Workout Downloader browser extension are supported.
 */
export function WorkoutUpload(props: WorkoutUploadProps) {
  const prettifyGarminExerciseName = (name: string | null): string => {
    if (!name) return "Unknown";
    return name
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const parseGarminActivity = (a: GarminActivity): Workout => {
    const w = new Workout();
    w.sourceWorkoutId = String(a.activityId);
    w.name = a.activityName;
    w.startTime = new Date(a.beginTimestamp);
    w.duration = a.duration;
    w.workoutType = a.activityType.typeKey;
    if (a.fullExerciseSets) {
      w.exerciseSets = a.fullExerciseSets
        .filter((ges) => ges.setType === "ACTIVE")
        .map((ges) => {
          const es = new ExerciseSet();
          es.exercise = new Exercise();
          es.exercise.category = ges.exercises[0].category;
          es.exercise.name = ges.exercises[0].name;
          es.exercise.displayName = prettifyGarminExerciseName(
            ges.exercises[0].name
          );
          es.repetitionCount = ges.repetitionCount;
          //   Garmin seems to store it in grams
          es.weight = (ges.weight || 0) / 1000;
          // For now just default to kg.
          es.weightUnit = WeightUnit.KG;
          es.startTime = new Date(Date.parse(ges.startTime));
          es.duration = ges.duration;
          return es;
        });
    }
    return w;
  };

  const fileHandler = (
    workoutFiles: FileList | null,
    errorHandler: (err: string) => void
  ) => {
    console.log("fileHandler callback");
    const fileReaders: FileReader[] = [];
    if (!(workoutFiles && workoutFiles.length)) {
      return;
    }
    const promises: Promise<GarminActivity[]>[] = Array.from(workoutFiles).map(
      (file) => {
        return new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReaders.push(fileReader);
          fileReader.onload = (e) => {
            const result = e.target?.result as string;
            console.log("Got the file contents");
            console.log(result);
            if (result) {
              resolve(JSON.parse(result));
            }
          };
          fileReader.onabort = () => {
            reject(new Error("File reading aborted"));
          };
          fileReader.onerror = () => {
            reject(new Error("Failed to read file"));
          };
          fileReader.readAsText(file);
        });
      }
    );
    Promise.all(promises)
      .then((workoutDataSets) => {
        return workoutDataSets.flatMap((wds) => wds.map(parseGarminActivity));
      })
      .then((parsedWorkouts) => {
        console.log(`Got ${parsedWorkouts.length} parsed workouts`);
        props.setWorkouts(parsedWorkouts);
      })
      .catch((reason) => {
        console.log(reason);
        errorHandler(
          `Could not parse the workout files. urrently only files coming from the Garmin Workout Downloader browser extension are supported. Technical error: ${reason}`
        );
      });
  };

  return <FileUpload fileHandler={fileHandler} />;
}

type WorkoutUploadProps = {
  setWorkouts: (workouts: Workout[]) => void;
};
