import { ReactNode, useEffect, useState } from "react";
import { CalendarEvent } from "./models";
import InnerYearCalendar from "./InnerYearCalendar";

export default function YearCalendar<T>({
  weekStartDay,
  events,
  shadingFn,
  view = "responsive",
  labels,
  className,
  eventsFormatFn,
}: YearCalendarProps<T>) {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [eventsMap, setEventsMap] = useState(
    new Map<string, CalendarEvent<T>[]>(),
  );

  useEffect(() => {
    const tmpMap = new Map<string, CalendarEvent<T>[]>();

    for (let event of events || []) {
      const dstr = `${event.date.getFullYear()}-${event.date.getMonth()}-${event.date.getDate()}`;
      if (!tmpMap.has(dstr)) {
        tmpMap.set(dstr, []);
      }
      tmpMap.get(dstr)?.push(event);
    }

    setEventsMap(tmpMap);
  }, []);

  const yearFwd = () => setYear(year + 1);
  const yearBack = () => setYear(year - 1);
  const monthFwd = () => {
    if (month == 11) yearFwd();
    setMonth((month + 1) % 12);
  };
  const monthBack = () => {
    if (month == 0) yearBack();
    setMonth((month + 12 - 1) % 12);
  };

  const monthContainerClass = view === "responsive" ? "block md:hidden" : "";
  const yearContainerClass = view === "responsive" ? "hidden md:block" : "";

  const labelsComponent = labels && (
    <div className="my-2">
      {Object.keys(labels || {}).map((colorCode) => (
        <span className="mx-2 inline-block" key={`label-${colorCode}`}>
          <span
            className="inline-block w-[1em] h-[1em] rounded-full"
            style={{ backgroundColor: colorCode }}
          ></span>{" "}
          {labels[colorCode]}
        </span>
      ))}
    </div>
  );

  return (
    <div className={className}>
      {labelsComponent}
      {(view === "month" || view === "responsive") && (
        <div className={monthContainerClass}>
          <InnerYearCalendar
            year={year}
            month={month}
            showFullYear={false}
            forwardFn={monthFwd}
            backFn={monthBack}
            events={eventsMap}
            weekStartDay={weekStartDay}
            shadingFn={shadingFn}
            eventsFormatFn={eventsFormatFn}
          />
        </div>
      )}

      {(view === "year" || view === "responsive") && (
        <div className={yearContainerClass}>
          <InnerYearCalendar
            year={year}
            month={month}
            showFullYear={true}
            forwardFn={yearFwd}
            backFn={yearBack}
            events={eventsMap}
            weekStartDay={weekStartDay}
            shadingFn={shadingFn}
            eventsFormatFn={eventsFormatFn}
          />
        </div>
      )}
    </div>
  );
}

type YearCalendarProps<T> = {
  // 0 = sunday, 1 = monday, ...
  weekStartDay: number;
  events?: CalendarEvent<T>[];
  view?: "year" | "month" | "responsive";
  // should return color hex code with preceding #
  shadingFn?: (dayEvents: CalendarEvent<T>[]) => string | undefined;
  labels?: { [colorCode: string]: string };
  className?: string;
  eventsFormatFn?: (event: CalendarEvent<T>[]) => ReactNode;
};
