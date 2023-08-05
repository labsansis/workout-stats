import { useState } from "react";

export default function PillSelect<T>({
  title,
  options,
  onChange,
  defaultValue,
}: PillSelectProps<T>) {
  const [selectedValue, setSelectedValue] = useState<T | undefined>(
    defaultValue,
  );

  const handleClick = (value: T) => {
    setSelectedValue(value);
    onChange(value);
  };

  return (
    <div className="relative border-[1px] rounded-xl border-slate-300 p-2 my-3 mx-2">
      <div className="absolute top-[-0.75em] text-sm bg-white px-1 text-slate-600 font-bold">
        {title}
      </div>
      <div>
        {options.map((e, i) => (
          <Pill
            key={`pill-${title}-${i}`}
            title={e.title}
            selected={e.value === selectedValue}
            onClick={() => handleClick(e.value)}
          />
        ))}{" "}
      </div>
    </div>
  );
}

function Pill(props: PillProps) {
  const selectedClasses = "text-white bg-cyan-800";
  const unselectedClasses = "text-cyan-800 bg-white";
  return (
    <span
      className={`inline-block p-2 rounded-full border-2 border-cyan-800 m-2 cursor-pointer text-xs ${
        props.selected ? selectedClasses : unselectedClasses
      }`}
      onClick={props.onClick}
    >
      {props.title}
    </span>
  );
}

type PillSelectProps<T> = {
  title: string;
  options: {
    title: string;
    value: T;
  }[];
  onChange: (newValue: T) => void;
  defaultValue: T | undefined;
};

type PillProps = {
  title: string;
  selected: boolean;
  onClick: () => void;
};
