import { useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const dayNames = ["Su", "M", "T", "W", "Th", "F", "Sa"];

function MonthCalendar({
  month,
  year,
  weekStartDay,
  showMonthTitle,
  events,
  shadingFn,
}: MonthCalendarProps) {
  const daysInMonth = (() => {
    if (month === 1) {
      const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
      return isLeap ? 29 : 28;
    }
    if ([3, 5, 8, 10].includes(month)) return 30;
    return 31;
  })();

  // an object for each day that is shown on this month's calendar (possibly a blank)
  const [days, setDays] = useState<Day[]>([]);

  useEffect(() => {
    const tmpDays = [];

    // first, pad the first row with blanks if needed
    // If the week starts with a Sunday, the number to
    // pad is equal to the first weekday of the month
    // (i.e. 1 pad if it's a Monday, 2 if it's a Tuesday etc).
    // To support any day as first day of week, we need to
    // shift this padding number accordingly.
    const numBlanks = (new Date(year, month).getDay() + 7 - weekStartDay) % 7;

    for (let i = 0; i < numBlanks; i++) tmpDays.push({ dayNumber: 0 });

    for (let i = 1; i <= daysInMonth; i++) tmpDays.push({ dayNumber: i });
    setDays(tmpDays);
  }, [year, month]);

  const isToday = (day: number) => {
    const d = new Date();
    return (
      d.getFullYear() === year && d.getMonth() === month && d.getDate() === day
    );
  };

  return (
    <div className="p-1 m-1 font-sans bg-white rounded shadow-md min-w-[200px]">
      {showMonthTitle && (
        <p className="p-1 text-lg text-center text-slate-800">
          {monthNames[month]}
        </p>
      )}
      <div className="p-1 m-1">
        <div className="grid grid-cols-7 font-semibold text-green-800 border-b">
          {[0, 1, 2, 3, 4, 5, 6].map((dayId) => (
            <div
              key={`day-title-${month}-${dayId}`}
              className="grid place-items-center"
            >
              <p>{dayNames[(weekStartDay + dayId) % 7]}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 font-semibold text-center text-gray-800 ">
          {days.map((day, idx) => {
            const eventDayKey = `${year}-${month}-${day.dayNumber}`;

            let circleClassName =
              "absolute w-[1.7em] h-[1.7em] left-0 right-0 top-0 bottom-0 m-auto rounded-full";
            const dayEvents = events.get(eventDayKey) || [];
            const shade = shadingFn && shadingFn(dayEvents);
            let cirlceStyle = {};
            if (shade) cirlceStyle = { backgroundColor: shade };
            if (isToday(day.dayNumber))
              circleClassName += " border-2 border-red-700";
            return (
              <div key={`day-${year}-${month}-${idx}`} className="relative">
                <div className={circleClassName} style={cirlceStyle}></div>
                <p className="relative z-10">{day.dayNumber || ""}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

type Day = {
  dayNumber: number;
};

type MonthCalendarProps = {
  // 0 = sunday, 1 = monday, ...
  weekStartDay: number;
  year: number;
  month: number;
  showMonthTitle: boolean;
  events: Map<string, CalendarEvent[]>;
  shadingFn?: (dayEvents: CalendarEvent[]) => string | undefined;
};

function InnerYearCalendar({
  year,
  month,
  showFullYear,
  forwardFn,
  backFn,
  events,
  shadingFn,
  weekStartDay,
}: InnerYearCalendarProps) {
  const title = showFullYear
    ? year
    : `${monthNames[month].substring(0, 3)} ${year}`;
  return (
    <div>
      <div className="flex justify-between text-white bg-cyan-800 rounded-t-md min-w-[200px]">
        <div className="cursor-pointer p-2 w-[30%] pt-[0.9em]" onClick={backFn}>
          <div className="mx-auto w-[1em]">
            <IoIosArrowBack />
          </div>
        </div>
        <div className="text-xl p-2">{title}</div>
        <div
          className="cursor-pointer p-2 w-[30%] pt-[0.9em]"
          onClick={forwardFn}
        >
          <div className="mx-auto w-[1em]">
            <IoIosArrowForward />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 border-2 border-cyan-800 rounded-b-md min-w-[200px]">
        {!showFullYear && (
          <MonthCalendar
            month={month}
            year={year}
            weekStartDay={weekStartDay}
            showMonthTitle={false}
            events={events}
            shadingFn={shadingFn}
          />
        )}
        {showFullYear &&
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((month) => (
            <MonthCalendar
              key={`month-calendar-${month}`}
              month={month}
              year={year}
              weekStartDay={weekStartDay}
              showMonthTitle={true}
              events={events}
              shadingFn={shadingFn}
            />
          ))}
      </div>
    </div>
  );
}

type InnerYearCalendarProps = {
  showFullYear: boolean;
  year: number;
  month: number;
  forwardFn: () => void;
  backFn: () => void;
  events: Map<string, CalendarEvent[]>;
  // 0 = sunday, 1 = monday, ...
  weekStartDay: number;
  shadingFn?: (dayEvents: CalendarEvent[]) => string | undefined;
};

export default function YearCalendar({
  weekStartDay,
  events,
  shadingFn,
  view = "responsive",
  labels,
  className,
}: YearCalendarProps) {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [eventsMap, setEventsMap] = useState(
    new Map<string, CalendarEvent[]>(),
  );

  useEffect(() => {
    const tmpMap = new Map<string, CalendarEvent[]>();

    for (let event of events) {
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
        <span className="mx-2 inline-block">
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
          />
        </div>
      )}
    </div>
  );
}

type CalendarEvent = {
  date: Date;
  name: string;
  link?: string;
};

type YearCalendarProps = {
  // 0 = sunday, 1 = monday, ...
  weekStartDay: number;
  events: CalendarEvent[];
  view?: "year" | "month" | "responsive";
  // should return color hex code with preceding #
  shadingFn?: (dayEvents: CalendarEvent[]) => string | undefined;
  labels?: { [colorCode: string]: string };
  className?: string;
};
