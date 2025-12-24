import { timeDecayWeight } from '../src/decay';

describe('timeDecayWeight', () => {
  it('returns 1 for zero age', () => {
    const now = new Date();
    expect(timeDecayWeight(now, now, 14)).toBeCloseTo(1);
  });

  it('returns 0.5 for half-life', () => {
    const now = new Date();
    const past = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    expect(timeDecayWeight(past, now, 14)).toBeCloseTo(0.5);
  });

  it('returns near zero for very old event', () => {
    const now = new Date();
    const past = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    expect(timeDecayWeight(past, now, 14)).toBeLessThan(0.01);
  });
});
