import { describe, it, expect } from 'vitest';
import { getDaysColor, getDaysLabel } from '../constants';

describe('getDaysLabel', () => {
  it('daysLeft가 1이면 "오늘 만료" 반환', () => {
    expect(getDaysLabel(1)).toBe('오늘 만료');
  });

  it('daysLeft가 0 이하면 "오늘 만료" 반환', () => {
    expect(getDaysLabel(0)).toBe('오늘 만료');
    expect(getDaysLabel(-1)).toBe('오늘 만료');
  });

  it('daysLeft가 2 이상이면 D-N 형식 반환', () => {
    expect(getDaysLabel(2)).toBe('D-2');
    expect(getDaysLabel(7)).toBe('D-7');
    expect(getDaysLabel(30)).toBe('D-30');
  });
});

describe('getDaysColor', () => {
  it('daysLeft가 1 이하면 danger 색상 반환', () => {
    const result = getDaysColor(1);
    expect(result.bgClass).toContain('danger');
    expect(result.textClass).toContain('danger');
  });

  it('daysLeft가 0이면 danger 색상 반환', () => {
    const result = getDaysColor(0);
    expect(result.bgClass).toContain('danger');
  });

  it('daysLeft가 2~3이면 accent 색상 반환', () => {
    expect(getDaysColor(2).bgClass).toContain('accent');
    expect(getDaysColor(3).bgClass).toContain('accent');
  });

  it('daysLeft가 4 이상이면 primary 색상 반환', () => {
    expect(getDaysColor(4).bgClass).toContain('primary');
    expect(getDaysColor(10).bgClass).toContain('primary');
  });
});
