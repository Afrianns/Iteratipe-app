import { forwardRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "@/app/globals.css"
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { formatFlexibleDuration } from "@/lib/convertDateinDuration";
import { InputSelectPropsType } from "@/types/types";

// 1. Generate lists for the selectors
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear - 10 + i);


export const DatePickerRange = ({ durationDateFn, initialStartDate, initialEndDate }: {durationDateFn: (a: string) => void, initialStartDate: string, initialEndDate: string}) => {
  const [startDate, setStartDate] = useState<Date | null>(initialStartDate ? new Date(initialStartDate) : null);
  const [endDate, setEndDate] = useState<Date | null>(initialEndDate ? new Date(initialEndDate) : null);

  const onChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    durationDateFn(formatFlexibleDuration(String(start || ''), String(end || '')))
    setStartDate(start);
    setEndDate(end);
  };

  return (
     <div className="z-50 relative">
        <DatePicker
          renderCustomHeader={(props) => <HeaderDatePicker {...props}/>}
          selected={startDate}
          onChange={onChange}
          startDate={startDate}
          endDate={endDate}
          dropdownMode="scroll"
          showMonthDropdown
          showYearDropdown
          selectsRange
          dateFormat="d MMMM YYYY"
          calendarClassName="z-10"
          portalId="date-picker-root"
          customInput={<SelectDate start_at={startDate} end_at={endDate} className="text-sm flex items-center justify-between gap-2 hover:bg-light-gray rounded-xl cursor-pointer py-1 px-5" />}
        />
     </div>
  );
};

const SelectDate  = forwardRef<HTMLButtonElement, InputSelectPropsType>(({ start_at, end_at, onClick, className }, ref) => {
  const convertDate = (date: Date | null) => `${date?.getDate()} ${months[date?.getMonth() || 0]} ${date?.getFullYear()}`
  console.log(convertDate(start_at), end_at)
  return (
    <button type="button" className={className} onClick={onClick} ref={ref}>
      <CalendarDays className="w-3 h-3" />
      <div className="flex items-center gap-x-2 text-xs">
          <input hidden readOnly name="start_at" id="start_at" value={start_at ? convertDate(start_at) : ''} />
          <p>{start_at ? convertDate(start_at) : "no start date"}</p>
          -
          <input hidden readOnly name="end_at" id="end_at" value={end_at ? convertDate(end_at) : ''}/>
          <p>{end_at ? convertDate(end_at) : "no end date"}</p>
      </div>
    </button>
  )
})


// 2. The Custom Header Component
const HeaderDatePicker = ({
  date,
  changeYear,
  changeMonth,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}: any) => {
  return (
    <div className="flex items-center gap-x-2 justify-between px-5">
      <button type="button"
      
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
        className="p-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
      >
        <ChevronLeft />
      </button>

      <div className="flex gap-2">
        <select
          value={months[date.getMonth()]}
          onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
          className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
        >
          {months.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <select
          value={date.getFullYear()}
          onChange={({ target: { value } }) => changeYear(Number(value))}
          className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
        >
          {years.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
        className="p-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
      >
        <ChevronRight />
      </button>
    </div>
  );
};