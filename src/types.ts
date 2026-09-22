/**
 * Shared data shapes for the reservation service.
 * All times are minutes from midnight on the booking day.
 */

export interface Room {
  id: string;
  name: string;
  capacity: number;
  hourlyRateCents: number;
  premium?: boolean;
}

export interface ReservationRequest {
  roomId: string;
  organizer: string;
  attendees: number;
  start: number;
  end: number;
  notes?: string;
}

export interface Booking {
  id: string;
  roomId: string;
  organizer: string;
  attendees: number;
  start: number;
  end: number;
  status: 'confirmed' | 'cancelled';
  priceCents: number;
  notes?: string;
}

export interface ValidationResult {
  valid: boolean;
  reason?: string;
}
