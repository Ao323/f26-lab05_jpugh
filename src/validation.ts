import type { ReservationRequest, Room, ValidationResult } from './types';

const MINUTES_PER_DAY = 24 * 60;
const OPENING_MINUTE = 8 * 60;
const CLOSING_MINUTE = 22 * 60;
const MIN_DURATION_MINUTES = 15;
const MAX_DURATION_MINUTES = 8 * 60;
const BOUNDARY_MINUTES = 15;

/**
 * Checks a reservation request end to end against the room it targets.
 * Returns on the first problem found so the caller can report one clear reason.
 */
export function validateReservationRequest(
  request: ReservationRequest,
  room: Room,
): ValidationResult {
  // Shape of the request itself.
  if (typeof request.organizer !== 'string' || request.organizer.trim() === '') {
    return { valid: false, reason: 'organizer is required' };
  }
  if (!Number.isInteger(request.attendees) || request.attendees < 1) {
    return { valid: false, reason: 'attendees must be a positive whole number' };
  }

  // Times.
  if (!Number.isInteger(request.start) || !Number.isInteger(request.end)) {
    return { valid: false, reason: 'start and end must be whole minutes' };
  }
  if (request.start < 0 || request.end > MINUTES_PER_DAY) {
    return { valid: false, reason: 'start and end must fall inside a single day' };
  }
  if (request.end <= request.start) {
    return { valid: false, reason: 'end must be after start' };
  }

  // Duration.
  const durationMinutes = request.end - request.start;
  if (durationMinutes < MIN_DURATION_MINUTES) {
    return { valid: false, reason: `bookings must run at least ${MIN_DURATION_MINUTES} minutes` };
  }
  if (durationMinutes > MAX_DURATION_MINUTES) {
    return { valid: false, reason: `bookings may not run past ${MAX_DURATION_MINUTES} minutes` };
  }

  // Capacity.
  if (request.attendees > room.capacity) {
    return { valid: false, reason: `room ${room.id} seats ${room.capacity}` };
  }

  // Booking rules for this building.
  if (request.start % BOUNDARY_MINUTES !== 0 || request.end % BOUNDARY_MINUTES !== 0) {
    return { valid: false, reason: `start and end must land on ${BOUNDARY_MINUTES} minute boundaries` };
  }
  if (request.start < OPENING_MINUTE || request.end > CLOSING_MINUTE) {
    return { valid: false, reason: 'bookings must fall inside opening hours' };
  }
  if (room.premium === true && request.attendees < 2) {
    return { valid: false, reason: 'premium rooms need at least 2 attendees' };
  }

  return { valid: true };
}
