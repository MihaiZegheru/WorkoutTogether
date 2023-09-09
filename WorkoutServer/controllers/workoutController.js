const Group = require('../models/Group');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Workout = require('../models/Workout');
const Exercise = require('../models/Exercise');

module.exports.workout_completed_get = (req, res) => {
    let workoutId = req.params.workoutid;
    let groupId = req.params.id;

    const token = req.cookies.jwt;
    const decodedToken = jwt.decode(token);
    const userId = decodedToken.id;
    
    Workout.findById(workoutId)
    .then(async (result) => {
        const score = result.workoutpoints;
        Group.updateScore(userId, groupId, score);
        const group = await Group.findById(groupId);
        res.render('workoutCompleted', { workoutpoints: result.workoutpoints, group:group });
        
    })
    .catch((err) => {
        console.log(err);
    })
}


module.exports.workout_get = async (req, res) => {
    let workoutId = req.params.workoutid;
    let groupId = req.params.id;

    const group = await Group.findById(groupId);
    
    Workout.findById(workoutId)
    .then((result) => {
        console.log(workoutId);
        if (result.type == "timed") {
            res.render('workoutTimed', { workout: result, group: group }); 
        }
        else {
            res.render('workoutReps', { workout: result, group: group }); 
        }
        
    })
    .catch((err) => {
        console.log(err);
        res.status(404);
    })
}

module.exports.workout_post = (req, res) => {
    let { numberOfExercise } = req.body;
    let workoutId = req.params.workoutid;
    

    if (numberOfExercise === undefined) {
        numberOfExercise = -1;
    }

    numberOfExercise += 1;
    Workout.findById(workoutId)
    .then( async (result) => {
        exercises = [];
        exercisesValue = [];
        breaksValue = [];
        
        if (numberOfExercise === result.exercisesId.length) {

        }
        for (let index = numberOfExercise; index < result.exercisesId.length && index < numberOfExercise + 5; index++) {
            exercise = await Exercise.findById(result.exercisesId[index]);
            exercises.push(exercise);
            exercisesValue.push(result.exercisesValue[index]);
            
            if (index == result.exercisesId.length - 1) {
                break;
            } 

            if (result.breaksValue[index] == '') {
                breaksValue.push('0');
            }
            else {
                breaksValue.push(result.breaksValue[index]);
            } 
        }

        res.status(200).json({workoutType: result.type, exercises: exercises, exercisesValue: exercisesValue, breaksValue: breaksValue, numberOfExercise: numberOfExercise, numberOfExercises: result.exercisesId.length}); 
    })
    .catch((err) => {
        console.log(err);
        res.status(404);
    })

}

module.exports.workout_create_get = async (req, res) => {
    const groupId = req.params.id;
    const group = await Group.findById(groupId);

    Exercise.find()
        .then((result) => {
            res.render('createWorkout', { exercises: result, group: group}) // Also add the max number of exercises for the current membership
        })
        .catch((err) => {
            console.log(err);
        })

}

module.exports.workout_create_post = async (req, res) => {
    const { workoutname, type, exercisesId, exercisesValue, breaksValue } = req.body;

    const groupId = req.params.id;
    let workoutpoints = 0;

    for (let i = 0; i < exercisesId.length; i++) {
        const exercise = await Exercise.findById(exercisesId[i]);
        if (type === "reps") {
            workoutpoints += exercise.exercisepoints * exercisesValue[i];
        }
        else {
            workoutpoints += Math.ceil((exercise.exercisepoints * exercisesValue[i]) / 3);
        }
    }

    Workout.create({ type, workoutname, exercisesId, exercisesValue, breaksValue, workoutpoints})
        .then((workout) => {
            Group.addWorkout(workout._id, groupId)
                .then((group) => {
                    res.status(201).json({ group: groupId });
                })
                .catch((err) => {
                    console.log(err);
                });
        })
        .catch((err) => {
            console.log(err);

        })
}




