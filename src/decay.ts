export function timeDecayWeight(
  occurredAt: Date,
  reference: Date,
  halfLifeDays: number
): number {
  const ageMs = reference.getTime() - occurredAt.getTime();
  const ageDays = ageMs / (1000 * 60 * 60 * 24);
  // exponential decay
  return Math.pow(0.5, ageDays / halfLifeDays);
}
