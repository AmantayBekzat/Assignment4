import { describe, it, expect } from "vitest";
import { reconcileSelection } from "./selectionReconciliation";

describe("reconcileSelection", () => {
  it("F5-a: preserves matching selection", () => {
    expect(reconcileSelection("r1", ["r1", "r2", "r3"])).toBe("r1");
  });

  it("F5-b: clears excluded selection", () => {
    expect(reconcileSelection("r4", ["r1", "r2", "r3"])).toBe("");
  });

  it("F5-c: empty selection stays empty", () => {
    expect(reconcileSelection("", ["r1", "r2"])).toBe("");
  });

  it("F5-d: empty available list clears any selection", () => {
    expect(reconcileSelection("r1", [])).toBe("");
  });
});
