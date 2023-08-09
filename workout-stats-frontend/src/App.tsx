import "./App.css";
import { WeightUnit, Workout } from "./models/workout";
import demoDataJson from "./demoData.json";
import { useRecoilState } from "recoil";
import { workoutsState, userState } from "./common/recoilStateDefs";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdOutlineAutoGraph } from "react-icons/md";

function App() {
  const [workouts, setWorkouts] = useRecoilState<Workout[]>(workoutsState);
  const [user, setUser] = useRecoilState(userState);
  const navigate = useNavigate();

  const setDemoData = () => {
    setWorkouts(
      demoDataJson.map((w) => {
        return {
          ...w,
          startTime: new Date(new Date().getTime() - w.secondsInPast * 1000),
          exerciseSets: (w.exerciseSets || []).map((es) => {
            return {
              ...es,
              startTime: new Date(
                new Date().getTime() - es.secondsInPast * 1000,
              ),
              weightUnit: es.weightUnit as WeightUnit,
            };
          }),
        };
      }),
    );
  };

  const handleDemoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setUser({ name: "Demo User", email: "demo@demo.com", id: "demo" });
    setDemoData();
    navigate("/home");
  };

  return (
    <>
      <div className="mx-auto md:w-1/2 px-4">
        <div className="text-center text-3xl pt-10 font-bold">
          Workout Stats
        </div>
        <div className="text-xl pt-10 pb-7">
          This is a strength training analytics tool meant to complement
          Garmin's Connect UI. You can look at your latest workouts at a glance
          and analyze your performance over time.
        </div>
        <div className="text-xl pb-7">
          To start, sign in or explore a simple live demo.
        </div>

        <div className="text-center py-10">
          <Link
            to="/signup"
            className="text-xl p-4 font-bold text-white bg-cyan-800 hover:bg-cyan-900 m-4 rounded-xl border-2 border-cyan-800 hover:border-cyan-900 inline-block min-w-[12em]"
          >
            Sign Up
          </Link>
          <Link
            to="/signin"
            className="text-xl p-4 font-bold text-cyan-800 bg-white hover:bg-[#e1e1ea] m-4 rounded-xl border-2 border-cyan-800 inline-block min-w-[12em]"
          >
            Sign In
          </Link>
          <Link
            to="/demo"
            className="text-xl p-4 font-bold text-white bg-cyan-800 hover:bg-cyan-900 m-4 rounded-xl border-2 border-cyan-800 hover:border-cyan-900 inline-block min-w-[12em]"
            onClick={handleDemoClick}
          >
            <MdOutlineAutoGraph className="inline mx-1" /> Live Demo
          </Link>
        </div>
        <div>
          This project is open source, you can check out the Github repo{" "}
          <a
            href="https://github.com/labsansis/workout-stats"
            target="_blank"
            className="underline"
          >
            here
          </a>
          .
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default App;
