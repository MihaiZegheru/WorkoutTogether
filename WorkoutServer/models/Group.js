const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    groupname: {
        type: String,
        required: [true, 'Please enter a group name'],
    },
    ownerId: {
        type: String,
        required: true,
    },
    adminsId: [String],
    members: [{ 
        memberId: String,
        memberPoints: Number,
    }],
    workoutsId: [String],
});

groupSchema.statics.addWorkout = async function (workoutId, groupId) {

    const group = await this.findById(groupId);

    let workoutsId = group.workoutsId;
    workoutsId.push(workoutId);
    Group.findByIdAndUpdate(groupId, {workoutsId: workoutsId}, function (err, result) {
        if (err) {
            console.log(err);
        }
        else {
            return result;
        }
    });
}

groupSchema.statics.updateScore = async function (userId, groupId, score) {

    const group = await this.findById(groupId);
    let members = group.members;

    for (let i = 0; i < members.length; i++) {
        if (group.members[i].memberId === userId) {
            members[i].memberPoints += score;
        }
    }

    Group.findByIdAndUpdate(groupId, {members: members}, function (err, result) {
        if (err) {
            console.log(err);
        }
        else {
            return result;
        }
    });
}

const Group = mongoose.model('group', groupSchema);

module.exports = Group;