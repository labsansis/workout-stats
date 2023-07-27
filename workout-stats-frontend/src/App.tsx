import { useEffect } from "react";
import "./App.css";
import { WeightUnit, Workout } from "./models/workout";
import demoDataJson from "./demoData.json";
import { useRecoilState } from "recoil";
import { workoutsState } from "./common/recoilStateDefs";
import { useNavigate, Link } from "react-router-dom";

function App() {
  const [workouts, setWorkouts] = useRecoilState<Workout[]>(workoutsState);
  const navigate = useNavigate();

  useEffect(() => {
    if (!!workouts && workouts.length) {
      navigate("/home");
    }
  }, [workouts]);

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
    setDemoData();
  };

  return (
    <>
      <div className="mx-auto md:w-1/2">
        <div className="text-xl my-10">
          This is a strength training analytics tool meant to complement
          Garmin's UI. To start, sign in or explore a live demo.
        </div>

        <Link
          to="/signup"
          className="text-xl p-4 bold text-white bg-[#155e75] m-4"
        >
          Sign Up
        </Link>

        {/* <div className="text-lg my-10">
          or look at a{" "}
          <a href="#" onClick={handleDemoClick} className="underline">
            live demo
          </a>{" "}
          instead.
        </div> */}
      </div>
    </>
  );
}

export default App;
