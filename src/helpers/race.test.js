import { raceMiles, formatPace, formatDuration } from './race';

describe('raceMiles', () => {
  it('returns known distances by race type', () => {
    expect(raceMiles('marathon')).toBe(26.2);
    expect(raceMiles('half')).toBe(13.1);
    expect(raceMiles('tenk')).toBe(6.21);
    expect(raceMiles('fivek')).toBe(3.1);
  });

  it('parses numeric race types as miles', () => {
    expect(raceMiles('50')).toBe(50);
    expect(raceMiles('4.5')).toBe(4.5);
  });

  it('returns 0 for unknown types', () => {
    expect(raceMiles('relay')).toBe(0);
    expect(raceMiles(undefined)).toBe(0);
  });
});

describe('formatPace', () => {
  it('formats a marathon pace', () => {
    // 3:30:00 marathon -> ~8:01 per mile
    expect(formatPace(12600, 26.2)).toBe('8:01');
  });

  it('rolls seconds over into minutes when rounding', () => {
    expect(formatPace(3599, 6)).toBe('10:00');
  });

  it('returns null when data is missing', () => {
    expect(formatPace(0, 26.2)).toBeNull();
    expect(formatPace(12600, 0)).toBeNull();
  });
});

describe('formatDuration', () => {
  it('formats hours, minutes and seconds', () => {
    expect(formatDuration(12600)).toBe('3:30:00');
    expect(formatDuration(3661)).toBe('1:01:01');
  });

  it('omits hours for sub-hour durations', () => {
    expect(formatDuration(1800)).toBe('30:00');
  });

  it('returns null for empty durations', () => {
    expect(formatDuration(0)).toBeNull();
  });
});
