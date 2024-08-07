// routes/areas.js
const express = require('express');
const router = express.Router();
const Area = require('../models/Area');
const Habit = require('../models/Habit');
const auth = require('../middleware/auth');

// GET all areas for a user
router.get('/', auth, async (req, res) => {
  try {
    const areas = await Area.find({ user: req.user.id }).populate('habits');
    res.json(areas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create a new area
router.post('/', auth, async (req, res) => {
  try {
    const newArea = new Area({
      name: req.body.name,
      user: req.user.id,
      habits: []
    });
    const area = await newArea.save();
    res.json(area);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH update an area
router.patch('/:id', auth, async (req, res) => {
  try {
    const area = await Area.findOne({ _id: req.params.id, user: req.user.id });
    if (!area) return res.status(404).json({ message: 'Area not found' });

    if (req.body.name) area.name = req.body.name;
    await area.save();
    res.json(area);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE an area
router.delete('/:id', auth, async (req, res) => {
  try {
    const area = await Area.findOne({ _id: req.params.id, user: req.user.id });
    if (!area) return res.status(404).json({ message: 'Area not found' });

    // Remove this area from all associated habits
    await Habit.updateMany(
      { areaId: req.params.id },
      { $unset: { areaId: "" } }
    );

    await Area.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ message: 'Area deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET habits for a specific area
router.get('/:id/habits', auth, async (req, res) => {
  try {
    const area = await Area.findOne({ _id: req.params.id, user: req.user.id });
    if (!area) return res.status(404).json({ message: 'Area not found' });

    const habits = await Habit.find({ areaId: req.params.id, user: req.user.id });
    res.json(habits);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;