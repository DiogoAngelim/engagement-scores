import { ENGAGEMENT_CONFIG } from '../src/engagement.config';

describe('ENGAGEMENT_CONFIG', () => {
  it('has valid weights', () => {
    expect(ENGAGEMENT_CONFIG.weights.TASK_COMPLETION).toBeGreaterThan(0);
    expect(ENGAGEMENT_CONFIG.weights.SESSION_PARTICIPATION).toBeGreaterThan(0);
    expect(ENGAGEMENT_CONFIG.weights.BETWEEN_SESSION_ACTIVITY).toBeGreaterThan(0);
    expect(ENGAGEMENT_CONFIG.weights.ATTENDANCE).toBeGreaterThan(0);
  });

  it('has valid thresholds', () => {
    expect(ENGAGEMENT_CONFIG.thresholds.NOT_ENOUGH_DATA_MIN_EVENTS).toBeGreaterThan(0);
    expect(ENGAGEMENT_CONFIG.thresholds.LOW_ENGAGEMENT_MAX).toBeLessThan(ENGAGEMENT_CONFIG.thresholds.ENGAGED_MAX);
  });

  it('has valid decayHalfLifeDays', () => {
    expect(ENGAGEMENT_CONFIG.decayHalfLifeDays).toBeGreaterThan(0);
  });
});
