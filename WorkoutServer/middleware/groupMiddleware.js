const jwt = require('jsonwebtoken');
const { models } = require('mongoose');
const Group = require('../models/Group');


const requireAccess = async (req, res, next) => {
    
    const token = req.cookies.jwt;
    const userId = jwt.decode(token).id;
    const groupId = req.params.id;
    let group = await Group.findById(groupId);

    for (let i = 0; i < group.members.length; i++) {
        if (group.members[i].memberId === userId) {
            next();
            return;
        }
    }
    res.redirect('/group')
    
}

module.exports =  {requireAccess};