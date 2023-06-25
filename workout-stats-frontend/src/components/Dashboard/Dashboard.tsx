import { Workout } from "../../models/workout"
import SideMenu from "../SideMenu/SideMenu"
import { WorkoutSummary } from "../WorkoutSummary/WorkoutSummary";
import "./Dashboard.css";

export function Dashboard({workouts}: DashboardProps) {
    return <div id="dashboard-container">
        <SideMenu/>
        <div id="dashboard-content">
            <WorkoutSummary workouts={workouts}/>
        </div>

    </div>
}

type DashboardProps = {
    workouts: Workout[]
}