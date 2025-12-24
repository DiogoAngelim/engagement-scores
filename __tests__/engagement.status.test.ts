import { classifyStatus } from '../src/engagement.status';
import { ENGAGEMENT_CONFIG } from '../src/engagement.config';

describe('classifyStatus', () => {
  it('returns NOT_ENOUGH_DATA for null', () => {
    expect(classifyStatus(null)).toBe('NOT_ENOUGH_DATA');
  });

  it('returns LOW_ENGAGEMENT for low score', () => {
    expect(classifyStatus(ENGAGEMENT_CONFIG.thresholds.LOW_ENGAGEMENT_MAX)).toBe('LOW_ENGAGEMENT');
    expect(classifyStatus(0)).toBe('LOW_ENGAGEMENT');
  });

  it('returns ENGAGED for mid score', () => {
    expect(classifyStatus(ENGAGEMENT_CONFIG.thresholds.LOW_ENGAGEMENT_MAX + 1)).toBe('ENGAGED');
    expect(classifyStatus(ENGAGEMENT_CONFIG.thresholds.ENGAGED_MAX)).toBe('ENGAGED');
  });

  it('returns HIGH_ENGAGEMENT for high score', () => {
    expect(classifyStatus(ENGAGEMENT_CONFIG.thresholds.ENGAGED_MAX + 1)).toBe('HIGH_ENGAGEMENT');
    expect(classifyStatus(100)).toBe('HIGH_ENGAGEMENT');
  });
});
