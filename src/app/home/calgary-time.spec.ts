import { formatCalgaryTime } from './calgary-time';

describe('Calgary time', () => {
  const cases = [
    ['2026-01-15T20:30:05Z', '1:30:05 PM MST'],
    ['2026-07-15T20:30:05Z', '2:30:05 PM MDT'],
    ['2026-11-01T07:59:59Z', '1:59:59 AM MDT'],
    ['2026-11-01T08:00:00Z', '2:00:00 AM ABT'],
    ['2026-11-11T20:30:05Z', '2:30:05 PM ABT'],
    ['2027-01-15T20:30:05Z', '2:30:05 PM ABT'],
    ['2027-07-15T20:30:05Z', '2:30:05 PM ABT'],
    ['2027-11-07T08:00:00Z', '2:00:00 AM ABT'],
    ['2026-11-12T05:59:59Z', '11:59:59 PM ABT'],
    ['2026-11-12T06:00:00Z', '12:00:00 AM ABT']
  ];

  for (const [instant, expected] of cases) {
    it(`formats ${instant} as ${expected}`, () => {
      expect(formatCalgaryTime(new Date(instant))).toBe(expected);
    });
  }
});
