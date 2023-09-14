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
            const hasOneEvent = (events.get(eventDayKey)?.length || 0) === 1;
            const hasManyEvents = (events.get(eventDayKey)?.length || 0) > 1;

            let circleClassName =
              "absolute w-[1.7em] h-[1.7em] left-0 right-0 top-0 bottom-0 m-auto rounded-full";
            if (hasOneEvent) circleClassName += " bg-lime-300";
            if (hasManyEvents) circleClassName += " bg-fuchsia-500";
            // -1 because dayNumber is 1-indexed
            if (isToday(day.dayNumber - 1))
              circleClassName += " border-2 border-red-700";
            return (
              <div key={`day-${year}-${month}-${idx}`} className="relative">
                <div className={circleClassName}></div>
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
};

export default function YearCalendar({
  weekStartDay,
  events,
}: YearCalendarProps) {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [eventsMap, setEventsMap] = useState(
    new Map<string, CalendarEvent[]>(),
  );

  useEffect(() => {
    console.log(events);
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
  const renderCalendar = (full: boolean) => {
    const forwardFn = full ? yearFwd : monthFwd;
    const backFn = full ? yearBack : monthBack;
    const title = (!full ? `${monthNames[month]} ` : "") + year;

    return (
      <div className={full ? "hidden md:block" : "block md:hidden"}>
        <div className="flex justify-between text-white bg-cyan-800 rounded-t-md min-w-[200px]">
          <div
            className="cursor-pointer p-2 w-[30%] pt-[0.9em]"
            onClick={backFn}
          >
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
          {!full && (
            <MonthCalendar
              month={month}
              year={year}
              weekStartDay={weekStartDay}
              showMonthTitle={false}
              events={eventsMap}
            />
          )}
          {full &&
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((month) => (
              <MonthCalendar
                key={`month-calendar-${month}`}
                month={month}
                year={year}
                weekStartDay={weekStartDay}
                showMonthTitle={true}
                events={eventsMap}
              />
            ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {renderCalendar(true)}
      {renderCalendar(false)}
    </>
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
};
