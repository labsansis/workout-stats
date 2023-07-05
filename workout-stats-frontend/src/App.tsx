import { useState } from "react";
import "./App.css";
import { Workout } from "./models/workout";
import { WorkoutUpload } from "./components/WorkoutUpload/WorkoutUpload";
import { Dashboard } from "./components/Dashboard/Dashboard";

function App() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  if (!workouts || !workouts.length) {
    return <WorkoutUpload setWorkouts={setWorkouts} />;
  }

  return (
    <>
      <Dashboard workouts={workouts} />
    </>
  );
}

export default App;
