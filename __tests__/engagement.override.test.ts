import { resolveFinalStatus } from '../src/engagement.override';
import { EngagementOverride } from '../src/engagement.types';

describe('resolveFinalStatus', () => {
  const now = new Date();

  it('returns autoStatus if no override', () => {
    expect(resolveFinalStatus('ENGAGED')).toBe('ENGAGED');
  });

  it('returns override status if active', () => {
    const override: EngagementOverride = {
      patientId: 'p1',
      status: 'HIGH_ENGAGEMENT',
      reason: 'Manual',
      clinicianId: 'c1',
      createdAt: now
    };
    expect(resolveFinalStatus('LOW_ENGAGEMENT', override, now)).toBe('HIGH_ENGAGEMENT');
  });

  it('returns autoStatus if override expired', () => {
    const override: EngagementOverride = {
      patientId: 'p1',
      status: 'HIGH_ENGAGEMENT',
      reason: 'Manual',
      clinicianId: 'c1',
      createdAt: now,
      expiresAt: new Date(now.getTime() - 1000)
    };
    expect(resolveFinalStatus('ENGAGED', override, now)).toBe('ENGAGED');
  });
});
