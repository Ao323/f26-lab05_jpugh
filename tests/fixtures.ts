import { ReservationManager } from '../src/reservationManager';
import { InMemoryStorageProvider } from '../src/storage/inMemoryStorageProvider';
import type { ReservationRequest, Room } from '../src/types';

export const STANDARD_ROOM: Room = {
  id: 'r1',
  name: 'Wean 5207',
  capacity: 12,
  hourlyRateCents: 6000,
};

export const PREMIUM_ROOM: Room = {
  id: 'r2',
  name: 'Gates 6115',
  capacity: 20,
  hourlyRateCents: 8000,
  premium: true,
};

/** A manager with both rooms registered, plus the storage it writes to. */
export function newService(): { manager: ReservationManager; storage: InMemoryStorageProvider } {
  const storage = new InMemoryStorageProvider();
  const manager = new ReservationManager(storage);
  manager.registerRoom(STANDARD_ROOM);
  manager.registerRoom(PREMIUM_ROOM);
  return { manager, storage };
}

/** A valid 9:00 to 11:00 request in the standard room, with fields overridable. */
export function aRequest(overrides: Partial<ReservationRequest> = {}): ReservationRequest {
  return {
    roomId: STANDARD_ROOM.id,
    organizer: 'alice@example.edu',
    attendees: 4,
    start: 540,
    end: 660,
    ...overrides,
  };
}
