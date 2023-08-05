import { useEffect } from "react";
import SideMenu from "../SideMenu/SideMenu";
import "./Dashboard.css";
import { StrengthWorkoutList } from "../StrengthWorkoutList/StrengthWorkoutList";
import { ExercisesSummary } from "../ExercisesSummary/ExercisesSummary";
import { Home } from "../Home/Home";
import { useNavigate, useLocation } from "react-router-dom";
import { userState } from "../../common/recoilStateDefs";
import { useRecoilValue } from "recoil";
import WorkoutUploadPage from "../WorkoutUploadPage/WorkoutUploadPage";
import TrainingVolume from "../TrainingVolume/TrainingVolume";

export function Dashboard({ page }: DashboardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useRecoilValue(userState);

  useEffect(() => {
    if (!user) {
      navigate(
        `/signin?redirect=${encodeURIComponent(
          location.pathname + location.search,
        )}`,
      );
    }
  }, [user]);

  return (
    <div id="dashboard-container">
      <SideMenu />
      <div id="dashboard-content">
        {page === "home" && <Home />}
        {page === "strength" && <StrengthWorkoutList />}
        {page === "exercises" && <ExercisesSummary />}
        {page === "upload" && <WorkoutUploadPage />}
        {page === "volume" && <TrainingVolume />}
      </div>
    </div>
  );
}

type DashboardProps = {
  page: string;
};
