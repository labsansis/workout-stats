import { User } from "../models/user";

export const formatDuration = (duration: number): string => {
  let h = Math.floor(duration / 3600);
  let m = Math.floor((duration % 3600) / 60);
  let s = Math.floor(duration % 60);
  let hs = h > 0 ? String(h).padStart(2, "0") + ":" : "";
  return hs + String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
};

export function saveInputChangeInHookState(setStateFn: CallableFunction) {
  return (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const target = event.target;
    const value =
      target.type === "checkbox"
        ? (target as HTMLInputElement).checked
        : target.value;
    setStateFn(value);
  };
}

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function convertWeight(weightInKg: number, user: User | null) {
  if (user?.preferredUnits === "imperial")
    return Math.round(weightInKg * 2.20462262);
  return weightInKg;
}
