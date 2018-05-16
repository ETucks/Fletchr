const mongoose = require('mongoose');

const Task = new mongoose.Schema({
  name: String,
  details: String,
  goal_associations: String,
  due_date: Date,
  creationdate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Task', Task);
