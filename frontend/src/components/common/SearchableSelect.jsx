import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

const SearchableSelect = ({
  label,
  icon: Icon,
  value,
  options = [],
  placeholder,
  onChange,
  accent = "blue",
}) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const selectedOption = options.find((option) => option.value === value);

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return options;

    return options.filter((option) =>
      option.searchText.toLowerCase().includes(normalizedQuery)
    );
  }, [options, query]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!containerRef.current?.contains(event.target)) setIsOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleSelect = (option) => {
    onChange(option.value);
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative space-y-2">
      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
        {Icon && <Icon size={14} className={accent === "red" ? "text-red-600" : "text-blue-600"} />}
        {label}
      </label>
      <div className="relative">
        <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={isOpen ? query : selectedOption?.label || ""}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          role="combobox"
          aria-expanded={isOpen}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-9 text-sm font-normal text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
        />
        <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 top-[calc(100%+2.5rem)] z-20 max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
          {filteredOptions.length ? (
            filteredOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => handleSelect(option)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
              >
                <span className="min-w-0">
                  <span className="block truncate font-semibold">{option.label}</span>
                  {option.description && <span className="block truncate text-xs text-slate-400">{option.description}</span>}
                </span>
                {option.value === value && <Check size={15} className="shrink-0 text-blue-600" />}
              </button>
            ))
          ) : (
            <p className="px-3 py-4 text-center text-xs text-slate-400">No matching location found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;