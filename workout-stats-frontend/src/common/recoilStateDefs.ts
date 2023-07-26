import { atom, selector } from "recoil";
import { Workout } from "../models/workout";

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
