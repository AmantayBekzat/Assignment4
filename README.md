# Smart Campus Room Availability

A front-end-only room availability checker for a fictional campus. Users filter rooms by capacity and equipment, select a room, choose a time interval, and check whether the room is available. No bookings are created — the tool only checks.

## Features

- Filter rooms by attendee count, required equipment, and name/building search
- Five fictional rooms with equipment lists and capacity
- Check availability against hard-coded sample bookings
- Blocked rooms remain selectable but always return "Unavailable"
- Fixed current time (09:00); candidate must start after this
- Max booking length 120 minutes; 24-hour clock (00:00–24:00)
- Touching intervals allowed; overlaps rejected
- Immutable — checking never modifies bookings
- Empty states for no-match filters and no-selection
- Accessible labels, aria-pressed equipment toggles, live result region

## Quick start

```sh
npm ci
npm run dev -- --host 127.0.0.1
# Open http://127.0.0.1:5173
```

## Verification

```sh
npm run test        # vitest
npm run build       # vite build
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
```

## Module diagram — before (original assignment)

```
src/
├── App.tsx
├── index.css
├── main.tsx
├── vite-env.d.ts
├── components/
│   ├── ResultBanner.tsx
│   ├── RoomCard.tsx
│   └── Timeline.tsx
└── lib/
    ├── sampleData.ts
    ├── types.ts
    ├── validation.test.ts
    └── validation.ts
```

## Module diagram — after (current)

```
src/
├── main.tsx                            React root mount
├── App.tsx                             Page: state, layout, event handlers
├── index.css                           Tailwind entry
├── vite-env.d.ts
├── lib/
│   ├── types.ts                        Domain types (Room, Booking, Filters, CheckResult)
│   ├── sampleData.ts                   5 rooms + 6 bookings + EQUIPMENT_OPTIONS
│   ├── validation.ts                   Pure availability logic + strict labelToMinutes
│   ├── filterRooms.ts                  Pure room filtering + isValidAttendees
│   ├── selectionReconciliation.ts      Pure selection reconciliation
│   ├── validation.test.ts              17 AC tests (AC1–AC5) — unchanged
│   ├── labelToMinutes.test.ts           9 strict parser tests (P01–P09)
│   ├── filterRooms.test.ts             15 filter tests (F1–F4, invalid, boundary)
│   ├── selectionReconciliation.test.ts 4 reconciliation tests (F5)
│   └── integration.test.ts             4 state integration tests
└── components/
    ├── FiltersPanel.tsx                Attendees + equipment + search inputs
    ├── RoomCard.tsx                    Selectable room tile with equipment badges
    ├── Timeline.tsx                    Visual booking timeline for selected room
    └── ResultBanner.tsx                Available/Unavailable result (role=status)
```

## Data flow

```
User input                Pure logic                         UI output
──────────                ──────────                         ──────────
Filters ─────> filterRooms(rooms, filters) ──> filtered room list
                     │
                     └──> reconcileSelection(prev, ids) ──> effective selection

Room click ──> setSelectedRoomId + clearResult

Time change ──> setStartTime/setEndTime + clearResult

Check click ──> labelToMinutes(start/end)
                     │
                     └──> checkAvailability(roomId, interval, 540, rooms, bookings)
                              │
                              └──> ResultBanner (role=status, aria-live=polite)
```

## Acceptance criteria

| AC  | Rule                                          | Location      |
|-----|-----------------------------------------------|---------------|
| AC1 | 0 ≤ start < end ≤ 1440, start > now (540)     | validation.ts |
| AC2 | Duration ≤ 120 minutes                        | validation.ts |
| AC3 | Blocked rooms return Unavailable              | validation.ts |
| AC4 | Touching allowed, overlap rejected            | validation.ts |
| AC5 | Bookings array never mutated                  | validation.ts |
| AC6 | Responsive feedback, result clears on change  | App.tsx       |

## Filter rules

| F   | Rule                                                  | Location              |
|-----|-------------------------------------------------------|-----------------------|
| F1  | Room capacity >= attendees (positive integer)         | filterRooms.ts        |
| F2  | Room must have ALL required equipment                 | filterRooms.ts        |
| F3  | Blocked rooms still match — remain selectable         | filterRooms.ts        |
| F4  | No matches returns empty list                         | filterRooms.ts        |
| F5  | Selection preserved if matching, cleared if excluded  | selectionReconciliation.ts |

## Parser rules

`labelToMinutes` accepts only exact `HH:MM` (two digits each side).
Valid range: `00:00`–`23:59` plus `24:00`. Everything else returns `NaN`.

## Constraints

- No backend, login, API, or database
- No booking creation — check only
- All data is hard-coded fictional sample data
