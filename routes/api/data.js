const express = require('express');

const Task = require('../../models/task.js');

const router = express.Router();

// POST to /addTask
router.post('/', (req, res) => {
  return res.send(JSON.stringify(req.data));
});

// POST to /addGoal
