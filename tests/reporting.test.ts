import { describe, expect, it } from 'vitest';
import { ReportGenerator } from '../src/reportGenerator';
import { aRequest, newService } from './fixtures';

describe('availability queries', () => {
  it('returns every slot when the room is empty', () => {
    const { manager } = newService();
    expect(manager.findAvailableSlots('r1', 480, 720, 60)).toEqual([480, 540, 600, 660]);
  });

  it('drops the slots a booking covers and keeps the touching ones', () => {
    const { manager } = newService();
    manager.createBooking(aRequest());

    expect(manager.findAvailableSlots('r1', 480, 720, 60)).toEqual([480, 660]);
  });

  it('gives the slots back after a cancellation', () => {
    const { manager } = newService();
    const booking = manager.createBooking(aRequest());
    manager.cancelBooking(booking.id);

    expect(manager.findAvailableSlots('r1', 480, 720, 60)).toEqual([480, 540, 600, 660]);
  });
});

describe('reports', () => {
  it('totals revenue over the window', () => {
    const { manager, storage } = newService();
    const morning = manager.createBooking(aRequest());
    const evening = manager.createBooking(aRequest({ start: 1020, end: 1140 }));
    const report = new ReportGenerator(storage, manager.listRooms());

    const revenue = report.revenue(480, 1320);
    expect(revenue.bookingCount).toBe(2);
    expect(revenue.totalCents).toBe(morning.priceCents + evening.priceCents);
    expect(revenue.averageCents).toBe(11700);
    expect(revenue.byRoom).toEqual({ r1: 23400 });
  });

  it('leaves cancelled bookings out of revenue', () => {
    const { manager, storage } = newService();
    const morning = manager.createBooking(aRequest());
    manager.createBooking(aRequest({ start: 1020, end: 1140 }));
    manager.cancelBooking(morning.id);
    const report = new ReportGenerator(storage, manager.listRooms());

    expect(report.revenue(480, 1320).totalCents).toBe(11400);
  });

  it('reports occupancy for a room', () => {
    const { manager, storage } = newService();
    manager.createBooking(aRequest());
    manager.createBooking(aRequest({ start: 1020, end: 1140 }));
    const report = new ReportGenerator(storage, manager.listRooms());

    const occupancy = report.occupancy('r1', 480, 1320);
    expect(occupancy.roomName).toBe('Wean 5207');
    expect(occupancy.bookingCount).toBe(2);
    expect(occupancy.bookedMinutes).toBe(240);
    expect(occupancy.utilizationPercent).toBe(29);
  });

  it('clips bookings to the reporting window', () => {
    const { manager, storage } = newService();
    manager.createBooking(aRequest({ start: 540, end: 720 }));
    const report = new ReportGenerator(storage, manager.listRooms());

    expect(report.occupancy('r1', 600, 660).bookedMinutes).toBe(60);
    expect(report.occupancy('r1', 480, 540).bookingCount).toBe(0);
  });
});
