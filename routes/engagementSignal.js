// EngagementSignal API routes
const express = require('express');
const router = express.Router();
const EngagementSignal = require('../models/engagementSignal');
const AuditLog = require('../models/auditLog');

// Create a new engagement signal
router.post('/', async (req, res) => {
  try {
    const signal = new EngagementSignal({
      ...req.body,
      created_by: req.user._id,
      last_modified_by: req.user._id,
      created_at: new Date(),
      updated_at: new Date()
    });
    await signal.save();
    await AuditLog.create({
      entity_type: 'EngagementSignal',
      entity_id: signal._id,
      action: 'Created',
      performed_by: req.user._id,
      details: req.body
    });
    res.status(201).json(signal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all signals for a patient
router.get('/patient/:patientId', async (req, res) => {
  try {
    const signals = await EngagementSignal.find({ patient: req.params.patientId });
    res.json(signals);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Clinician override
router.patch('/:id/override', async (req, res) => {
  try {
    const signal = await EngagementSignal.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        source: 'Clinician',
        override_reason: req.body.override_reason,
        last_modified_by: req.user._id,
        updated_at: new Date()
      },
      { new: true }
    );
    await AuditLog.create({
      entity_type: 'EngagementSignal',
      entity_id: signal._id,
      action: 'Overridden',
      performed_by: req.user._id,
      details: req.body
    });
    res.json(signal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Audit log for a signal
router.get('/:id/audit', async (req, res) => {
  try {
    const logs = await AuditLog.find({ entity_type: 'EngagementSignal', entity_id: req.params.id });
    res.json(logs);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
