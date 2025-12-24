# Engagement Signal API Documentation

## Score Configuration

Engagement score calculation can be configured in [src/engagement.config.ts](src/engagement.config.ts). The main options are:

- **weights**: Adjust the importance of each signal type (e.g., TASK_COMPLETION, SESSION_PARTICIPATION, etc.).
- **windowDays**: The time window (in days) over which engagement is measured.
- **thresholds**: Define the minimum number of events required and the score boundaries for each engagement status.
- **decayHalfLifeDays**: Controls how quickly older events lose influence (recent behavior matters more).

To change how scores are calculated, update these values in [src/engagement.config.ts](src/engagement.config.ts).

## Endpoints

### 1. Read Current Engagement Status
`GET /engagement/:patientId/status`
- Returns the current engagement status and score for a patient.

### 2. Read Score History
`GET /engagement/:patientId/history`
- Returns historical engagement scores and statuses for a patient.

### 3. Trigger Recomputation
`POST /engagement/:patientId/recompute`
- Triggers a recomputation of the engagement score for a patient.

### 4. Apply Clinician Override
`POST /engagement/:patientId/override`
- Applies a clinician override to the engagement status for a patient.

### 5. Audit All Changes
`GET /engagement/:patientId/audit`
- Returns audit logs for engagement status and score changes.

## Request/Response Schemas
- See engagement.types.ts for core types.

## Auth & Role Constraints
- Clinicians: Full access to all endpoints for their patients.
- Patients: Can only read their own status and history.
- All endpoints require authentication.

## Rate-Limiting & Abuse Prevention
- Recomputation and override endpoints are rate-limited (e.g., max 5/hour per patient).
- All changes are logged and auditable.
- Returns 429 Too Many Requests if rate limit exceeded.

## Safe Response Patterns
- Engagement status and score are behavioral, not diagnostic.
- Fields like overrideReason, warnings, metadataFlags, auditLog, and clinicianNotes are never exposed to patients.
- Suggested frontend copy: "Engagement Score reflects recent behavioral activity, not clinical status or diagnosis."
- Metadata flags for clinicians: ["NOT_DIAGNOSTIC", "BEHAVIORAL_ONLY"]
- Warnings for clinicians: ["Engagement Score is not a clinical label.", "Do not infer diagnosis or prognosis from engagement data."]

## Edge Cases & Failure Scenarios
- See __tests__/engagement.service.test.ts for test coverage.
