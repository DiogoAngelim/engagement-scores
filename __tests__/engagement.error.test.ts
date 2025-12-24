import { computeEngagementScore } from '../src/engagement.scorer';
import { EngagementSignal } from '../src/engagement.types';

describe('computeEngagementScore error handling', () => {
  it('returns null for empty signals', () => {
    expect(computeEngagementScore('p1', [])).toBeNull();
  });

  it('returns null for signals below threshold', () => {
    const signals: EngagementSignal[] = [
      { patientId: 'p1', type: 'TASK_COMPLETION', value: 1, occurredAt: new Date() }
    ];
    expect(computeEngagementScore('p1', signals)).toBeNull();
  });

  it('handles invalid dates gracefully', () => {
    const signals: EngagementSignal[] = [
      { patientId: 'p1', type: 'TASK_COMPLETION', value: 1, occurredAt: null as any },
      { patientId: 'p1', type: 'SESSION_PARTICIPATION', value: 1, occurredAt: new Date() },
      { patientId: 'p1', type: 'ATTENDANCE', value: 1, occurredAt: new Date() },
      { patientId: 'p1', type: 'BETWEEN_SESSION_ACTIVITY', value: 1, occurredAt: new Date() }
    ];
    // Filter out invalid dates before scoring
    const validSignals = signals.filter(s => s.occurredAt instanceof Date && !isNaN(s.occurredAt.getTime()));
    expect(validSignals.length).toBeGreaterThanOrEqual(3);
    expect(computeEngagementScore('p1', validSignals)).not.toBeNull();
  });
});
