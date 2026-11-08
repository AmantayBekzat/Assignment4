import { useMemo, useState } from "react";
import { Clock, Building2, Search, CalendarDays } from "lucide-react";
import { rooms as sampleRooms, bookings as sampleBookings } from "@/lib/sampleData";
import { checkAvailability, minutesToLabel, labelToMinutes } from "@/lib/validation";
import { filterRooms } from "@/lib/filterRooms";
import { reconcileSelection } from "@/lib/selectionReconciliation";
import type { CheckResult, Filters } from "@/lib/types";
import { RoomCard } from "@/components/RoomCard";
import { Timeline } from "@/components/Timeline";
import { ResultBanner } from "@/components/ResultBanner";
import { FiltersPanel } from "@/components/FiltersPanel";

const CURRENT_TIME = 540; // 09:00 fixed

const TIME_SLOTS: string[] = (() => {
  const arr: string[] = [];
  for (let m = 0; m <= 1440; m++) {
    arr.push(minutesToLabel(m));
  }
  return arr;
})();

export default function App() {
  const [rooms] = useState(sampleRooms);
  const [bookings] = useState(sampleBookings);

  const [filters, setFilters] = useState<Filters>({
    attendees: 0,
    equipment: [],
    search: "",
  });
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("09:00");
  const [endTime, setEndTime] = useState<string>("10:00");
  const [result, setResult] = useState<CheckResult | null>(null);

  const filteredRooms = useMemo(
    () => filterRooms(rooms, filters),
    [rooms, filters]
  );

  const selectedRoom = useMemo(
    () => filteredRooms.find((r) => r.id === selectedRoomId) ?? null,
    [filteredRooms, selectedRoomId]
  );

  const roomBookings = useMemo(
    () => bookings.filter((b) => b.room === selectedRoomId),
    [bookings, selectedRoomId]
  );

  function handleFiltersChange(next: Filters) {
    setFilters(next);
    const nextFiltered = filterRooms(rooms, next);
    setSelectedRoomId((prev) =>
      reconcileSelection(prev, nextFiltered.map((r) => r.id))
    );
    setResult(null);
  }

  function handleCheck() {
    if (!selectedRoomId) {
      setResult({ decision: "unavailable", reason: "Please select a room first." });
      return;
    }
    const start = labelToMinutes(startTime);
    const end = labelToMinutes(endTime);
    const res = checkAvailability(
      selectedRoomId,
      { start, end },
      CURRENT_TIME,
      rooms,
      bookings
    );
    setResult(res);
  }

  function handleReset() {
    setResult(null);
  }

  const selectClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Smart Campus Room Availability
              </h1>
              <p className="text-sm text-gray-500">
                Check if a campus room is free for your time slot.
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-700">
            <Clock className="w-4 h-4 text-sky-600" />
            <span className="font-medium">Current time:</span>
            <span className="text-gray-900 font-semibold">
              {minutesToLabel(CURRENT_TIME)}
            </span>
            <span className="text-gray-400 text-xs ml-1">
              Candidates must start after this time.
            </span>
          </div>
        </div>

        <FiltersPanel filters={filters} onChange={handleFiltersChange} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-600 mb-3">
              {filteredRooms.length > 0
                ? `${filteredRooms.length} matching room${filteredRooms.length > 1 ? "s" : ""}`
                : "Select a room"}
            </h2>

            {filteredRooms.length === 0 ? (
              <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-8 text-center">
                <CalendarDays className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-600">
                  No rooms match your filters
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Try reducing the attendee count or removing equipment
                  requirements.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredRooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    selected={selectedRoomId === room.id}
                    onSelect={() => {
                      setSelectedRoomId(room.id);
                      setResult(null);
                    }}
                  />
                ))}
              </div>
            )}

            {selectedRoom && (
              <div className="mt-5 bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900">{selectedRoom.name}</h3>
                <Timeline bookings={roomBookings} />
              </div>
            )}
          </section>

          <section className="space-y-5">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-600 mb-4">
                Booking interval
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="start-time" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Start
                  </label>
                  <select
                    id="start-time"
                    value={startTime}
                    onChange={(e) => {
                      setStartTime(e.target.value);
                      setResult(null);
                    }}
                    className={selectClass}
                  >
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="end-time" className="block text-sm font-medium text-gray-700 mb-1.5">
                    End
                  </label>
                  <select
                    id="end-time"
                    value={endTime}
                    onChange={(e) => {
                      setEndTime(e.target.value);
                      setResult(null);
                    }}
                    className={selectClass}
                  >
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-3 text-xs text-gray-400">
                Max booking length: 120 minutes. Times use a 24-hour clock
                (00:00–24:00).
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={handleCheck}
                  className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-sky-400"
                >
                  <Search className="w-4 h-4" /> Check availability
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Reset
                </button>
              </div>
            </div>

            {result ? (
              <>
                <ResultBanner result={result} />
                <p className="text-xs text-gray-400 px-1">
                  Note: checking does not create or modify any booking.
                </p>
              </>
            ) : (
              !selectedRoomId &&
              filteredRooms.length > 0 && (
                <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-6 text-center">
                  <p className="text-sm text-gray-400">
                    Select a room and time interval, then check availability.
                  </p>
                </div>
              )
            )}
          </section>
        </div>
      </main>

      <footer className="max-w-5xl mx-auto px-4 sm:px-6 pb-8">
        <p className="text-center text-xs text-gray-400">
          Fictional sample data for demonstration purposes.
        </p>
      </footer>
    </div>
  );
}
