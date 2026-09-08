import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Megaphone, User } from "lucide-react";

const ROLES = [
  {
    value: "user",
    label: "User",
    description: "Browse and book events",
    icon: User,
  },
  {
    value: "Organizer",
    label: "Organizer",
    description: "Create and manage events",
    icon: Megaphone,
  },
];

export default function RoleDropdown({ value, onChange, defaultValue = "user" }) {
  const [open, setOpen] = useState(false);
  const [internalSelected, setInternalSelected] = useState(defaultValue);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef(null);
  const selected = value ?? internalSelected;

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(roleValue) {
    setInternalSelected(roleValue);
    setOpen(false);
    onChange?.(roleValue);
  }

  function handleKeyDown(event) {
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }

    if (!open && (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      setHighlightedIndex(Math.max(0, ROLES.findIndex((role) => role.value === selected)));
      setOpen(true);
      return;
    }

    if (!open) return;

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((index) =>
        event.key === "ArrowDown"
          ? (index + 1) % ROLES.length
          : (index - 1 + ROLES.length) % ROLES.length
      );
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleSelect(ROLES[highlightedIndex].value);
    }
  }

  const current = ROLES.find((role) => role.value === selected) ?? ROLES[0];
  const CurrentIcon = current.icon;

  return (
    <div className="w-full" ref={containerRef}>
      <label id="role-label" className="mb-2 block text-sm font-semibold text-slate-700">How will you use Eventify?</label>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((isOpen) => !isOpen)}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-labelledby="role-label"
          aria-controls="role-options"
          className="flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-left outline-none transition hover:border-violet-300 hover:bg-white focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
        >
          <span className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
              <CurrentIcon size={16} />
            </span>
            <span>
              <span className="block text-sm font-bold text-slate-900">{current.label}</span>
              <span className="block text-xs text-slate-500">{current.description}</span>
            </span>
          </span>

          <ChevronDown
            size={18}
            className={`text-slate-400 transition-transform ${open ? "rotate-180 text-violet-600" : ""}`}
          />
        </button>

        {open && (
          <ul
            id="role-options"
            role="listbox"
            aria-labelledby="role-label"
            className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[0_18px_45px_rgba(15,23,42,0.16)]"
          >
            {ROLES.map((role, index) => {
              const Icon = role.icon;
              const isSelected = role.value === selected;
              const isHighlighted = index === highlightedIndex;

              return (
                <li key={role.value} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    onClick={() => handleSelect(role.value)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    tabIndex={-1}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${isHighlighted ? "bg-violet-50" : "hover:bg-slate-50"}`}
                  >
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-xl ${isSelected ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-500"}`}
                    >
                      <Icon size={16} />
                    </span>

                    <span className="flex-1">
                      <span className="block text-sm font-bold text-slate-900">{role.label}</span>
                      <span className="block text-xs text-slate-500">{role.description}</span>
                    </span>

                    {isSelected && <Check size={17} className="text-violet-600" />}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}