// EngagementEvent model
const mongoose = require('mongoose');

const EngagementEventSchema = new mongoose.Schema({
  // Connection is now handled in src/server.ts using env variable
  signal: { type: mongoose.Schema.Types.ObjectId, ref: 'EngagementSignal', required: true },
  event_type: { type: String, enum: ['MissedSession', 'LateLogin', 'MessageResponse'], required: true },
  event_time: { type: Date, required: true },
  event_value: { type: mongoose.Schema.Types.Mixed },
  notes: { type: String }
});

module.exports = mongoose.model('EngagementEvent', EngagementEventSchema);