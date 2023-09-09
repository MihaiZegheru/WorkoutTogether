const mongoose = require('mongoose');


const exerciseSchema = new mongoose.Schema({
    exercisename: {
        type: String,
        required: true,
    },
    exercisepoints: {
        type: Number,
        required: true,
    }
});

const Exercise = mongoose.model('exercise', exerciseSchema);

module.exports = Exercise;