const Workout = require('../models/Workout')
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')


// get all workouts
const getWorkouts = async (req, res) => {
    const user_id = req.user._id;
    const workouts = await Workout.find({ user_id }).sort({ createdAt: -1 })

    res.status(200).json(workouts)
}

// get a single workout
const getWorkout = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such workout' })
    }
    const workout = await Workout.findById(id)
    if (!workout) {
        return res.status(404).json({ error: 'No such workout' })
    }
    res.status(200).json(workout)
}

// create new workout
const createWorkout = async (req, res) => {
    const { title, reps, load } = req.body;

    let emptyFields = [];

    if (!title) {
        emptyFields.push('title')
    }
    if (!reps) {
        emptyFields.push('reps')
    }
    if (!load) {
        emptyFields.push('load')
    }
    if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all required fields!', emptyFields })
    }


    try {
        const user_id = req.user._id;
        const workout = new Workout({ title, reps, load, user_id })
        await workout.save()
        res.status(200).json(workout)
    } catch (e) {
        res.status(400).json({ error: e.message })
    }
}


// delete workout
const deleteWorkout = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such workout' })
    }
    await Workout.findByIdAndDelete(id)
        .then(data => res.json(data))
        .catch(e => res.json({ error: 'No such workout' }))
}


// update a workout
const updateWorkout = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such workout' })
    }
    const { title, reps, load } = req.body;
    let emptyFields = [];

    if (!title) {
        emptyFields.push('title')
    }
    if (!reps) {
        emptyFields.push('reps')
    }
    if (!load) {
        emptyFields.push('load')
    }
    if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all required fields!', emptyFields })
    }

    const workout = await Workout.findByIdAndUpdate(id, { ...req.body })
    if (!workout) {
        return res.status(404).json({ error: 'No such workout' })
    }
    await workout.save()
    res.status(200).json(workout)
}

module.exports = {
    createWorkout,
    getWorkouts,
    getWorkout,
    deleteWorkout,
    updateWorkout
}