import type { Booking } from '../types';

/** Raised when a storage operation is asked for something that is not there. */
export class StorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StorageError';
  }
}

/**
 * Persistence boundary for bookings. Implementations decide where the rows live;
 * callers only ever see the operations below.
 */
export interface StorageProvider {
  /** Stores a new booking. */
  save(booking: Booking): void;

  /** Replaces an existing booking with the same id. */
  update(booking: Booking): void;

  /** Returns the booking with this id, or undefined. */
  findById(id: string): Booking | undefined;

  /** Returns every booking for a room, in insertion order. */
  findByRoom(roomId: string): Booking[];

  /** Returns every stored booking, in insertion order. */
  findAll(): Booking[];

  /** Drops everything. */
  clear(): void;
}
