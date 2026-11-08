export interface Booking {
  id: string;
  room: string;
  start: number; // minutes from 00:00
  end: number;   // minutes from 00:00
  bookedBy: string;
}

export interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
  blocked: boolean;
  equipment: string[];
}

export interface Interval {
  start: number;
  end: number;
}

export type Decision = "available" | "unavailable";

export interface CheckResult {
  decision: Decision;
  reason: string;
}

export interface Filters {
  attendees: number;
  equipment: string[];
  search: string;
}
