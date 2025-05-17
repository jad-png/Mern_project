const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    excercises: [{
        excerciseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Excercise',
            required: true,
        },
        order: {
            type: Number,
            required: true,
            min: 1,
        },
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

workoutSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Workout', workoutSchema);