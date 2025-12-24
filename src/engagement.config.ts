export const ENGAGEMENT_CONFIG = {
  windowDays: 30,

  weights: {
    TASK_COMPLETION: 0.35,
    SESSION_PARTICIPATION: 0.25,
    BETWEEN_SESSION_ACTIVITY: 0.3, // Encourage proactive engagement
    ATTENDANCE: 0.1
  },

  thresholds: {
    NOT_ENOUGH_DATA_MIN_EVENTS: 3,
    LOW_ENGAGEMENT_MAX: 29, // Slightly harder to be classified as low
    ENGAGED_MAX: 59 // Easier to reach engaged/high
  },

  decayHalfLifeDays: 18 // positive actions last longer
};
