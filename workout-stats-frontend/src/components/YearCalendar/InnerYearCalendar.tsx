import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { monthNames } from "./data";
import InnerMonthCalendar from "./InnerMonthCalendar";
import { CalendarEvent } from "./models";

export default function InnerYearCalendar({
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
            <InnerMonthCalendar
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
              <InnerMonthCalendar
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
  