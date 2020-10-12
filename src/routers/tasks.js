const express = require('express');
const router = new express.Router();
const Task = require('../models/task');
const auth = require('../middleware/auth');


// CREATE
router.post('/tasks', auth, async (req, res) => {
    try {
        const task = new Task({
            ...req.body,
            owner: req.user._id
        })

        await task.save()
        res.status(201).send(task)
    } catch {
        res.status(500).send(err.message);
    }
})


// GET ALL 
router.get('/tasks', auth, async (req, res) => {
    try {
        // const tasks = await Task.find({ owner: req.user._id })
        await req.user.populate('tasks').execPopulate()
        res.send(req.user.tasks)
    } catch {
        res.status(500).send();
    }
})

// GET A TASK BY ITS ID
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findOne({ _id, owner: req.user._id });
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (err) {
        res.status(500).send(err.message);
    }


})

// PATCH
router.patch('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    const updates = Object.keys(req.body);

    const allowedUpdates = ['name', 'completed'];
    const isvalidUpdates = updates.every(update => allowedUpdates.includes(update))

    if (!isvalidUpdates) {
        return res.status('400').send('Invalid Update Fields')
    }

    try {
        // Method #1 Problem: middleware wont run
        // const task = await Task.findByIdAndUpdate(_id, req.body,{ new: true, runValidators: true } )

        // Method #2
        // Executes middleware attatched to save

        const task = await Task.findOne({ _id, owner: req.user._id });
        if (!task) {
            return res.status(404).send('TASK NOT FOUND')
        }
        updates.forEach(update => task[update] = req.body[update])

        await task.save()
        res.send(task);
    } catch (err) {
        res.status(500).send(err.message)
    }
})

// DELETE
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
        if (!task) {
            return res.status(404).send('Task not found')
        }
        res.send(task);
    } catch (err) {
        res.status(500).send(err)
    }
})

module.exports = router;