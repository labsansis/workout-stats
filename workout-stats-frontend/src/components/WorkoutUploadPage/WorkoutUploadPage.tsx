import { WorkoutUpload } from "../WorkoutUpload/WorkoutUpload";
import { useRecoilState } from "recoil";
import { Workout } from "../../models/workout";
import { workoutsState } from "../../common/recoilStateDefs";
import { useNavigate } from "react-router-dom";

export default function WorkoutUploadPage() {
  const [workouts, setWorkouts] = useRecoilState<Workout[]>(workoutsState);
  const navigate = useNavigate();

  return (
    <div className="container px-4">
      <h1>Upload</h1>
      <div className="text-xl my-10">
        <p>
          Upload one or more files generated by the{" "}
          <a
            className="underline"
            href="https://github.com/labsansis/garmin-workout-downloader"
          >
            Garmin Workout Downloader
          </a>{" "}
          browser plugin.
        </p>
      </div>

      <WorkoutUpload
        setWorkouts={(workouts) => {
          setWorkouts(workouts);
          navigate("/home");
        }}
      />
    </div>
  );
}
