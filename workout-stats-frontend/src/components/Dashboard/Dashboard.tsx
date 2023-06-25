import { useState } from "react";
import { Workout } from "../../models/workout";
import SideMenu from "../SideMenu/SideMenu";
import { WorkoutSummary } from "../WorkoutSummary/WorkoutSummary";
import "./Dashboard.css";
import { StrengthWorkoutList } from "../StrengthWorkoutList/StrengthWorkoutList";

export function Dashboard({ workouts }: DashboardProps) {
  const [page, setPage] = useState("all");

  return (
    <div id="dashboard-container">
      <SideMenu switchPage={setPage} />
      <div id="dashboard-content">
        {page === "all" && <WorkoutSummary workouts={workouts} />}
        {page === "strength" && <StrengthWorkoutList workouts={workouts} />}
      </div>
    </div>
  );
}

type DashboardProps = {
  workouts: Workout[];
};
