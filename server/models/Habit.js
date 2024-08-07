const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema({
  name: { type: String, required: true },
  emoji: String,
  goal: {
    value: { type: Number, required: true },
    unit: { type: String, enum: ['times', 'minutes', 'hours'], required: true },
    timeframe: { type: String, enum: ['total', 'per day', 'per week', 'per month'], required: true }
  },
  repeatPattern: {
    type: { type: String, enum: ['daily', 'weekly', 'monthly', 'yearly'], required: true },
    daysOfWeek: [{ type: Number, min: 0, max: 6 }], // 0 for Sunday, 6 for Saturday
    dayOfMonth: { type: Number, min: 1, max: 31 },
    monthOfYear: { type: Number, min: 1, max: 12 }
  },
  completionTarget: {
    type: { type: String, enum: ['every time', 'times per timeframe', 'days per timeframe'], required: true },
    value: { type: Number, min: 1 },
    timeframe: { type: String, enum: ['day', 'week', 'month'] }
  },
  timeOfDay: [{
    type: String,
    enum: ['any time', 'morning', 'afternoon', 'evening', 'specific time']
  }],
  specificTime: Date, // Only used if 'specific time' is selected in timeOfDay
  startDate: { type: Date, required: true },
  endDate: Date,
  areaId: { type: String, required: true },
  log: [{
    date: { type: Date, required: true },
    completed: { type: Boolean, default: false },
    skipped: { type: Boolean, default: false },
    value: { type: Number, default: 0 } // For tracking progress in minutes/hours if applicable
  }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Habit', HabitSchema);