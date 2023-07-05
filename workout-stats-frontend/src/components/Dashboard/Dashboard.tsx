import { useState } from "react";
import { Workout } from "../../models/workout";
import SideMenu from "../SideMenu/SideMenu";
import "./Dashboard.css";
import { StrengthWorkoutList } from "../StrengthWorkoutList/StrengthWorkoutList";
import { ExercisesSummary } from "../ExercisesSummary/ExercisesSummary";
import { Home } from "../Home/Home";

export function Dashboard({ workouts }: DashboardProps) {
  const [page, setPage] = useState("home");

  return (
    <div id="dashboard-container">
      <SideMenu switchPage={setPage} />
      <div id="dashboard-content">
        {page === "home" && <Home workouts={workouts} />}
        {page === "strength" && <StrengthWorkoutList workouts={workouts} />}
        {page === "exercises" && <ExercisesSummary workouts={workouts} />}
      </div>
    </div>
  );
}

type DashboardProps = {
  workouts: Workout[];
};
