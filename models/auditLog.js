// AuditLog model
const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  entity_type: { type: String, enum: ['EngagementSignal', 'EngagementEvent'], required: true },
  entity_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  action: { type: String, enum: ['Created', 'Updated', 'Overridden', 'Deleted'], required: true },
  performed_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  performed_at: { type: Date, default: Date.now },
  details: { type: mongoose.Schema.Types.Mixed }
});

module.exports = mongoose.model('AuditLog', AuditLogSchema);