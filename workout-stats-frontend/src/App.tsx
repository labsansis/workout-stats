import { useState } from 'react';
import './App.css';
import { Workout } from "./models/workout";
import { WorkoutUpload } from './components/WorkoutUpload/WorkoutUpload';
import { FileUpload } from './components/FileUpload/FileUpload';

function App() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  if (!workouts || !workouts.length) {
    return <WorkoutUpload setWorkouts={setWorkouts}/>;
  }

  
return <>
    <div>Files uploaded!</div>
    <div>{JSON.stringify(workouts)}</div>
  </>;
}

export default App;
