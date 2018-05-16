const mongoose = require('mongoose');

const Goal = new mongoose.Schema({
  name: String,
  details: String,
  connections: String,
  creationdate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Goal', Goal);
