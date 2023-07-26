import { useState } from "react";
import { Workout } from "../../models/workout";
import SideMenu from "../SideMenu/SideMenu";
import "./Dashboard.css";
import { StrengthWorkoutList } from "../StrengthWorkoutList/StrengthWorkoutList";
import { ExercisesSummary } from "../ExercisesSummary/ExercisesSummary";
import { Home } from "../Home/Home";

export function Dashboard({ page }: DashboardProps) {
  return (
    <div id="dashboard-container">
      <SideMenu />
      <div id="dashboard-content">
        {page === "home" && <Home />}
        {page === "strength" && <StrengthWorkoutList />}
        {page === "exercises" && <ExercisesSummary />}
      </div>
    </div>
  );
}

type DashboardProps = {
  page: string;
};
