import { describe, it, expect } from "vitest";
import { checkAvailability } from "./validation";
import type { Room, Booking } from "./types";

// Default fixture constants
const DEFAULT_CURRENT_TIME = 540; // 09:00
const DEFAULT_ROOM_ID = "r1";

function makeRooms(blocked = false): Room[] {
  return [
    { id: "r1", name: "Newton 101", building: "Science Block", capacity: 40, blocked, equipment: ["Projector", "Whiteboard"] },
  ];
}

function makeBookings(): Booking[] {
  return [
    { id: "b1", room: "r1", start: 600, end: 660, bookedBy: "Prof. Hines" },
  ];
}

describe("checkAvailability", () => {
  it("T01: 660–720 is available — AC4, touching after existing booking is allowed", () => {
    const result = checkAvailability(
      DEFAULT_ROOM_ID,
      { start: 660, end: 720 },
      DEFAULT_CURRENT_TIME,
      makeRooms(),
      makeBookings()
    );
    expect(result.decision).toBe("available");
  });

  it("T02: 540–570 is unavailable — AC1, start equals current time", () => {
    const result = checkAvailability(
      DEFAULT_ROOM_ID,
      { start: 540, end: 570 },
      DEFAULT_CURRENT_TIME,
      makeRooms(),
      makeBookings()
    );
    expect(result.decision).toBe("unavailable");
  });

  it("T03: 720–720 is unavailable — AC1, zero duration", () => {
    const result = checkAvailability(
      DEFAULT_ROOM_ID,
      { start: 720, end: 720 },
      DEFAULT_CURRENT_TIME,
      makeRooms(),
      makeBookings()
    );
    expect(result.decision).toBe("unavailable");
  });

  it("T04: 750–720 is unavailable — AC1, reversed interval", () => {
    const result = checkAvailability(
      DEFAULT_ROOM_ID,
      { start: 750, end: 720 },
      DEFAULT_CURRENT_TIME,
      makeRooms(),
      makeBookings()
    );
    expect(result.decision).toBe("unavailable");
  });

  it("T05: 1380–1441 is unavailable — AC1, end exceeds 1440", () => {
    const result = checkAvailability(
      DEFAULT_ROOM_ID,
      { start: 1380, end: 1441 },
      DEFAULT_CURRENT_TIME,
      makeRooms(),
      makeBookings()
    );
    expect(result.decision).toBe("unavailable");
  });

  it("T06: 720–840 is available — AC2, exactly 120 minutes is allowed", () => {
    const result = checkAvailability(
      DEFAULT_ROOM_ID,
      { start: 720, end: 840 },
      DEFAULT_CURRENT_TIME,
      makeRooms(),
      makeBookings()
    );
    expect(result.decision).toBe("available");
  });

  it("T07: 720–841 is unavailable — AC2, 121 minutes exceeds the limit", () => {
    const result = checkAvailability(
      DEFAULT_ROOM_ID,
      { start: 720, end: 841 },
      DEFAULT_CURRENT_TIME,
      makeRooms(),
      makeBookings()
    );
    expect(result.decision).toBe("unavailable");
  });

  it("T08: 570–600 is available — AC4, touching before existing booking is allowed", () => {
    const result = checkAvailability(
      DEFAULT_ROOM_ID,
      { start: 570, end: 600 },
      DEFAULT_CURRENT_TIME,
      makeRooms(),
      makeBookings()
    );
    expect(result.decision).toBe("available");
  });

  it("T09: 630–690 is unavailable — AC4, partial overlap with existing booking", () => {
    const result = checkAvailability(
      DEFAULT_ROOM_ID,
      { start: 630, end: 690 },
      DEFAULT_CURRENT_TIME,
      makeRooms(),
      makeBookings()
    );
    expect(result.decision).toBe("unavailable");
  });

  it("T10: 570–690 is unavailable — AC4, candidate contains existing booking", () => {
    const result = checkAvailability(
      DEFAULT_ROOM_ID,
      { start: 570, end: 690 },
      DEFAULT_CURRENT_TIME,
      makeRooms(),
      makeBookings()
    );
    expect(result.decision).toBe("unavailable");
  });

  it("T11: 615–645 is unavailable — AC4, candidate is inside existing booking", () => {
    const result = checkAvailability(
      DEFAULT_ROOM_ID,
      { start: 615, end: 645 },
      DEFAULT_CURRENT_TIME,
      makeRooms(),
      makeBookings()
    );
    expect(result.decision).toBe("unavailable");
  });

  it("T12: 600–660 is unavailable — AC4, identical interval to existing booking", () => {
    const result = checkAvailability(
      DEFAULT_ROOM_ID,
      { start: 600, end: 660 },
      DEFAULT_CURRENT_TIME,
      makeRooms(),
      makeBookings()
    );
    expect(result.decision).toBe("unavailable");
  });

  it("T13: 660–720 with blocked room is unavailable — AC3", () => {
    const result = checkAvailability(
      DEFAULT_ROOM_ID,
      { start: 660, end: 720 },
      DEFAULT_CURRENT_TIME,
      makeRooms(true),
      makeBookings()
    );
    expect(result.decision).toBe("unavailable");
  });

  it("T14: 630–690 with empty bookingList is available — AC4, no conflicts", () => {
    const result = checkAvailability(
      DEFAULT_ROOM_ID,
      { start: 630, end: 690 },
      DEFAULT_CURRENT_TIME,
      makeRooms(),
      []
    );
    expect(result.decision).toBe("available");
  });

  it("T15: 660–720 does not mutate bookingList — AC5", () => {
    const bookings = makeBookings();
    const before = bookings.map((b) => ({ ...b }));
    checkAvailability(
      DEFAULT_ROOM_ID,
      { start: 660, end: 720 },
      DEFAULT_CURRENT_TIME,
      makeRooms(),
      bookings
    );
    expect(bookings).toEqual(before);
    expect(bookings).toHaveLength(before.length);
    expect(bookings[0]).toEqual(before[0]);
  });

  it("T16: 541–570 is available — AC1, starts one minute after current time", () => {
    const result = checkAvailability(
      DEFAULT_ROOM_ID,
      { start: 541, end: 570 },
      DEFAULT_CURRENT_TIME,
      makeRooms(),
      makeBookings()
    );
    expect(result.decision).toBe("available");
  });

  it("T17: 1380–1440 is available — AC1, exactly 24:00 end boundary is allowed", () => {
    const result = checkAvailability(
      DEFAULT_ROOM_ID,
      { start: 1380, end: 1440 },
      DEFAULT_CURRENT_TIME,
      makeRooms(),
      makeBookings()
    );
    expect(result.decision).toBe("available");
  });
});
