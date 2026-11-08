import type { Room, Filters } from "./types";

export function isValidAttendees(attendees: number): boolean {
  return Number.isFinite(attendees) && attendees >= 0 && Number.isInteger(attendees);
}

export function filterRooms(rooms: Room[], filters: Filters): Room[] {
  const { attendees, equipment, search } = filters;
  const query = search.trim().toLowerCase();

  if (!isValidAttendees(attendees)) return [];

  return rooms.filter((room) => {
    if (attendees > 0 && room.capacity < attendees) return false;

    if (equipment.length > 0) {
      const roomEquipment = new Set(room.equipment);
      for (const item of equipment) {
        if (!roomEquipment.has(item)) return false;
      }
    }

    if (query) {
      const matchesName = room.name.toLowerCase().includes(query);
      const matchesBuilding = room.building.toLowerCase().includes(query);
      if (!matchesName && !matchesBuilding) return false;
    }

    return true;
  });
}
