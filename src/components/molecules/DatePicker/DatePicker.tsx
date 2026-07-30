import { useEffect, useRef, useState } from "react";
import { FiCalendar, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "./DatePicker.css";

type DatePickerProps = {
    value: string; // ISO yyyy-mm-dd, or ""
    onChange: (value: string) => void;
};

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function pad(n: number) {
    return String(n).padStart(2, "0");
}

function toIso(year: number, month: number, day: number) {
    return `${year}-${pad(month + 1)}-${pad(day)}`;
}

function formatDisplay(iso: string) {
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
}

function daysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}

// Monday-first weekday index for the 1st of the month (0 = Monday ... 6 = Sunday)
function leadingBlankCount(year: number, month: number) {
    const jsDay = new Date(year, month, 1).getDay(); // 0 = Sunday ... 6 = Saturday
    return (jsDay + 6) % 7;
}

function DatePicker({ value, onChange }: DatePickerProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const initial = value ? new Date(`${value}T00:00:00`) : new Date();
    const [viewYear, setViewYear] = useState(initial.getFullYear());
    const [viewMonth, setViewMonth] = useState(initial.getMonth());

    useEffect(() => {
        function onClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener("mousedown", onClickOutside);
        return () => document.removeEventListener("mousedown", onClickOutside);
    }, []);

    const goToPrevMonth = () => {
        if (viewMonth === 0) {
            setViewMonth(11);
            setViewYear((y) => y - 1);
        } else {
            setViewMonth((m) => m - 1);
        }
    };

    const goToNextMonth = () => {
        if (viewMonth === 11) {
            setViewMonth(0);
            setViewYear((y) => y + 1);
        } else {
            setViewMonth((m) => m + 1);
        }
    };

    const selectDay = (day: number) => {
        onChange(toIso(viewYear, viewMonth, day));
        setOpen(false);
    };

    const totalDays = daysInMonth(viewYear, viewMonth);
    const blanks = leadingBlankCount(viewYear, viewMonth);
    const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleString("en-GB", { month: "long" });

    return (
        <div className="date-picker" ref={ref}>
            <button
                type="button"
                className={`date-picker-trigger ${open ? "open" : ""}`}
                onClick={() => setOpen((o) => !o)}
            >
                <FiCalendar />
                <span className={value ? "" : "placeholder"}>
                    {value ? formatDisplay(value) : "dd/mm/yyyy"}
                </span>
            </button>

            {open && (
                <div className="date-picker-panel">
                    <div className="date-picker-header">
                        <button type="button" onClick={goToPrevMonth} aria-label="Previous month">
                            <FiChevronLeft />
                        </button>
                        <span>{monthLabel} {viewYear}</span>
                        <button type="button" onClick={goToNextMonth} aria-label="Next month">
                            <FiChevronRight />
                        </button>
                    </div>

                    <div className="date-picker-weekdays">
                        {WEEKDAYS.map((d) => (
                            <span key={d}>{d}</span>
                        ))}
                    </div>

                    <div className="date-picker-grid">
                        {Array.from({ length: blanks }, (_, i) => (
                            <span key={`blank-${i}`} />
                        ))}
                        {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => {
                            const iso = toIso(viewYear, viewMonth, day);
                            return (
                                <button
                                    type="button"
                                    key={day}
                                    className={iso === value ? "active" : ""}
                                    onClick={() => selectDay(day)}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default DatePicker;