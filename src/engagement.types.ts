export type EngagementSignalType =
  | "TASK_COMPLETION"
  | "SESSION_PARTICIPATION"
  | "BETWEEN_SESSION_ACTIVITY"
  | "ATTENDANCE";

export interface EngagementSignal {
  patientId: string;
  type: EngagementSignalType;
  value: number; // normalized 0..1
  occurredAt: Date;
}

export type EngagementStatus =
  | "NOT_ENOUGH_DATA"
  | "LOW_ENGAGEMENT"
  | "ENGAGED"
  | "HIGH_ENGAGEMENT";

export interface EngagementScore {
  patientId: string;
  score: number; // 0..100
  computedAt: Date;
  windowStart: Date;
  windowEnd: Date;
}

export interface EngagementOverride {
  patientId: string;
  status: EngagementStatus;
  reason: string;
  clinicianId: string;
  createdAt: Date;
  expiresAt?: Date;
}
