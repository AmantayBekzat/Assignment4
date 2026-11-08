import { Lock, Users, MapPin, Check, Monitor } from "lucide-react";
import type { Room } from "@/lib/types";

interface RoomCardProps {
  room: Room;
  selected: boolean;
  onSelect: () => void;
}

export function RoomCard({ room, selected, onSelect }: RoomCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        "w-full text-left rounded-xl border-2 p-4 transition-all duration-200",
        room.blocked
          ? selected
            ? "border-red-400 bg-red-50 shadow-md"
            : "border-red-200 bg-red-50/50 hover:border-red-300 hover:shadow-sm"
          : selected
            ? "border-emerald-500 bg-emerald-50 shadow-md"
            : "border-gray-200 bg-white hover:border-emerald-300 hover:shadow-sm",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900 truncate">{room.name}</h3>
            {room.blocked && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                <Lock className="w-3 h-3" /> Blocked
              </span>
            )}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> {room.building}
            </span>
            <span className="inline-flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> {room.capacity}
            </span>
          </div>
          {room.equipment.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {room.equipment.map((e) => (
                <span
                  key={e}
                  className="inline-flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md"
                >
                  <Monitor className="w-3 h-3" /> {e}
                </span>
              ))}
            </div>
          )}
        </div>
        {selected && (
          <div
            className={[
              "flex-shrink-0 w-6 h-6 rounded-full text-white flex items-center justify-center",
              room.blocked ? "bg-red-500" : "bg-emerald-500",
            ].join(" ")}
          >
            <Check className="w-4 h-4" />
          </div>
        )}
      </div>
    </button>
  );
}
