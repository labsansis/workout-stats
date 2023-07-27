export const formatDuration = (duration: number): string => {
  let h = Math.floor(duration / 3600);
  let m = Math.floor((duration % 3600) / 60);
  let s = Math.floor(duration % 60);
  let hs = h > 0 ? String(h).padStart(2, "0") + ":" : "";
  return hs + String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
};

export function saveInputChangeInHookState(setStateFn: CallableFunction) {
  return (event: {
    target: { type: string; checked: boolean; value: string };
  }) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    setStateFn(value);
  };
}
