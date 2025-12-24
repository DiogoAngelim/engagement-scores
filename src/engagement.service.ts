import {
  EngagementSignal,
  EngagementScore,
  EngagementStatus,
  EngagementOverride
} from "./engagement.types";
import { computeEngagementScore } from "./engagement.scorer";
import { classifyStatus } from "./engagement.status";
import { resolveFinalStatus } from "./engagement.override";

export function computeEngagementSnapshot(
  patientId: string,
  signals: EngagementSignal[],
  override?: EngagementOverride
): {
  score: EngagementScore | null;
  autoStatus: EngagementStatus;
  finalStatus: EngagementStatus;
} {
  const now = new Date();
  const scoreValue = computeEngagementScore(patientId, signals, now);
  const autoStatus = classifyStatus(scoreValue);
  const finalStatus = resolveFinalStatus(autoStatus, override, now);
  return {
    score: scoreValue === null
      ? null
      : {
        patientId,
        score: scoreValue,
        computedAt: now,
        windowStart: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        windowEnd: now
      },
    autoStatus,
    finalStatus
  };
}
