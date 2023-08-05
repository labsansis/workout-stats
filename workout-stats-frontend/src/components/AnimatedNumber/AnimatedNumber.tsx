import { animate } from "motion";
import { useEffect, useState } from "react";

export default function AnimatedNumber({ value }: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const startValue = displayValue;
    animate(
      (progress) =>
        setDisplayValue(
          startValue + Math.floor(progress * (value - startValue)),
        ),
      { duration: 0.5, easing: "ease-out" },
    );
  }, [value]);

  return <>{displayValue}</>;
}

type AnimatedNumberProps = {
  value: number;
};
