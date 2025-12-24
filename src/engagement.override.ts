import { EngagementOverride, EngagementStatus } from "./engagement.types";

export function resolveFinalStatus(
  autoStatus: EngagementStatus,
  override?: EngagementOverride,
  now: Date = new Date()
): EngagementStatus {
  if (!override) return autoStatus;
  if (override.expiresAt && override.expiresAt < now) {
    return autoStatus;
  }
  return override.status;
}
