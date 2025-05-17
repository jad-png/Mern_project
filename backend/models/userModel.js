const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Client', 'Coach'],
    required: true,
    default: 'Client',
  },
  isBanned: {
    type: Boolean,
    default: false,
  },
  favoritesWorkouts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workout"
  }],
  enrolledWorkouts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workout",
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  this.updatedAt = Date.now();
  next();
});


module.exports = mongoose.model('User', userSchema);