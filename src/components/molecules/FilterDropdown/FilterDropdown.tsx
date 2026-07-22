import { useEffect, useRef, useState, type ReactNode } from "react";
import { FiChevronDown } from "react-icons/fi";
import "./FilterDropdown.css";

export type FilterOption<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  icon: ReactNode;
  label: string;
  options: FilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

export default function FilterDropdown<T extends string>({
  icon, label, options, value, onChange,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className="filter-dropdown" ref={ref}>
      <button
        type="button"
        className={`filter-trigger ${open ? "open" : ""}`}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="filter-icon">{icon}</span>
        <span>{label}</span>
        <FiChevronDown className="filter-chevron" />
      </button>

      {open && (
        <ul className="filter-menu">
          {options.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                className={opt.value === value ? "active" : ""}
                onClick={() => { onChange(opt.value); setOpen(false); }}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}