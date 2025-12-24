export const ENGAGEMENT_CONFIG = {
  windowDays: 30,

  weights: {
    TASK_COMPLETION: 0.4,
    SESSION_PARTICIPATION: 0.3,
    BETWEEN_SESSION_ACTIVITY: 0.2,
    ATTENDANCE: 0.1
  },

  thresholds: {
    NOT_ENOUGH_DATA_MIN_EVENTS: 3,
    LOW_ENGAGEMENT_MAX: 34,
    ENGAGED_MAX: 64
  },

  decayHalfLifeDays: 14 // recent behavior matters more
};
