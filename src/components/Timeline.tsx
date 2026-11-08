import type { Booking } from "@/lib/types";
import { minutesToLabel } from "@/lib/validation";

interface TimelineProps {
  bookings: Booking[];
}

const START = 7 * 60; // 07:00
const END = 21 * 60;  // 21:00
const SPAN = END - START;

function timeToPercent(m: number): number {
  return ((m - START) / SPAN) * 100;
}

export function Timeline({ bookings }: TimelineProps) {
  const marks = [];
  for (let h = 7; h <= 21; h += 2) {
    marks.push(h);
  }

  return (
    <div className="mt-4">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
        Today's bookings
      </h4>
      {bookings.length === 0 ? (
        <p className="text-sm text-gray-400 italic">No existing bookings for this room.</p>
      ) : (
        <>
        <div className="relative h-14 bg-gray-100 rounded-lg overflow-hidden">
          {/* hour gridlines */}
          {marks.map((h) => (
            <div
              key={h}
              className="absolute top-0 bottom-0 border-l border-gray-200"
              style={{ left: `${timeToPercent(h * 60)}%` }}
            />
          ))}
          {/* booking bars (visual position only — labels below) */}
          {bookings.map((b) => {
            const left = timeToPercent(Math.max(b.start, START));
            const right = timeToPercent(Math.min(b.end, END));
            const width = Math.max(right - left, 2);
            return (
              <div
                key={b.id}
                className="absolute top-2 bottom-2 rounded-md bg-sky-500/80"
                style={{ left: `${left}%`, width: `${width}%` }}
                title={`${minutesToLabel(b.start)}–${minutesToLabel(b.end)} • ${b.bookedBy}`}
              />
            );
          })}
        </div>
        {/* readable booking list */}
        <ul className="mt-3 space-y-1.5">
          {bookings.map((b) => (
            <li key={b.id} className="flex items-center gap-2 text-sm text-gray-700">
              <span className="inline-block w-2.5 h-2.5 rounded-sm bg-sky-500/80 flex-shrink-0" />
              <span className="font-medium">{minutesToLabel(b.start)}–{minutesToLabel(b.end)}</span>
              <span className="text-gray-400">·</span>
              <span className="text-gray-500">{b.bookedBy}</span>
            </li>
          ))}
        </ul>
        </>
      )}
      <div className="flex justify-between mt-1 text-[10px] text-gray-400">
        {marks.map((h) => (
          <span key={h}>{String(h).padStart(2, "0")}:00</span>
        ))}
      </div>
    </div>
  );
}
