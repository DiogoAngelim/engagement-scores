import request from 'supertest';
import app from '../src/app';

describe('Engagement Signal Integration', () => {
  let token: string;
  beforeAll(async () => {
    // Get JWT token
    const res = await request(app)
      .post('/login')
      .send({ username: 'clinician1' });
    token = res.body.token;
  });

  it('should create, override, recompute, and audit engagement', async () => {
    // Create signals for patientX
    const signalsStore = (app as any).signalsStore;
    signalsStore['patientX'] = [
      { patientId: 'patientX', type: 'SESSION_PARTICIPATION', value: 1, occurredAt: new Date() },
      { patientId: 'patientX', type: 'TASK_COMPLETION', value: 1, occurredAt: new Date() },
      { patientId: 'patientX', type: 'ATTENDANCE', value: 1, occurredAt: new Date() }
    ];

    // Apply override
    await request(app)
      .post('/engagement/patientX/override')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'ENGAGED', reason: 'Manual review' });

    // Recompute
    const recomputeRes = await request(app)
      .post('/engagement/patientX/recompute')
      .set('Authorization', `Bearer ${token}`);
    expect(recomputeRes.body.status).toMatch(/ENGAGED|LOW_ENGAGEMENT|HIGH_ENGAGEMENT/);
    expect(recomputeRes.body.score).toBeGreaterThanOrEqual(0);
    expect(recomputeRes.body.score).toBeLessThanOrEqual(100);

    // Audit
    const auditRes = await request(app)
      .get('/engagement/patientX/audit')
      .set('Authorization', `Bearer ${token}`);
    expect(Array.isArray(auditRes.body)).toBe(true);
    expect(auditRes.body.some((log: any) => log.action === 'Override Applied')).toBe(true);
    expect(auditRes.body.some((log: any) => log.action === 'Score Recomputed')).toBe(true);
  });
});
