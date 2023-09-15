import { useEffect, useState } from "react";
import { monthNames } from "./data";
import { CalendarEvent } from "./models";
import { usePopper } from "react-popper";

const dayNames = ["Su", "M", "T", "W", "Th", "F", "Sa"];

export default function InnerMonthCalendar({
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
            const dayEvents = events.get(eventDayKey) || [];

            let circleClassName =
              "absolute w-[1.7em] h-[1.7em] left-0 right-0 top-0 bottom-0 m-auto rounded-full";
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
