// EngagementSignal business logic
const EngagementSignal = require('../models/engagementSignal');
const AuditLog = require('../models/auditLog');

module.exports = {
  async createSignal(data, userId) {
    const signal = new EngagementSignal({
      ...data,
      created_by: userId,
      last_modified_by: userId,
      created_at: new Date(),
      updated_at: new Date()
    });
    await signal.save();
    await AuditLog.create({
      entity_type: 'EngagementSignal',
      entity_id: signal._id,
      action: 'Created',
      performed_by: userId,
      details: data
    });
    return signal;
  },

  async overrideSignal(signalId, data, userId) {
    const signal = await EngagementSignal.findByIdAndUpdate(
      signalId,
      {
        ...data,
        source: 'Clinician',
        override_reason: data.override_reason,
        last_modified_by: userId,
        updated_at: new Date()
      },
      { new: true }
    );
    await AuditLog.create({
      entity_type: 'EngagementSignal',
      entity_id: signal._id,
      action: 'Overridden',
      performed_by: userId,
      details: data
    });
    return signal;
  },

  async getPatientSignals(patientId) {
    return EngagementSignal.find({ patient: patientId });
  },

  async getSignalAudit(signalId) {
    return AuditLog.find({ entity_type: 'EngagementSignal', entity_id: signalId });
  }
};
