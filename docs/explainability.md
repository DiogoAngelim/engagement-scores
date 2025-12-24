# Engagement Signal Explainability

## Score Calculation
- All engagement scores are computed using a weighted, decayed average of observable signals.
- The formula and weights are documented in engagement.config.ts and engagement.scorer.ts.
- Decay function is exponential, prioritizing recent behavior.

## Status Classification
- Status is derived from score using explicit thresholds (see engagement.status.ts).
- Four states: NOT_ENOUGH_DATA, LOW_ENGAGEMENT, ENGAGED, HIGH_ENGAGEMENT.
- No clinical inference; all signals are behavioral.

## Override Logic
- Clinician overrides always take precedence if active and not expired.
- All overrides are logged and auditable.

## Auditability
- Every score, status, and override change is logged with timestamp, user, and reason.
- Audit logs are accessible via API for authorized review.

## Frontend Guidance
- Always display: "Engagement Score is not a diagnosis."
- Show breakdown of signals and weights for transparency.
- Never expose override reasons or audit logs to patients.
