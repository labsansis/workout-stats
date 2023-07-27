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
                new Date().getTime() - es.secondsInPast * 1000
              ),
              weightUnit: es.weightUnit as WeightUnit,
            };
          }),
        };
      })
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
        <div className="text-xl py-10">
          This is a strength training analytics tool meant to complement
          Garmin's Connect UI. To start, sign in or explore a live demo.
        </div>

        <div className="text-center py-10">
          <Link
            to="/signup"
            className="text-xl p-4 font-bold text-white bg-[#0891b2] hover:bg-[#0b6b82] m-4 rounded-xl border-2 border-[#0891b2] inline-block min-w-[12em]"
          >
            Sign Up
          </Link>
          <Link
            to="/signin"
            className="text-xl p-4 font-bold text-[#0891b2] bg-white hover:bg-[#e1e1ea] m-4 rounded-xl border-2 border-[#0891b2] inline-block min-w-[12em]"
          >
            Sign In
          </Link>
          <Link
            to="/demo"
            className="text-xl p-4 font-bold text-white bg-[#0891b2] m-4 rounded-xl inline-block min-w-[12em]"
            onClick={handleDemoClick}
          >
            <MdOutlineAutoGraph className="inline mx-1" /> Live Demo
          </Link>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default App;
