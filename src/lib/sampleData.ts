import type { Room, Booking } from "./types";

export const EQUIPMENT_OPTIONS: string[] = [
  "Projector",
  "Whiteboard",
  "Video Conferencing",
  "Audio System",
  "Smart Board",
];

export const rooms: Room[] = [
  { id: "r1", name: "Newton 101", building: "Science Block", capacity: 40, blocked: false, equipment: ["Projector", "Whiteboard"] },
  { id: "r2", name: "Curie 205", building: "Science Block", capacity: 25, blocked: false, equipment: ["Whiteboard"] },
  { id: "r3", name: "Turing 302", building: "IT Wing", capacity: 30, blocked: false, equipment: ["Projector", "Video Conferencing", "Smart Board"] },
  { id: "r4", name: "Da Vinci 110", building: "Arts Hall", capacity: 60, blocked: true, equipment: ["Projector", "Audio System"] },
  { id: "r5", name: "Einstein 410", building: "Physics Block", capacity: 20, blocked: false, equipment: ["Whiteboard", "Video Conferencing"] },
];

export const bookings: Booking[] = [
  { id: "b1", room: "r1", start: 9 * 60, end: 10 * 60, bookedBy: "Prof. Hines" },
  { id: "b2", room: "r1", start: 13 * 60 + 30, end: 15 * 60, bookedBy: "Prof. Larsson" },
  { id: "b3", room: "r2", start: 11 * 60, end: 12 * 60, bookedBy: "Dr. Okafor" },
  { id: "b4", room: "r3", start: 14 * 60, end: 15 * 60 + 30, bookedBy: "Prof. Chen" },
  { id: "b5", room: "r5", start: 8 * 60 + 30, end: 9 * 60 + 30, bookedBy: "Dr. Müller" },
  { id: "b6", room: "r5", start: 16 * 60, end: 17 * 60, bookedBy: "Prof. Hines" },
];
