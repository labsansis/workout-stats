import { useEffect, useState } from "react";
import { workoutsState, userState } from "../../common/recoilStateDefs";
import { useRecoilState, useRecoilValue } from "recoil";
import { db } from "../../firebase";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { GarminActivity } from "../../models/garmin";
import {
  Workout,
  ExerciseSet,
  Exercise,
  WeightUnit,
} from "../../models/workout";
import RiseLoader from "react-spinners/RiseLoader";
import { Link } from "react-router-dom";

export default function WorkoutDataFetch() {
  const [fetchSuccess, setFetchSuccess] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [workouts, setWorkouts] = useRecoilState(workoutsState);
  const user = useRecoilValue(userState);

  const prettifyGarminExerciseName = (
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
            ges.exercises[0].name,
            ges.exercises[0].category,
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

  useEffect(() => {
    if (!user) return;
    // fetch all workouts for this user
    getDocs(collection(db, "users", user.id, "rawWorkouts"))
      .then((qsnap) =>
        qsnap.docs.map((docsnap) => docsnap.data() as GarminActivity),
      )
      .then((activities) => activities.map(parseGarminActivity))
      .then(setWorkouts)
      .then(() => {
        setFetchSuccess(true);
        setFetchError(null);
      })
      .catch((reason) => {
        setFetchSuccess(false);
        console.log("ERROR");
        console.log(reason);
        setFetchError(reason);
      });
  }, []);

  if (fetchSuccess && !workouts?.length) {
    return (
      <div className="text-l my-10">
        <p className="mb-4">
          Hi there! This is where you'll see your workout stats. Now you just
          need to upload some data to get started.
        </p>
        <p className="mb-4 font-bold">Upload what?</p>
        <p className="mb-4">
          In an ideal world this tool would just connect to your Garmin account,
          retrieve your workout data and display it here. However, Garmin's APIs
          are just not built for strength training data.
        </p>
        <p className="mb-4">
          So for now we are using a workaround, and getting data from Garmin
          into Workout Stats is a two step process:
        </p>
        <ol className="mb-4 list-decimal">
          <li className="ml-10 mb-1">
            Install the{" "}
            <a
              href="https://github.com/labsansis/garmin-workout-downloader/"
              className="underline"
              target="_blank"
            >
              Garmin Workout Downloader
            </a>{" "}
            browser extension and use it to download your latest workouts. At
            the end you should have a JSON file downloaded to your device.
          </li>
          <li className="ml-10 mb-2">
            Come back and upload this file here by following{" "}
            <Link to="/upload" className="underline">
              this link
            </Link>
            .
          </li>
        </ol>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="text-center text-[#b91c1c] my-10">
        Could not fetch the workout data. Please try again in a bit.
      </div>
    );
  }

  return (
    <div className="text-xl text-center my-10">
      <RiseLoader />
      <div>Fetching workout data</div>
    </div>
  );
}
