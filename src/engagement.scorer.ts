import { EngagementSignal } from "./engagement.types";
import { ENGAGEMENT_CONFIG } from "./engagement.config";
import { timeDecayWeight } from "./decay";

export function computeEngagementScore(
  patientId: string,
  signals: EngagementSignal[],
  now: Date = new Date()
): number | null {
  if (signals.length < ENGAGEMENT_CONFIG.thresholds.NOT_ENOUGH_DATA_MIN_EVENTS) {
    return null;
  }

  let weightedSum = 0;
  let totalWeight = 0;

  for (const signal of signals) {
    const baseWeight = ENGAGEMENT_CONFIG.weights[signal.type];
    const decay = timeDecayWeight(
      signal.occurredAt,
      now,
      ENGAGEMENT_CONFIG.decayHalfLifeDays
    );
    const effectiveWeight = baseWeight * decay;
    weightedSum += signal.value * effectiveWeight;
    totalWeight += effectiveWeight;
  }

  if (totalWeight === 0) return null;

  return Math.round((weightedSum / totalWeight) * 100);
}
