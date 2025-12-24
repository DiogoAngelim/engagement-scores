
import request from 'supertest';
import app from '../src/app';

// Expose signalsStore for test seeding
const signalsStore = (app as any).signalsStore;
if (signalsStore) {
  signalsStore['patient2'] = [
    { patientId: 'patient2', type: 'SESSION_PARTICIPATION', value: 1, occurredAt: new Date() },
    { patientId: 'patient2', type: 'TASK_COMPLETION', value: 1, occurredAt: new Date() },
    { patientId: 'patient2', type: 'ATTENDANCE', value: 1, occurredAt: new Date() }
  ];
  signalsStore['patient3'] = [
    { patientId: 'patient3', type: 'SESSION_PARTICIPATION', value: 0.5, occurredAt: new Date() },
    { patientId: 'patient3', type: 'TASK_COMPLETION', value: 0.5, occurredAt: new Date() },
    { patientId: 'patient3', type: 'ATTENDANCE', value: 0.5, occurredAt: new Date() }
  ];
}

describe('Engagement Signal API', () => {
  let token: string;
  beforeAll(async () => {
    // Get JWT token
    const res = await request(app)
      .post('/login')
      .send({ username: 'clinician1' });
    token = res.body.token;
  });

  it('should return NOT_ENOUGH_DATA for new patient', async () => {
    const res = await request(app)
      .get('/engagement/patient1/status')
      .set('Authorization', `Bearer ${token}`);
    expect(res.body.status).toBe('NOT_ENOUGH_DATA');
  });

  it('should apply clinician override and persist', async () => {
    await request(app)
      .post('/engagement/patient2/override')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'ENGAGED', reason: 'Manual review' });
    const res = await request(app)
      .get('/engagement/patient2/status')
      .set('Authorization', `Bearer ${token}`);
    expect(res.body.override.active).toBe(true);
    expect(res.body.override.status).toBe('ENGAGED');
  });

  it('should trigger recomputation and update score', async () => {
    const res = await request(app)
      .post('/engagement/patient3/recompute')
      .set('Authorization', `Bearer ${token}`);
    expect(res.body.status).toMatch(/ENGAGED|LOW_ENGAGEMENT|HIGH_ENGAGEMENT/);
    expect(res.body.score).toBeGreaterThanOrEqual(0);
    expect(res.body.score).toBeLessThanOrEqual(100);
  });

  it('should log all changes in audit endpoint', async () => {
    const res = await request(app)
      .get('/engagement/patient3/audit')
      .set('Authorization', `Bearer ${token}`);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('action');
    expect(res.body[0]).toHaveProperty('timestamp');
  });
});
