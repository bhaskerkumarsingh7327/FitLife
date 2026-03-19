const express = require('express');
const router = express.Router();
const { getWorkoutPlan, updateProgress, resetProgress } = require('../controllers/workoutcontroller');

router.get('/:userId', getWorkoutPlan);
router.put('/:userId/progress', updateProgress);
router.put('/:userId/reset', resetProgress);

module.exports = router;
