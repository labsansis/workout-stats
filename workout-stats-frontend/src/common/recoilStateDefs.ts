import { atom, selector } from "recoil";
import { Workout } from "../models/workout";
import { User, UserCoreInfo, UserSupplementalInfo } from "../models/user";

export const workoutsState = atom<Workout[]>({
  key: "workoutsState",
  default: [],
});

export const strengthWorkoutsState = selector<Workout[]>({
  key: "strengthWorkoutsState",
  get: ({ get }) => {
    const workouts = get(workoutsState);

    return workouts.filter((w) => w.workoutType === "strength_training");
  },
});

// Generally we use Firebase Auth to get info on users. However, it seems to be fetching
// that data from a backend every time (or almost), so we can't use it to gate a component
// by login. If this state is set, it means that we have successfully logged in.
export const userCoreState = atom<UserCoreInfo | null>({
  key: "userCoreState",
  default: null,
});

export const userSupplementalState = atom<UserSupplementalInfo | null>({
  key: "userSupplementalState",
  default: null,
});

export const userState = selector<User | null>({
  key: "userState",
  get: ({ get }) => {
    const core = get(userCoreState);
    const suppl = get(userSupplementalState);

    if (core && suppl) {
      return { ...core, ...suppl };
    }

    return null;
  },
});
