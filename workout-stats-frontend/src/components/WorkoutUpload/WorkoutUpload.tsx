import { db } from "../../firebase";
import { GarminActivity } from "../../models/garmin";
import { FileUpload } from "../FileUpload/FileUpload";
import { writeBatch, doc } from "firebase/firestore";
import { userState } from "../../common/recoilStateDefs";
import { useRecoilValue, useRecoilState } from "recoil";
import { workoutsState } from "../../common/recoilStateDefs";

/**
 * This component lets users add one or more workout files, then ligthly parses them and
 * uploads them to the database.
 *
 * Currently only files coming from the Garmin Workout Downloader browser extension are supported.
 */
export function WorkoutUpload() {
  const user = useRecoilValue(userState);
  const [workouts, setWorkouts] = useRecoilState(workoutsState);

  /**
   * Uploads the raw Garmin workouts to the Cloud Firestore db.
   *
   * @param activities The activities fetched from Garmin Connect using the Garmin Workout
   *                   Downloader extension. Note that the actual data object contains more
   *                   fields than the GarminActivity type enumerates.
   * @returns An empty promise (story of my life).
   */
  const uploadToDb = (activities: GarminActivity[]): Promise<void> => {
    const batch = writeBatch(db);
    for (let activity of activities) {
      const processedActivityId = `garmin_${activity.activityId}`;
      batch.set(
        doc(
          db,
          "users",
          user?.id as string,
          "rawWorkouts",
          processedActivityId,
        ),
        activity,
      );
    }
    return batch.commit();
  };

  const fileHandler = (
    workoutFiles: FileList | null | File[],
    successHandler: () => void,
    errorHandler: (err: string) => void,
  ) => {
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
      },
    );
    Promise.all(promises)
      .then((workoutDataSets) => {
        return workoutDataSets.flatMap((wds) => wds);
      })
      .then(uploadToDb)
      .then(successHandler)
      // clear local workouts cache so that it's reloaded from Firebase
      .then(() => setWorkouts([]))
      .catch((reason) => {
        console.error(reason);
        errorHandler(
          `Could not parse & upload the workout files. Currently only files coming from the Garmin Workout Downloader browser extension are supported. Technical error: ${reason}`,
        );
      });
  };

  if (user?.email === "demo@demo.com") {
    return (
      <div className="text-xl">
        This is a limited live demo showing the basics of the UI with sample
        data. If you want to upload your own workouts, sign out and create a new
        account.
      </div>
    );
  }

  return <FileUpload fileHandler={fileHandler} />;
}
