import { describe, it, expect } from "vitest";
import { labelToMinutes } from "./validation";

describe("labelToMinutes", () => {
  it("P01: 00:00 -> 0", () => {
    expect(labelToMinutes("00:00")).toBe(0);
  });

  it("P02: 09:00 -> 540", () => {
    expect(labelToMinutes("09:00")).toBe(540);
  });

  it("P03: 23:59 -> 1439", () => {
    expect(labelToMinutes("23:59")).toBe(1439);
  });

  it("P04: 24:00 -> 1440 (valid boundary)", () => {
    expect(labelToMinutes("24:00")).toBe(1440);
  });

  it("P05: 24:01 -> NaN (invalid)", () => {
    expect(labelToMinutes("24:01")).toBeNaN();
  });

  it("P06: 12:60 -> NaN (invalid minutes)", () => {
    expect(labelToMinutes("12:60")).toBeNaN();
  });

  it("P07: 9:00 -> NaN (not HH:MM)", () => {
    expect(labelToMinutes("9:00")).toBeNaN();
  });

  it("P08: empty string -> NaN", () => {
    expect(labelToMinutes("")).toBeNaN();
  });

  it("P09: 25:00 -> NaN (invalid hour)", () => {
    expect(labelToMinutes("25:00")).toBeNaN();
  });
});
