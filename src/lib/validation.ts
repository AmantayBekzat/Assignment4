import type { Room, Booking, Interval, CheckResult } from "./types";

const MAX_BOOKING_MIN = 120;
const DAY_END = 1440;

export function minutesToLabel(m: number): string {
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
}

export function labelToMinutes(label: string): number {
  const match = /^(\d{2}):(\d{2})$/.exec(label);
  if (!match) return NaN;
  const h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  if (h === 24 && m === 0) return 1440;
  if (h > 23 || m > 59) return NaN;
  return h * 60 + m;
}

function overlaps(a: Interval, b: Interval): boolean {
  return a.start < b.end && b.start < a.end;
}

export function checkAvailability(
  roomId: string,
  interval: Interval,
  currentTime: number,
  roomList: Room[],
  bookingList: Booking[]
): CheckResult {
  const { start, end } = interval;

  // AC1: validate the interval window
  if (isNaN(start) || isNaN(end)) {
    return { decision: "unavailable", reason: "Please enter a valid start and end time." };
  }
  if (start < 0 || end <= start || end > DAY_END) {
    return { decision: "unavailable", reason: "Time must be within 00:00–24:00 with start before end." };
  }
  if (start <= currentTime) {
    return { decision: "unavailable", reason: "Start time must be after the current time." };
  }

  // AC2: reject bookings longer than 120 minutes
  if (end - start > MAX_BOOKING_MIN) {
    return { decision: "unavailable", reason: "Booking exceeds the 120-minute maximum length." };
  }

  // AC3: reject when room is blocked
  const room = roomList.find((r) => r.id === roomId);
  if (!room) {
    return { decision: "unavailable", reason: "Please select a valid room." };
  }
  if (room.blocked) {
    return { decision: "unavailable", reason: `${room.name} is currently blocked and cannot be booked.` };
  }

  // AC4: reject overlaps with existing bookings (touching endpoints allowed)
  const roomBookings = bookingList.filter((b) => b.room === roomId);
  const conflict = roomBookings.find((b) => overlaps(interval, { start: b.start, end: b.end }));
  if (conflict) {
    return {
      decision: "unavailable",
      reason: `Overlaps with an existing booking (${minutesToLabel(conflict.start)}–${minutesToLabel(conflict.end)} by ${conflict.bookedBy}).`,
    };
  }

  return { decision: "available", reason: `${room.name} is available for this interval.` };
}
