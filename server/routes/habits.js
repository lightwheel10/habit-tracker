const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Habit = require('../models/Habit');
const Area = require('../models/Area');
const auth = require('../middleware/auth');

// GET: Retrieve all habits for a user
router.get('/', auth, async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user.id });
    res.json(habits);
  } catch (err) {
    console.error('Error fetching habits:', err);
    res.status(500).json({ message: 'Error fetching habits', error: err.message });
  }
});

// POST: Create a new habit
router.post('/', auth, async (req, res) => {
  console.log('Request body:', req.body);
  console.log('User ID:', req.user.id);

  try {
    // Verify that the areaId is a valid ObjectId if it's provided
    if (req.body.areaId && !mongoose.Types.ObjectId.isValid(req.body.areaId)) {
      return res.status(400).json({ message: 'Invalid area ID' });
    }

     // Validate new fields
     if (!req.body.goal || !req.body.repeatPattern || !req.body.completionTarget || !req.body.timeOfDay) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const habit = new Habit({
      ...req.body,
      user: req.user.id,
      areaId: req.body.areaId || null
    });
    
    const newHabit = await habit.save();
    
    // Update the associated area
    if (newHabit.areaId) {
      await Area.findByIdAndUpdate(
        newHabit.areaId,
        { $addToSet: { habits: newHabit._id } },
        { new: true }
      );
    }

    console.log('Saved habit:', newHabit);
    res.status(201).json(newHabit);
  } catch (err) {
    console.error('Error creating habit:', err.message);
    res.status(400).json({ message: 'Error creating habit', error: err.message });
  }
});

// GET: Retrieve a specific habit by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user.id });
    if (!habit) return res.status(404).json({ message: 'Habit not found' });
    res.json(habit);
  } catch (err) {
    console.error('Error fetching habit:', err);
    res.status(500).json({ message: 'Error fetching habit', error: err.message });
  }
});

// PATCH: Update specific habit details
router.patch('/:id', auth, async (req, res) => {
  try {
    console.log('Received update request for habit:', req.params.id);
    console.log('Update data:', JSON.stringify(req.body, null, 2));
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user.id });
    if (!habit) return res.status(404).json({ message: 'Habit not found' });

    const oldAreaId = habit.areaId;

    console.log('Updating habit:', habit);
    console.log('Update data:', req.body);

    // Handle areaId separately
    if ('areaId' in req.body) {
      if (req.body.areadId === false || req.body.areaId === "" || req.body.areaId === null) {
        habit.areaId = null;
      } else if (mongoose.Types.ObjectId.isValid(req.body.areaId)) {
        habit.areaId = req.body.areaId;
      } else if (req.body.null && mongoose.Types.ObjectId.isValid(req.body.null)) {
        habit.areaId = req.body.null;
      } else {
        return res.status(400).json({ message: 'Invalid area ID' });
      }
    }

    // Update other fields
    Object.keys(req.body).forEach(key => {
      if (key !== 'areaId' && key != 'null' && req.body[key] !== undefined) {
        habit[key] = req.body[key];
      }
    });

    console.log('Updated habit before save:', habit);

    const updatedHabit = await habit.save();

    console.log('Updated habit after save:', updatedHabit);

    // Update area associations if areaId has changed
    if (oldAreaId !== updatedHabit.areaId) {
      if (oldAreaId) {
        await Area.findByIdAndUpdate(oldAreaId, { $pull: { habits: updatedHabit._id } });
      }
      if (updatedHabit.areaId) {
        await Area.findByIdAndUpdate(updatedHabit.areaId, { $addToSet: { habits: updatedHabit._id } });
      }
    }

    res.json(updatedHabit);
  } catch (err) {
    console.error('Error updating habit:', err);
    res.status(400).json({ message: 'Error updating habit', error: err.message });
  }
});

// PATCH: Log habit activity
router.patch('/:id/log', auth, async (req, res) => {
  console.log('Received PATCH request for habit log');
  console.log('Habit ID:', req.params.id);
  console.log('Request body:', req.body);

  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user.id });
    if (!habit) {
      console.log('Habit not found');
      return res.status(404).json({ message: 'Habit not found' });
    }

    console.log('Found habit:', habit);

    const { date, completed, skipped } = req.body;

    // Create a new log entry
    const newLogEntry = {
      date: new Date(date),
      completed,
      skipped
    };

    console.log('New log entry:', newLogEntry);

    // Add the new log entry to the habit's log array
    habit.log.push(newLogEntry);

    const updatedHabit = await habit.save();
    console.log('Updated habit:', updatedHabit);

    res.json(updatedHabit);
  } catch (err) {
    console.error('Error updating habit log:', err);
    res.status(400).json({ message: 'Error updating habit log', error: err.message });
  }
});

// DELETE: Remove a habit
router.delete('/:id', auth, async (req, res) => {
  try {
    console.log('Received delete request for habit:', req.params.id);

    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
      return res.status(400).json({message: 'Invalid habit ID'});
    }
    
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user.id });
    if (!habit) return res.status(404).json({ message: 'Habit not found' });

    // Remove the habit from its associated area
    if (habit.areaId) {
      await Area.findByIdAndUpdate(habit.areaId, { $pull: { habits: habit._id } });
    }

    await habit.remove();
    res.json({ message: 'Habit deleted' });
  } catch (err) {
    console.error('Error deleting habit:', err);
    res.status(500).json({ message: 'Error deleting habit', error: err.message });
  }
});

module.exports = router;