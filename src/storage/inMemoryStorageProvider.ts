import type { Booking } from '../types';
import { StorageError, type StorageProvider } from './storageProvider';

/** Keeps bookings in a Map for the lifetime of the process. */
export class InMemoryStorageProvider implements StorageProvider {
  private readonly bookings = new Map<string, Booking>();

  save(booking: Booking): void {
    if (this.bookings.has(booking.id)) {
      throw new StorageError(`booking ${booking.id} already exists`);
    }
    this.bookings.set(booking.id, { ...booking });
  }

  update(booking: Booking): void {
    if (!this.bookings.has(booking.id)) {
      throw new StorageError(`booking ${booking.id} does not exist`);
    }
    this.bookings.set(booking.id, { ...booking });
  }

  findById(id: string): Booking | undefined {
    const found = this.bookings.get(id);
    return found === undefined ? undefined : { ...found };
  }

  findByRoom(roomId: string): Booking[] {
    return this.findAll().filter((booking) => booking.roomId === roomId);
  }

  findAll(): Booking[] {
    return [...this.bookings.values()].map((booking) => ({ ...booking }));
  }

  clear(): void {
    this.bookings.clear();
  }
}
