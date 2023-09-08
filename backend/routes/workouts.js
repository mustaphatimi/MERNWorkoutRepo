const express = require('express');
const { createWorkout,
    getWorkout,
    getWorkouts,
    deleteWorkout,
    updateWorkout
} = require('../controllers/workout')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router();

router.use(requireAuth)

router.get('/', getWorkouts)

router.post('/', createWorkout)

router.get('/:id', getWorkout)

router.delete('/:id', deleteWorkout)

router.patch('/:id', updateWorkout)


module.exports = router;