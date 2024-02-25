import { firebaseAuth } from "../../firebase";
import { signOut } from "firebase/auth";
import {
  userCoreState,
  userState,
  userSupplementalState,
  workoutsState,
} from "../../common/recoilStateDefs";
import { useRecoilState } from "recoil";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SignOut() {
  const [workouts, setWorkouts] = useRecoilState(workoutsState);
  const [userCore, setUserCore] = useRecoilState(userCoreState);
  const [userSuppl, setUserSuppl] = useRecoilState(userSupplementalState);
  const navigate = useNavigate();

  useEffect(() => {
    setWorkouts([]);
    setUserCore(null);
    setUserSuppl(null);
    signOut(firebaseAuth);
    navigate("/");
  }, []);

  return <div>Signing out...</div>;
}
