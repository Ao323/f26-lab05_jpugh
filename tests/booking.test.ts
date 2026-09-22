import { describe, expect, it } from 'vitest';
import { PREMIUM_ROOM, aRequest, newService } from './fixtures';

describe('creating bookings', () => {
  it('confirms and stores a valid request', () => {
    const { manager } = newService();
    const booking = manager.createBooking(aRequest());

    expect(booking.status).toBe('confirmed');
    expect(booking.roomId).toBe('r1');
    expect(booking.start).toBe(540);
    expect(booking.end).toBe(660);
    expect(manager.getBooking(booking.id)).toEqual(booking);
  });

  it('gives each booking its own id', () => {
    const { manager } = newService();
    const first = manager.createBooking(aRequest());
    const second = manager.createBooking(aRequest({ start: 660, end: 720 }));

    expect(first.id).not.toBe(second.id);
    expect(manager.listBookingsForRoom('r1')).toHaveLength(2);
  });

  it('rejects a request for a room it does not know', () => {
    const { manager } = newService();
    expect(() => manager.createBooking(aRequest({ roomId: 'nope' }))).toThrow('unknown room nope');
  });
});

describe('overlap rejection', () => {
  it('rejects an identical window', () => {
    const { manager } = newService();
    manager.createBooking(aRequest());
    expect(() => manager.createBooking(aRequest({ organizer: 'bob@example.edu' }))).toThrow(
      'already booked',
    );
  });

  it('rejects a partial overlap from either side', () => {
    const { manager } = newService();
    manager.createBooking(aRequest());
    expect(() => manager.createBooking(aRequest({ start: 600, end: 720 }))).toThrow('already booked');
    expect(() => manager.createBooking(aRequest({ start: 480, end: 600 }))).toThrow('already booked');
  });

  it('accepts bookings that touch at an endpoint', () => {
    const { manager } = newService();
    manager.createBooking(aRequest());
    const before = manager.createBooking(aRequest({ start: 480, end: 540 }));
    const after = manager.createBooking(aRequest({ start: 660, end: 720 }));

    expect(before.status).toBe('confirmed');
    expect(after.status).toBe('confirmed');
  });

  it('does not look at bookings in other rooms', () => {
    const { manager } = newService();
    manager.createBooking(aRequest());
    const other = manager.createBooking(aRequest({ roomId: PREMIUM_ROOM.id }));

    expect(other.roomId).toBe('r2');
  });
});

describe('cancelling bookings', () => {
  it('marks the booking cancelled', () => {
    const { manager } = newService();
    const booking = manager.createBooking(aRequest());
    const cancelled = manager.cancelBooking(booking.id);

    expect(cancelled.status).toBe('cancelled');
    expect(manager.getBooking(booking.id)?.status).toBe('cancelled');
  });

  it('frees the window for someone else', () => {
    const { manager } = newService();
    const booking = manager.createBooking(aRequest());
    manager.cancelBooking(booking.id);
    const replacement = manager.createBooking(aRequest({ organizer: 'bob@example.edu' }));

    expect(replacement.status).toBe('confirmed');
  });

  it('is a no-op the second time and fails on an unknown id', () => {
    const { manager } = newService();
    const booking = manager.createBooking(aRequest());
    manager.cancelBooking(booking.id);

    expect(manager.cancelBooking(booking.id).status).toBe('cancelled');
    expect(() => manager.cancelBooking('bk-999')).toThrow('unknown booking');
  });
});

describe('pricing', () => {
  it('charges the hourly rate for a plain booking', () => {
    const { manager } = newService();
    expect(manager.createBooking(aRequest()).priceCents).toBe(12000);
  });

  it('discounts bookings of three hours or more', () => {
    const { manager } = newService();
    expect(manager.createBooking(aRequest({ start: 540, end: 720 })).priceCents).toBe(16200);
  });

  it('adds the premium room surcharge', () => {
    const { manager } = newService();
    expect(manager.createBooking(aRequest({ roomId: PREMIUM_ROOM.id })).priceCents).toBe(18400);
  });

  it('discounts evening bookings', () => {
    const { manager } = newService();
    expect(manager.createBooking(aRequest({ start: 1020, end: 1140 })).priceCents).toBe(11400);
  });
});

describe('room schedules', () => {
  it('lists bookings for one room and summarizes them', () => {
    const { manager } = newService();
    manager.createBooking(aRequest());
    manager.createBooking(aRequest({ start: 1020, end: 1140 }));

    expect(manager.listBookingsForRoom('r1')).toHaveLength(2);
    expect(manager.listBookingsForRoom('r2')).toHaveLength(0);

    const summary = manager.formatDailySummary('r1');
    expect(summary).toContain('Wean 5207');
    expect(summary).toContain('Confirmed total: $234.00');
  });
});
