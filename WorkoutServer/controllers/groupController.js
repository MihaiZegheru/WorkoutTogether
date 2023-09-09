const Group = require('../models/Group');
const Workout = require('../models/Workout');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports.group_get = (req, res) => {
    const token = req.cookies.jwt;
    const decodedToken = jwt.decode(token);

    console.log(decodedToken);
    User.findById(decodedToken.id)
        .then( async (user) => {
            let groups = [];

            for (const groupId of user.groupsId) {
                let group = await Group.findById(groupId);
                groups.push(group);
            }
            res.render('group', {groups});
        })
        .catch((err) => {
            console.log(err);
        });
}


module.exports.group_create_get = (req, res) => {
    User.find().sort()
        .then((result) => {
            res.render('createGroup', { friends: result }) 
        })
        .catch((err) => {
            console.log(err);
        })
}

module.exports.group_create_post = (req, res) => {
    const { groupname, membersId } = req.body;

    const token = req.cookies.jwt;
    const decodedToken = jwt.decode(token);
    const ownerId = decodedToken.id;


    if (!membersId.includes(ownerId)) {
        membersId.push(ownerId);
    }
    console.log(membersId);
    membersPoints = []
    for (let i = 0; i < membersId.length; i++) {
        membersPoints.push(0);
    }

    members = []
    for (let i = 0; i < membersId.length; i++) {
        members.push({ memberId: membersId[i], memberPoints: membersPoints[i] });
    }

    Group.create({ groupname, members, ownerId})
        .then((group) => {
            
            for (const user of members) {
                User.addGroup(user.memberId, group._id)
                    .then((user) => {
                        // HANDLE RESPONSE
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }

            res.status(201).json({ group: group._id });
        })
        .catch((err) => {
            console.log(err);
            res.render('/group');
        })
}

module.exports.group_details_get = (req, res) => {
    const id = req.params.id;
    Group.findById(id)
        .then( async (result) => {
            let workouts = [];
            console.log(result);
            for (const workoutId of result.workoutsId) {
                let workout = await Workout.findById(workoutId);
                workouts.push(workout);
            }
            res.render('groupDetails', {group: result, workouts: workouts})
        })
        .catch((err) => {
            res.status(404);
            console.log(err);
        });
}

module.exports.group_top_get = (req, res) => {
    const id = req.params.id;
    const token = req.cookies.jwt;
    const decodedToken = jwt.decode(token);
    const userId = decodedToken.id; //maybe highlight score

    Group.findById(id)
        .then( async (result) => {
            let members = result.members;
            let membersName = []

            members.sort((a, b) => a.memberPoints > b.memberPoints ? -1 : 1); // must be before

            for (let i = 0; i < members.length; i++) {
                let member = await User.findById(members[i].memberId);
                let memberName = member.username;
                membersName.push(memberName);
            }
            res.render('groupTop', { members: members, membersName: membersName, group: result });
        })
        .catch((err) => {
            res.status(404);
            console.log(err);
        });
}


