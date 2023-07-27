import { useEffect } from "react";
import SideMenu from "../SideMenu/SideMenu";
import "./Dashboard.css";
import { StrengthWorkoutList } from "../StrengthWorkoutList/StrengthWorkoutList";
import { ExercisesSummary } from "../ExercisesSummary/ExercisesSummary";
import { Home } from "../Home/Home";
import { useNavigate } from "react-router-dom";
import { userState } from "../../common/recoilStateDefs";
import { useRecoilValue } from "recoil";
import WorkoutUploadPage from "../WorkoutUploadPage/WorkoutUploadPage";

export function Dashboard({ page }: DashboardProps) {
  const navigate = useNavigate();
  const user = useRecoilValue(userState);

  useEffect(() => {
    if (!user) {
      navigate("/signin");
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
      </div>
    </div>
  );
}

type DashboardProps = {
  page: string;
};
