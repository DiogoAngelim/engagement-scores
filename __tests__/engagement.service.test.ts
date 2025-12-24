import { computeEngagementSnapshot } from '../src/engagement.service';
import { EngagementSignal, EngagementOverride } from '../src/engagement.types';

const now = new Date();
const daysAgo = (n: number) => new Date(now.getTime() - n * 24 * 60 * 60 * 1000);

// 1. New patient with no data
test('New patient with no data', () => {
  const result = computeEngagementSnapshot('patient1', []);
  expect(result.score).toBeNull();
  expect(result.autoStatus).toBe('NOT_ENOUGH_DATA');
  expect(result.finalStatus).toBe('NOT_ENOUGH_DATA');
});

// 2. Patient improving after inactivity
test('Patient improving after inactivity', () => {
  const signals: EngagementSignal[] = [
    { patientId: 'patient2', type: 'SESSION_PARTICIPATION', value: 0.2, occurredAt: daysAgo(25) },
    { patientId: 'patient2', type: 'TASK_COMPLETION', value: 0.1, occurredAt: daysAgo(20) },
    { patientId: 'patient2', type: 'SESSION_PARTICIPATION', value: 0.9, occurredAt: daysAgo(2) },
    { patientId: 'patient2', type: 'TASK_COMPLETION', value: 1, occurredAt: daysAgo(1) }
  ];
  const result = computeEngagementSnapshot('patient2', signals);
  expect(result.score).not.toBeNull();
  expect(result.autoStatus).toMatch(/ENGAGED|HIGH_ENGAGEMENT/);
});

// 3. Sudden drop due to missed sessions
test('Sudden drop due to missed sessions', () => {
  const signals: EngagementSignal[] = [
    { patientId: 'patient3', type: 'SESSION_PARTICIPATION', value: 1, occurredAt: daysAgo(10) },
    { patientId: 'patient3', type: 'SESSION_PARTICIPATION', value: 0, occurredAt: daysAgo(1) },
    { patientId: 'patient3', type: 'ATTENDANCE', value: 0, occurredAt: daysAgo(1) }
  ];
  const result = computeEngagementSnapshot('patient3', signals);
  expect(result.score).not.toBeNull();
  expect(result.autoStatus).toMatch(/LOW_ENGAGEMENT|ENGAGED/);
});

// 4. Clinician override conflicts
test('Clinician override conflicts', () => {
  const signals: EngagementSignal[] = [
    { patientId: 'patient4', type: 'SESSION_PARTICIPATION', value: 0.1, occurredAt: daysAgo(2) },
    { patientId: 'patient4', type: 'TASK_COMPLETION', value: 0.2, occurredAt: daysAgo(1) },
    { patientId: 'patient4', type: 'ATTENDANCE', value: 0, occurredAt: daysAgo(1) }
  ];
  const override: EngagementOverride = {
    patientId: 'patient4',
    status: 'HIGH_ENGAGEMENT',
    reason: 'Manual review',
    clinicianId: 'clinician1',
    createdAt: now
  };
  const result = computeEngagementSnapshot('patient4', signals, override);
  expect(result.autoStatus).not.toBe(override.status);
  expect(result.finalStatus).toBe(override.status);
});

// 5. Inconsistent data ingestion
test('Inconsistent data ingestion', () => {
  const signals: EngagementSignal[] = [
    { patientId: 'patient5', type: 'SESSION_PARTICIPATION', value: 1, occurredAt: daysAgo(5) },
    { patientId: 'patient5', type: 'TASK_COMPLETION', value: 0.5, occurredAt: null as any },
    { patientId: 'patient5', type: 'ATTENDANCE', value: 1, occurredAt: daysAgo(3) },
    { patientId: 'patient5', type: 'BETWEEN_SESSION_ACTIVITY', value: 0.8, occurredAt: daysAgo(2) }
  ];
  const validSignals = signals.filter(s => s.occurredAt instanceof Date && !isNaN(s.occurredAt.getTime()));
  const result = computeEngagementSnapshot('patient5', validSignals);
  expect(validSignals.length).toBeGreaterThanOrEqual(3);
  expect(result.score).not.toBeNull();
});

// 6. Long-term decay behavior
test('Long-term decay behavior', () => {
  const signals: EngagementSignal[] = [
    { patientId: 'patient6', type: 'SESSION_PARTICIPATION', value: 1, occurredAt: daysAgo(60) },
    { patientId: 'patient6', type: 'TASK_COMPLETION', value: 1, occurredAt: daysAgo(45) },
    { patientId: 'patient6', type: 'SESSION_PARTICIPATION', value: 0.2, occurredAt: daysAgo(2) }
  ];
  const result = computeEngagementSnapshot('patient6', signals);
  expect(result.score).not.toBeNull();
  expect(result.autoStatus).toMatch(/LOW_ENGAGEMENT|ENGAGED/);
});
