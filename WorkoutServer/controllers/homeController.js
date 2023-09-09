const User = require('../models/User');

module.exports.home_get = (req, res) => {
    User.find().sort()
        .then((result) => {
            res.render('home', { profiles: result })
        })
        .catch((err) => {
            console.log(err);
        })
}
