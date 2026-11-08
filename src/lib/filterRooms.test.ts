import { describe, it, expect } from "vitest";
import { filterRooms } from "./filterRooms";
import type { Room, Filters } from "./types";

const TEST_ROOMS: Room[] = [
  { id: "r1", name: "Newton 101", building: "Science Block", capacity: 40, blocked: false, equipment: ["Projector", "Whiteboard"] },
  { id: "r2", name: "Curie 205", building: "Science Block", capacity: 25, blocked: false, equipment: ["Whiteboard"] },
  { id: "r3", name: "Turing 302", building: "IT Wing", capacity: 30, blocked: false, equipment: ["Projector", "Video Conferencing", "Smart Board"] },
  { id: "r4", name: "Da Vinci 110", building: "Arts Hall", capacity: 60, blocked: true, equipment: ["Projector", "Audio System"] },
  { id: "r5", name: "Einstein 410", building: "Physics Block", capacity: 20, blocked: false, equipment: ["Whiteboard", "Video Conferencing"] },
];

const NO_FILTERS: Filters = { attendees: 0, equipment: [], search: "" };

describe("filterRooms", () => {
  it("F1-a: capacity >= attendees — rooms with sufficient capacity are included", () => {
    const result = filterRooms(TEST_ROOMS, { ...NO_FILTERS, attendees: 30 });
    expect(result.map((r) => r.id)).toEqual(["r1", "r3", "r4"]);
  });

  it("F1-b: capacity < attendees — rooms below threshold are excluded", () => {
    const result = filterRooms(TEST_ROOMS, { ...NO_FILTERS, attendees: 50 });
    expect(result.map((r) => r.id)).toEqual(["r4"]);
  });

  it("F1-c: exact capacity boundary — capacity == attendees is included", () => {
    const result = filterRooms(TEST_ROOMS, { ...NO_FILTERS, attendees: 25 });
    expect(result.map((r) => r.id)).toContain("r2");
  });

  it("F2-a: ALL required equipment present — room with all items is included", () => {
    const result = filterRooms(TEST_ROOMS, {
      ...NO_FILTERS,
      equipment: ["Projector", "Whiteboard"],
    });
    expect(result.map((r) => r.id)).toEqual(["r1"]);
  });

  it("F2-b: missing one equipment item — room is excluded", () => {
    const result = filterRooms(TEST_ROOMS, {
      ...NO_FILTERS,
      equipment: ["Projector", "Smart Board"],
    });
    expect(result.map((r) => r.id)).toEqual(["r3"]);
  });

  it("F3: blocked rooms still match filters — they remain selectable", () => {
    const result = filterRooms(TEST_ROOMS, { ...NO_FILTERS, attendees: 50 });
    expect(result.find((r) => r.id === "r4")?.blocked).toBe(true);
  });

  it("F4: no rooms match — returns empty array", () => {
    const result = filterRooms(TEST_ROOMS, { ...NO_FILTERS, attendees: 100 });
    expect(result).toEqual([]);
  });

  it("F-boundary: attendees=0 shows all rooms — no capacity filter applied", () => {
    const result = filterRooms(TEST_ROOMS, NO_FILTERS);
    expect(result).toHaveLength(5);
  });

  it("F-search: search by building narrows results", () => {
    const result = filterRooms(TEST_ROOMS, { ...NO_FILTERS, search: "Science" });
    expect(result.map((r) => r.id)).toEqual(["r1", "r2"]);
  });

  it("F-combined: capacity + equipment combined filter", () => {
    const result = filterRooms(TEST_ROOMS, {
      attendees: 30,
      equipment: ["Projector"],
      search: "",
    });
    expect(result.map((r) => r.id)).toEqual(["r1", "r3", "r4"]);
  });

  it("F-invalid-a: NaN attendees returns empty list", () => {
    const result = filterRooms(TEST_ROOMS, { ...NO_FILTERS, attendees: NaN });
    expect(result).toEqual([]);
  });

  it("F-invalid-b: negative attendees returns empty list", () => {
    const result = filterRooms(TEST_ROOMS, { ...NO_FILTERS, attendees: -5 });
    expect(result).toEqual([]);
  });

  it("F-invalid-c: non-integer attendees (25.9) returns empty list", () => {
    const result = filterRooms(TEST_ROOMS, { ...NO_FILTERS, attendees: 25.9 });
    expect(result).toEqual([]);
  });

  it("F-boundary-25: capacity 25 matches attendees=25", () => {
    const result = filterRooms(TEST_ROOMS, { ...NO_FILTERS, attendees: 25 });
    expect(result.map((r) => r.id)).toContain("r2");
  });

  it("F-boundary-26: capacity 25 does not match attendees=26", () => {
    const result = filterRooms(TEST_ROOMS, { ...NO_FILTERS, attendees: 26 });
    expect(result.map((r) => r.id)).not.toContain("r2");
  });
});
