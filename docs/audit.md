# Engagement Signal Audit & Compliance

## Audit Logging
- All automatic and manual changes to engagement score and status are logged.
- Audit logs include: timestamp, user/system, action, before/after values, and reason (for overrides).
- Logs are stored in an append-only, immutable format.

## Data Retention & Deletion
- Retention period: 7 years (configurable per regulation).
- Secure deletion supported; all deletions are logged.
- Deleted data is unrecoverable and removed from backups per compliance.

## Separation of Concerns
- Engagement signals and scores are stored separately from clinical diagnoses.
- No inference or linkage between engagement and diagnosis data.

## Safe Defaults
- New or low-data patients default to "NOT_ENOUGH_DATA" status.
- Negative or stigmatizing labels are never used.
- Clinician review required for automated low-engagement status.

## Compliance Review
- Periodic audits and purges of data past retention limits.
- Notifications to compliance officers for all retention and deletion actions.
