import { firebaseAuth } from "../../firebase";
import { signOut } from "firebase/auth";
import { userState, workoutsState } from "../../common/recoilStateDefs";
import { useRecoilState } from "recoil";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SignOut() {
  const [workouts, setWorkouts] = useRecoilState(workoutsState);
  const [user, setUser] = useRecoilState(userState);
  const navigate = useNavigate();

  useEffect(() => {
    setWorkouts([]);
    setUser(null);
    signOut(firebaseAuth);
    navigate("/");
  }, []);

  return <div>Signing out...</div>;
}
