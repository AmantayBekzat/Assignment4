import { describe, it, expect } from "vitest";
import { filterRooms } from "./filterRooms";
import { reconcileSelection } from "./selectionReconciliation";
import { checkAvailability } from "./validation";
import type { Room, Booking, Filters } from "./types";

const ROOMS: Room[] = [
  { id: "r1", name: "Newton 101", building: "Science Block", capacity: 40, blocked: false, equipment: ["Projector", "Whiteboard"] },
  { id: "r2", name: "Curie 205", building: "Science Block", capacity: 25, blocked: false, equipment: ["Whiteboard"] },
  { id: "r3", name: "Turing 302", building: "IT Wing", capacity: 30, blocked: false, equipment: ["Projector", "Video Conferencing", "Smart Board"] },
  { id: "r4", name: "Da Vinci 110", building: "Arts Hall", capacity: 60, blocked: true, equipment: ["Projector", "Audio System"] },
  { id: "r5", name: "Einstein 410", building: "Physics Block", capacity: 20, blocked: false, equipment: ["Whiteboard", "Video Conferencing"] },
];

const BOOKINGS: Booking[] = [
  { id: "b1", room: "r1", start: 600, end: 660, bookedBy: "Prof. Hines" },
];

const NO_FILTERS: Filters = { attendees: 0, equipment: [], search: "" };
const NOW = 540;

describe("filter + reconciliation integration", () => {
  it("INT-a: tightening filters excludes current selection", () => {
    let selected = "r5";
    const nextFiltered = filterRooms(ROOMS, { ...NO_FILTERS, attendees: 25 });
    selected = reconcileSelection(selected, nextFiltered.map((r) => r.id));
    expect(selected).toBe("");
  });

  it("INT-b: loosening filters preserves current selection", () => {
    let selected = "r1";
    const nextFiltered = filterRooms(ROOMS, { ...NO_FILTERS, attendees: 30 });
    selected = reconcileSelection(selected, nextFiltered.map((r) => r.id));
    expect(selected).toBe("r1");
  });

  it("INT-c: full flow — filter, select, check returns available", () => {
    const filtered = filterRooms(ROOMS, { ...NO_FILTERS, attendees: 30 });
    const selection = reconcileSelection("r1", filtered.map((r) => r.id));
    expect(selection).toBe("r1");
    const result = checkAvailability(selection, { start: 660, end: 720 }, NOW, ROOMS, BOOKINGS);
    expect(result.decision).toBe("available");
  });

  it("INT-d: full flow — select blocked room, check returns unavailable", () => {
    const filtered = filterRooms(ROOMS, { ...NO_FILTERS, attendees: 50 });
    const selection = reconcileSelection("r4", filtered.map((r) => r.id));
    expect(selection).toBe("r4");
    const result = checkAvailability(selection, { start: 660, end: 720 }, NOW, ROOMS, BOOKINGS);
    expect(result.decision).toBe("unavailable");
  });
});
