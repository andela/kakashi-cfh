/**
 * [Module dependencies.]
 * @type {[type]}
 */
const mongoose = require('mongoose'),
  User = mongoose.model('User');
const avatars = require('./avatars')
  .all();
const jwt = require('jsonwebtoken');

/**
 * [Auth callback]
 * @param  {[req]}   req  [request]
 * @param  {[res]}   res  [response]
 * @param  {[next]} next [next]
 * @return {[Path]}        [Path]
 */
exports.authCallback = (req, res) => {
  res.redirect('/chooseavatars');
};

/**
 * [Show login form]
 * @param  {[req]} req [request]
 * @param  {[res]} res [response]
 * @return {[Path]}     [Path]
 */
exports.signin = (req, res) => {
  if (req.body.email && req.body.password) {
    User.findOne({
      email: req.body.email
    })
      .exec((err, existingUser) => {
        if (err) throw err;

        if (!existingUser) {
          return res.json({
            success: false,
            message: 'Invalid email or password'
          });
        } else if (existingUser) {
          let validPassword;
          if (req.body.password) {
            validPassword = existingUser.authenticate(req.body.password);
          } else {
            return res.json({
              success: false,
              message: 'No password provided'
            });
          }
          if (!validPassword) {
            return res.json({
              success: false,
              message: 'Invalid email or password'
            });
          }
          return res.status(200)
            .json({
              success: true,
              message: 'User successfully logged in',
              token: jwt.sign({
                id: existingUser.id
              }, process.env.SECRETKEY, {
                expiresIn: 60 * 60 * 24 * 7
              })
            });
        }
      });
  }
};

/**
 * [Show sign up form]
 * @param  {[req]} req [request]
 * @param  {[res]} res [response]
 * @return {[Path]}     [Path]
 */
exports.signup = (req, res) => {
  if (!req.user) {
    res.redirect('/#!/signup');
  } else {
    res.redirect('/#!/app');
  }
};

/**
 * [Logout]
 * @param  {[req]} req [request]
 * @param  {[res]} res [response]
 * @return {[Path]}     [Path]
 */
exports.signout = (req, res) => {
  req.logout();
  res.redirect('/');
};

/**
 * [Create user]
 * @param  {[req]} req [request]
 * @param  {[res]} res [response]
 * @return {[Path]}     [Path]
 */
exports.create = (req, res) => {
  if (req.body.name && req.body.password && req.body.email) {
    User.findOne({
      email: req.body.email
    })
      .exec((err, existingUser) => {
        if (!existingUser) {
          const user = new User(req.body);
          // Switch the user's avatar index to an actual avatar url
          user.avatar = avatars[user.avatar];
          user.provider = 'local';
          user.save((err) => {
            if (err) {
              return res.json({
                success: false,
                message: 'Unable to save user'
              });
            }
            req.logIn(user, (err) => {
              if (err) {
                res.json({
                  success: false,
                  message: 'Unable to login',
                });
              } else {
                const token = jwt.sign({
                  id: user.id
                }, process.env.SECRETKEY, {
                  expiresIn: 60 * 60 * 24 * 7
                });

                return res.status(200)
                  .json({
                    success: true,
                    message: 'User successfully created',
                    token
                  });
              }
            });
          });
        } else {
          return res.json({
            success: false,
            message: 'User already exists'
          });
        }
      });
  } else {
    return res.json({
      success: false,
      message: 'Invalid Inputs'
    });
  }
};

/**
 * Session
 * @param  {[req]} req [request]
 * @param  {[res]} res [response]
 * @return {[Path]}     [Path]
 */
exports.session = (req, res) => {
  res.redirect('/');
};

/**
 * Check avatar - Confirm if the user who logged in via passport
 * already has an avatar. If they don't have one, redirect them
 * to our Choose an Avatar page.
 * @param  {[req]} req [request]
 * @param  {[res]} res [response]
 * @return {[Path]}     [Path]
 */
exports.checkAvatar = (req, res) => {
  if (req.user && req.user._id) {
    User.findOne({
      _id: req.user._id
    })
      .exec((err, user) => {
        if (user.avatar !== undefined) {
          res.redirect('/#!/');
        } else {
          res.redirect('/#!/choose-avatar');
        }
      });
  } else {
    // If user doesn't even exist, redirect to /
    res.redirect('/');
  }
};

/**
 * [Assign avatar to user]
 * @param  {[req]} req [request]
 * @param  {[res]} res [response]
 * @return {[Path]}     [Path]
 */
exports.avatars = (req, res) => {
  // Update the current user's profile to include the avatar choice they've made
  if (req.user && req.user._id && req.body.avatar !== undefined &&
    /\d/.test(req.body.avatar) && avatars[req.body.avatar]) {
    User.findOne({
      _id: req.user._id
    })
      .exec((err, user) => {
        user.avatar = avatars[req.body.avatar];
        user.save();
      });
  }
  return res.redirect('/#!/app');
};

/**
 * [add donations]
 * @param  {[req]} req [request]
 * @param  {[res]} res [response]
 * @return {[Path]}     [Path]
 */
exports.addDonation = (req, res) => {
  if (req.body && req.user && req.user._id) {
    // Verify that the object contains crowdrise data
    if (req.body.amount && req.body.crowdrise_donation_id && req.body.donor_name) {
      User.findOne({
        _id: req.user._id
      })
        .exec((err, user) => {
          // Confirm that this object hasn't already been entered
          let duplicate = false;
          for (let i = 0; i < user.donations.length; i += 1) {
            if (user.donations[i].crowdrise_donation_id === req.body.crowdrise_donation_id) {
              duplicate = true;
            }
          }
          if (!duplicate) {
            user.donations.push(req.body);
            user.premium = 1;
            user.save();
          }
        });
    }
  }
  res.send();
};

/**
 * [Show profile]
 * @param  {[req]} req [request]
 * @param  {[res]} res [response]
 * @return {[Path]}     [Path]
 */
exports.show = (req, res) => {
  const user = req.profile;

  res.render('users/show', {
    title: user.name,
    user
  });
};

/**
 * [Send User]
 * @param  {[req]} req [request]
 * @param  {[res]} res [response]
 * @return {[Path]}     [Path]
 */
exports.me = (req, res) => {
  res.jsonp(req.user || null);
};

/**
 * [Find user by id]
 * @param  {[req]}   req  [request]
 * @param  {[res]}   res  [response]
 * @param  {next} next [next]
 * @param  {[id]}   id   [id]
 * @return {[Path]}        [Path]
 */
exports.user = (req, res, next, id) => {
  User
    .findOne({
      _id: id
    })
    .exec((err, user) => {
      if (err) return next(err);
      if (!user) return next(new Error(`Failed to load User  ${id}`));
      req.profile = user;
      next();
    });
};
