import { describe, expect, it } from 'vitest';
import type { ReservationRequest } from '../src/types';
import { PREMIUM_ROOM, aRequest, newService } from './fixtures';

describe('request validation', () => {
  it('accepts a well formed request', () => {
    const { manager } = newService();
    expect(manager.createBooking(aRequest()).status).toBe('confirmed');
  });

  it('accepts the earliest and latest windows the rules allow', () => {
    const { manager } = newService();
    expect(manager.createBooking(aRequest({ start: 480, end: 495 })).status).toBe('confirmed');
    expect(manager.createBooking(aRequest({ start: 1305, end: 1320 })).status).toBe('confirmed');
  });

  const rejections: Array<[string, Partial<ReservationRequest>, string]> = [
    ['a blank organizer', { organizer: '   ' }, 'organizer is required'],
    ['zero attendees', { attendees: 0 }, 'attendees must be a positive whole number'],
    ['a fractional attendee count', { attendees: 2.5 }, 'attendees must be a positive whole number'],
    ['times that are not whole minutes', { start: 540.5 }, 'start and end must be whole minutes'],
    ['a start before midnight', { start: -60 }, 'start and end must fall inside a single day'],
    ['an end past midnight', { start: 1380, end: 1500 }, 'start and end must fall inside a single day'],
    ['an end at the start', { start: 600, end: 600 }, 'end must be after start'],
    ['an end before the start', { start: 660, end: 600 }, 'end must be after start'],
    ['a booking under a quarter hour', { start: 600, end: 610 }, 'must run at least 15 minutes'],
    ['a booking over eight hours', { start: 480, end: 1020 }, 'may not run past 480 minutes'],
    ['more attendees than seats', { attendees: 50 }, 'room r1 seats 12'],
    ['times off the quarter hour', { start: 605, end: 700 }, 'must land on 15 minute boundaries'],
    ['a start before opening', { start: 420, end: 480 }, 'must fall inside opening hours'],
    ['an end after closing', { start: 1260, end: 1380 }, 'must fall inside opening hours'],
  ];

  it.each(rejections)('rejects %s', (_label, overrides, reason) => {
    const { manager } = newService();
    expect(() => manager.createBooking(aRequest(overrides))).toThrow(reason);
  });

  it('rejects a solo booking in a premium room', () => {
    const { manager } = newService();
    expect(() =>
      manager.createBooking(aRequest({ roomId: PREMIUM_ROOM.id, attendees: 1 })),
    ).toThrow('premium rooms need at least 2 attendees');
  });
});
