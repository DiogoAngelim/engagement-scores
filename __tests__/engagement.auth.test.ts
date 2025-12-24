import request from 'supertest';
import app from '../src/app';

describe('Engagement Signal API Auth', () => {
  let token: string;
  beforeAll(async () => {
    // Get JWT token
    const res = await request(app)
      .post('/login')
      .send({ username: 'clinician1' });
    token = res.body.token;
    // Ensure override is set for patient2
    await request(app)
      .post('/engagement/patient2/override')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'ENGAGED', reason: 'Manual review' });
  });

  it('should not expose override reason to patient', async () => {
    // Simulate patient request
    const res = await request(app)
      .get('/engagement/patient2/status?role=patient')
      .set('Authorization', `Bearer ${token}`);
    expect(res.body.override.reason).toBeUndefined();
  });

  it('should expose override reason to clinician', async () => {
    const res = await request(app)
      .get('/engagement/patient2/status?role=clinician')
      .set('Authorization', `Bearer ${token}`);
    expect(res.body.override.reason).toBeDefined();
  });
});
