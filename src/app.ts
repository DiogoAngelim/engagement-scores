import express from 'express';
import bodyParser from 'body-parser';
import { computeEngagementSnapshot } from './engagement.service';
import { EngagementSignal, EngagementOverride, EngagementStatus } from './engagement.types';
import jwt from 'jsonwebtoken';

const app = express();
app.use(bodyParser.json());

// JWT secret from environment

// JWT authentication middleware
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Protect all endpoints except health and login
app.use((req: any, res: any, next: any) => {
  if (req.path === '/health' || req.path === '/login') return next();
  authenticateToken(req, res, next);
});

// Health check endpoint
app.get('/health', (req: any, res: any) => {
  res.json({ status: 'ok' });
});

// Simple login endpoint for demo (replace with real user validation)
app.post('/login', (req: any, res: any) => {
  const { username } = req.body;
  // In production, validate user credentials here
  const user = { username };
  const token = jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

// In-memory store for demo
const signalsStore: Record<string, EngagementSignal[]> = {};
const overrideStore: Record<string, EngagementOverride | undefined> = {};
const auditLog: Array<{ action: string; by: string; timestamp: Date; details: any }> = [];

(app as { signalsStore?: Record<string, EngagementSignal[]> }).signalsStore = signalsStore;

app.get('/engagement/:patientId/status', (req, res) => {
  const { patientId } = req.params;
  const role = req.query.role || 'clinician'; // Simulate role via query param
  if (!patientId || typeof patientId !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing patientId' });
  }
  try {
    const signals = signalsStore[patientId] || [];
    const override = overrideStore[patientId];
    const snapshot = computeEngagementSnapshot(patientId, signals, override);
    let overrideObj: {
      active: boolean;
      status?: string;
      setBy?: string;
      timestamp?: Date;
      reason?: string | undefined;
    };
    if (override) {
      overrideObj = {
        active: true,
        status: override.status,
        setBy: override.clinicianId,
        timestamp: override.createdAt,
        reason: role === 'clinician' ? override.reason : undefined
      };
    } else {
      overrideObj = { active: false };
    }
    res.json({
      patientId,
      status: snapshot.finalStatus,
      score: snapshot.score?.score ?? null,
      lastUpdated: snapshot.score?.computedAt ?? null,
      override: overrideObj
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/engagement/:patientId/history', (req, res) => {
  // For demo, just return current score
  const { patientId } = req.params;
  if (!patientId || typeof patientId !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing patientId' });
  }
  try {
    const signals = signalsStore[patientId] || [];
    const override = overrideStore[patientId];
    const snapshot = computeEngagementSnapshot(patientId, signals, override);
    res.json([
      {
        date: snapshot.score?.computedAt ?? null,
        score: snapshot.score?.score ?? null,
        status: snapshot.finalStatus
      }
    ]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/engagement/:patientId/recompute', (req, res) => {
  const { patientId } = req.params;
  if (!patientId || typeof patientId !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing patientId' });
  }
  try {
    const signals = signalsStore[patientId] || [];
    const override = overrideStore[patientId];
    const snapshot = computeEngagementSnapshot(patientId, signals, override);
    auditLog.push({
      action: 'Score Recomputed',
      by: 'system',
      timestamp: new Date(),
      details: { score: snapshot.score?.score, status: snapshot.finalStatus }
    });
    res.json({
      patientId,
      score: snapshot.score?.score ?? null,
      status: snapshot.finalStatus,
      recomputedAt: new Date()
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/engagement/:patientId/override', (req, res) => {
  const { patientId } = req.params;
  const { status, reason } = req.body;
  if (!status || typeof status !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing status' });
  }
  if (reason && typeof reason !== 'string') {
    return res.status(400).json({ error: 'Invalid reason' });
  }
  try {
    const override: EngagementOverride = {
      patientId,
      status: status as EngagementStatus,
      reason,
      clinicianId: (req as any).user?.username || 'clinician456',
      createdAt: new Date()
    };
    overrideStore[patientId] = override;
    auditLog.push({
      action: 'Override Applied',
      by: override.clinicianId,
      timestamp: new Date(),
      details: { status, reason }
    });
    res.json({
      patientId,
      override: {
        active: true,
        status,
        reason,
        setBy: override.clinicianId,
        timestamp: override.createdAt
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/engagement/:patientId/audit', (req, res) => {
  try {
    res.json(auditLog);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default app;
