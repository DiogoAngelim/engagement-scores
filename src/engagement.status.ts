import { EngagementStatus } from "./engagement.types";
import { ENGAGEMENT_CONFIG } from "./engagement.config";

export function classifyStatus(score: number | null): EngagementStatus {
  if (score === null) return "NOT_ENOUGH_DATA";
  if (score <= ENGAGEMENT_CONFIG.thresholds.LOW_ENGAGEMENT_MAX) {
    return "LOW_ENGAGEMENT";
  }
  if (score <= ENGAGEMENT_CONFIG.thresholds.ENGAGED_MAX) {
    return "ENGAGED";
  }
  return "HIGH_ENGAGEMENT";
}
