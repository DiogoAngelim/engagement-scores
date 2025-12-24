import request from 'supertest';
import app from '../src/app';

describe('Engagement Signal Audit & Retention', () => {
  let token: string;
  beforeAll(async () => {
    // Get JWT token
    const res = await request(app)
      .post('/login')
      .send({ username: 'clinician1' });
    token = res.body.token;
  });

  it('should log all changes and support audit retrieval', async () => {
    const signalsStore = (app as any).signalsStore;
    signalsStore['patientY'] = [
      { patientId: 'patientY', type: 'SESSION_PARTICIPATION', value: 1, occurredAt: new Date() },
      { patientId: 'patientY', type: 'TASK_COMPLETION', value: 1, occurredAt: new Date() },
      { patientId: 'patientY', type: 'ATTENDANCE', value: 1, occurredAt: new Date() }
    ];

    await request(app)
      .post('/engagement/patientY/override')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'ENGAGED', reason: 'Manual review' });
    await request(app)
      .post('/engagement/patientY/recompute')
      .set('Authorization', `Bearer ${token}`);

    const auditRes = await request(app)
      .get('/engagement/patientY/audit')
      .set('Authorization', `Bearer ${token}`);
    expect(Array.isArray(auditRes.body)).toBe(true);
    expect(auditRes.body.length).toBeGreaterThanOrEqual(2);
    expect(auditRes.body.some((log: any) => log.action === 'Override Applied')).toBe(true);
    expect(auditRes.body.some((log: any) => log.action === 'Score Recomputed')).toBe(true);
  });

  // Data retention logic would be tested here if implemented
});
