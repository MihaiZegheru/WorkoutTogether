const mongoose = require('mongoose');
const Exercise = require('./Exercise');


const workoutSchema = new mongoose.Schema({
    type: {
        type: String,
        required: [true, 'Please enter a type'],
    },
    exercisesId: [String],
    exercisesValue: [],
    breaksValue: [],
    restsValue: [],
    workoutname: {
        type: String,
    },
    workoutpoints: {
        type: Number,
        required: true,
    }
});

const Workout = mongoose.model('workout', workoutSchema);

module.exports = Workout;