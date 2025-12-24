
# Engagement Score API

## Overview
The Engagement Score API is a TypeScript/Node.js service for tracking, scoring, and auditing patient engagement signals. It provides endpoints for status, history, overrides, and audit logs, with JWT authentication and input validation.

## Features
- Patient engagement scoring based on configurable signals
- Override mechanism for clinician input
- Audit logging for all changes
- JWT-based authentication for all endpoints
- Input validation and error handling
- Comprehensive test coverage

## Quick Start
1. **Install dependencies**
	```bash
	npm install
	```
2. **Configure environment variables**
	- Copy `.env.example` to `.env` and set values as needed.
3. **Build the project**
	```bash
	npm run build
	```
4. **Start the server**
	```bash
	npm start
	```

## Environment Variables
- `PORT`: Port for the server (default: 3000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT authentication

## API Reference

### Authentication
All endpoints (except `/health` and `/login`) require a JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

Obtain a token via:
```
POST /login
Body: { "username": "your_user" }
```

### Endpoints

#### Health Check
- `GET /health` — Returns `{ status: "ok" }`.

#### Engagement Status
- `GET /engagement/:patientId/status?role=clinician|patient` — Returns current engagement status and override info for a patient.

#### Engagement History
- `GET /engagement/:patientId/history` — Returns historical engagement scores for a patient.

#### Recompute Engagement
- `POST /engagement/:patientId/recompute` — Forces recomputation of engagement score for a patient.

#### Apply Override
- `POST /engagement/:patientId/override` — Applies a clinician override to a patient’s engagement status.
  - Body: `{ "status": "ENGAGED", "reason": "Manual review" }`

#### Audit Log
- `GET /engagement/:patientId/audit` — Returns audit log entries for a patient.

## Testing
Run all tests:
```bash
npm test
```
Tests require valid JWT tokens for protected endpoints. See test files for usage.


## Data Storage
### What is stored in MongoDB?
- **Engagement Signals:** Each signal records patient engagement events, including patient reference, type, status, level, timestamps, and source.
- **Engagement Events:** Events linked to signals, with type, time, value, and notes.
- **Patient Records:** By default, a patient model is included, but for integration, see below.

Audit logs and overrides are currently stored in memory. Extend the models if you require persistent audit storage.

## Integration with External Patient Systems
To avoid data duplication and ensure consistency:

**Recommended Approach:**
- Use your existing patient database as the single source of truth.
- Reference patients in engagement-score by their unique IDs only.
- Remove or adapt the patient model in this API if you do not want to store patient data in MongoDB.
- When creating or querying engagement signals/events, fetch patient details from your main system via API or direct database connection.

**Alternative Approach:**
- Periodically sync patient data from your main system to MongoDB (not recommended unless necessary).
- Use scheduled jobs or webhooks to update MongoDB when patient data changes.

**Best Practice:**
Treat patients as external entities. Store only references (IDs) in engagement-score and fetch patient details from your main system as needed.

If you need code or architectural guidance for a specific integration, provide details about your main system’s tech stack and data access options.

## Deployment
- Recommended for Vercel, Heroku, or Docker
- Production build: `npm run build`
- Start: `npm start`
- Ensure environment variables are set securely

### Vercel Deployment Notes
- Set all required environment variables (MONGODB_URI, JWT_SECRET, PORT) in Vercel’s dashboard.
- If using MongoDB Atlas or another hosted database, ensure network access is allowed from Vercel.
- For most use cases, no additional steps are required. For advanced scaling or long-lived connections, consider Vercel Edge Functions or a dedicated backend.

## Support & Contribution
- Issues and feature requests: open a GitHub issue
- Contributions: fork, branch, and submit a pull request

## License
This project is licensed under ISC.
