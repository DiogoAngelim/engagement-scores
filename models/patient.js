// Patient model
const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  // Connection is now handled in src/server.ts using env variable
  // ...existing patient fields...
});

module.exports = mongoose.model('Patient', PatientSchema);