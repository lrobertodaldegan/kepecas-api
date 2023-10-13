const db = require("../models");
const User = db.user;

const errorHandler = (err, res) => {
  if (err) {
    console.log(err);
    res.status(500).send({ message:  'Ops!' });
    return;
  }
}

checkDuplicateEmail = (req, res, next) => {
  if(req.body.email){
    User.findOne({
      email: req.body.email
    }).then((user) => {
      if (user) {
        if(req.userId && req.userId != null){
          User.findById(req.userId).exec().then(userById => {
            if(`${user._id}` === `${userById._id}`){
              next();
            } else {
              res.status(400).send({ message: "Email is already in use!" });
              return;
            }
          }).catch(err => errorHandler(err, res));
        } else {
          res.status(400).send({ message: "Failed! Email is already in use!" });
          return;
        }
      } else {
        next();
      }
    }).catch(err => errorHandler(err, res));
  } else {
    next();
  }
};

const verifyUser = {
  checkDuplicateEmail
};

module.exports = verifyUser;