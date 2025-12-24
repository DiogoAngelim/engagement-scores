// EngagementSignal model
const mongoose = require('mongoose');

const EngagementSignalSchema = new mongoose.Schema({
  // Connection is now handled in src/server.ts using env variable
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  status: { type: String, enum: ['Active', 'Inactive', 'Paused'], required: true },
  level: { type: String, enum: ['High', 'Medium', 'Low', 'At Risk'], required: true },
  start_time: { type: Date, required: true },
  end_time: { type: Date },
  source: { type: String, enum: ['System', 'Clinician'], required: true },
  override_reason: { type: String },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  last_modified_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EngagementSignal', EngagementSignalSchema);