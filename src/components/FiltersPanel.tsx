import { Users, Search, Monitor, Check } from "lucide-react";
import type { Filters } from "@/lib/types";
import { EQUIPMENT_OPTIONS } from "@/lib/sampleData";
import { isValidAttendees } from "@/lib/filterRooms";

interface FiltersPanelProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export function FiltersPanel({ filters, onChange }: FiltersPanelProps) {
  function toggleEquipment(item: string) {
    const has = filters.equipment.includes(item);
    onChange({
      ...filters,
      equipment: has
        ? filters.equipment.filter((e) => e !== item)
        : [...filters.equipment, item],
    });
  }

  const attendeesInvalid =
    filters.attendees !== 0 && !isValidAttendees(filters.attendees);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-600 mb-4">
        Filter rooms
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="filter-attendees"
            className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5"
          >
            <Users className="w-4 h-4 text-sky-600" /> Attendees
          </label>
          <input
            id="filter-attendees"
            type="number"
            min={0}
            step={1}
            value={filters.attendees || ""}
            onChange={(e) => {
              const raw = e.target.value;
              if (raw.trim() === "") {
                onChange({ ...filters, attendees: 0 });
              } else {
                onChange({ ...filters, attendees: Number(raw) });
              }
            }}
            placeholder="Any"
            aria-invalid={attendeesInvalid}
            aria-describedby={attendeesInvalid ? "attendees-error" : undefined}
            className={[
              "w-full rounded-lg border px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2",
              attendeesInvalid
                ? "border-red-400 focus:ring-red-400"
                : "border-gray-300 focus:ring-sky-400",
            ].join(" ")}
          />
          {attendeesInvalid && (
            <p id="attendees-error" className="mt-1.5 text-xs text-red-600">
              Attendees must be a whole number of 0 or more.
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="filter-search"
            className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5"
          >
            <Search className="w-4 h-4 text-sky-600" /> Search
          </label>
          <input
            id="filter-search"
            type="text"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Room name or building..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>
      </div>

      <div className="mt-4">
        <span className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
          <Monitor className="w-4 h-4 text-sky-600" /> Required equipment
        </span>
        <div className="flex flex-wrap gap-2">
          {EQUIPMENT_OPTIONS.map((item) => {
            const active = filters.equipment.includes(item);
            return (
              <button
                key={item}
                type="button"
                aria-pressed={active}
                onClick={() => toggleEquipment(item)}
                className={[
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition",
                  active
                    ? "bg-sky-600 text-white border border-sky-600"
                    : "bg-white text-gray-600 border border-gray-300 hover:border-sky-400 hover:text-sky-600",
                ].join(" ")}
              >
                {active && <Check className="w-3.5 h-3.5" />}
                {item}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
