export function reconcileSelection(
  currentSelection: string,
  availableRoomIds: string[]
): string {
  if (currentSelection === "") return "";
  return availableRoomIds.includes(currentSelection) ? currentSelection : "";
}
