/* eslint-disable no-underscore-dangle */

/**
 * [Module dependencies.]
 * @type {[type]}
 */
const mongoose = require('mongoose');
const avatars = require('./avatars').all();
const jwt = require('jsonwebtoken');
const C4HMailer = require('../../config/mailer.js').C4HMailer;

mongoose.Promise = global.Promise;

const User = mongoose.model('User');

mongoose.Promise = global.Promise;

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

exports.findUsers = (req, res) => {
  User.find({}).select('name email').then((allUsers) => {
    res.status(200)
      .json(allUsers);
  });
};

exports.findUser = (req, res) => {
  const userid = req.params.userid;
  User.findById(userid, (err, oneUser) => {
    if (!err) {
      res.status(200)
        .json(oneUser);
    } else {
      res.status(400)
        .json('An error occured');
    }
  });
};

exports.getFriends = (req, res) => {
  const userId = req.body.userId;
  User.findById(userId, (err, user) => {
    if (user) {
      res.status(200)
        .json(user.friends);
    } else {
      res.status(404)
        .json('error getting friends list');
    }
  });
};

exports.addFriends = (req, res) => {
  const userToAddEmail = req.body.user;
  const userId = req.body.userId;
  User.findOne({
    email: userToAddEmail
  }, (err, obj) => {
    if (!err) {
      res.status(200)
        .json(obj.name);
    } else {
      res.status(400)
        .json('error adding friend to friends list');
    }
  });
  User.findOneAndUpdate({
    _id: userId
  }, {
    $push: {
      friends: userToAddEmail
    }
  }, {
    safe: true,
    upsert: true
  }, (error) => {
    if (error) {
      res.status(500)
        .json('error updating user friend list');
    }
  });

  User.findById(userId, (err, user) => {
    if (!user) {
      res.status(404)
        .json('error finding user');
    }
    user.friends = [...new Set(user.friends)];
    user.save((err) => {
      if (err) {
        res.status(500)
          .json('error saving user');
      }
    });
  });
};

exports.deleteFriend = (req, res) => {
  const email = req.body.user;
  const userId = req.body.userId;
  User.findById(userId, (err, user) => {
    if (!user) {
      res.status(404)
        .json('error finding user');
    }
    const index = user.friends.indexOf(email);
    if (index > -1) {
      user.friends.splice(index, 1);
    }
    user.save((err) => {
      if (err) {
        res.status(500)
          .json('error saving user');
      }
    });
    User.findOne({
      email,
    }, (err, person) => {
      if (person) {
        res.status(200)
          .json(person.name);
      } else {
        res.status(404)
          .json('error finding user');
      }
    });
  });
};

exports.inviteFriends = (req, res) => {
  const userId = req.body.userId;
  const url = req.body.gameUrl;
  User.findById(userId, (err, user) => {
    if (!(err)) {
      user.friends.forEach((friendEmail) => {
        C4HMailer('C4H-Kakashi Team',
          friendEmail, 'Game invite at C4H',
          `You have been invited to join a game at C4H. Use this link ${url}`,
          `You have been invited to join a game at C4H.\n
            Use this link <a href="${url}">${url}</a>`);
      });
      res.status(200)
        .json({
          result: user.friends.length
        });
    } else {
      res.status(500)
        .json('error inviting friends');
    }
  });
};

exports.sendInvites = (req, res) => {
  const url = decodeURIComponent(req.body.url);
  const userToInvite = req.body.user;
  try {
    C4HMailer('C4H-Kakashi Team',
      userToInvite, 'Game invite at C4H',
      `You have been invited to join a game at C4H. Use this link ${url}`,
      `You have been invited to join a game at C4H.\n
        Use this link <a href="${url}">${url}</a>`);
    res.status(200)
      .json(userToInvite);
  } catch (error) {
    res.status(500)
      .json(error);
  }
};

exports.isAuthenticated = (req, res, next) => {
  const usertoken = req.headers['x-access-token'];
  jwt.verify(usertoken, process.env.SECRETKEY, (error, decoded) => {
    if (error) {
      res.status(401)
        .json({
          success: false,
          message: 'user not authenticated'
        });
    } else {
      req.decodedUser = decoded;
      next();
    }
  });
};

exports.signin = (req, res) => {
  if (req.body.email && req.body.password) {
    User.findOne({
      email: req.body.email,
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
              userid: existingUser.id,
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
  if (req.body.name && req.body.password && req.body.email
    && req.body.userAvatar) {
    User.findOne({
      email: req.body.email,
    })
      .exec((err, existingUser) => {
        if (!existingUser) {
          User.findOne({
            name: req.body.name
          }).exec((err, userExist) => {
            if (!(userExist)) {
              const user = new User(req.body);
          // Switch the user's avatar index to an actual avatar url
              user.avatar = req.body.userAvatar || avatars[user.avatar];
              user.provider = 'local';
              user.save((err) => {
                if (err) {
                  return res.json({
                    success: false,
                    message: 'Unable to save user'
                  });
                }
              });
              const token = jwt.sign({
                id: user.id
              }, process.env.SECRETKEY, {
                expiresIn: 60 * 60 * 24 * 7
              });
              return res.status(200)
                .json({
                  success: true,
                  userid: user.id,
                  message: 'User successfully created',
                  token
                });
            }
            return res.json({
              success: false,
              message: 'User already exists'
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
        if (user.avatar !== undefined && user.email !== undefined) {
          res.redirect('/#!/welcome');
        } else {
          res.redirect('/#!/choose-avatar');
        }
      });
  } else {
    // If user doesn't even exist, redirect to /
    res.redirect('/checkk');
  }
};

/**
 * Get details for social login
 * @param  {[req]} req [request]
 * @param  {[res]} res [response]
 * @return {Object|[Path]} [Path]
 */
exports.getDetails = (req, res) => {
  const userAvatar = req.body.userDetails.userAvatar;
  const email = req.body.userDetails.email;

  if (req.user && req.user._id) {
    User.findByIdAndUpdate(
      req.user._id
    , {
      avatar: userAvatar,
      email: req.user.email || email
    }, {
      upsert: true
    }, (err, user) => {
      const token = jwt.sign({
        id: res.req.user._id
      }, process.env.SECRETKEY, {
        expiresIn: 60 * 60 * 24 * 7
      });
      user = {
        email: res.req.user.email || '',
        username: res.req.user.username,
        userid: res.req.user._id,
        token,
      };
      res.status(200)
        .json(user);
    });
  } else {
    // If user doesn't even exist, redirect to /
    res.redirect('/totter');
  }
};

exports.socialSignin = (req, res) => {
  if (req.user && req.user._id) {
    User.findOne(
      req.user._id
    , (err, user) => {
      const token = jwt.sign({
        id: res.req.user._id
      }, process.env.SECRETKEY, {
        expiresIn: 60 * 60 * 24 * 7
      });
      user = {
        email: res.req.user.email || '',
        username: res.req.user.username,
        userid: res.req.user._id,
        token,
      };
      res.status(200)
        .json(user);
    });
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
    if (req.body.amount && req.body.crowdrise_donation_id
        && req.body.donor_name) {
      User.findOne({
        _id: req.user._id
      })
        .exec((err, user) => {
          // Confirm that this object hasn't already been entered
          let duplicate = false;
          for (let i = 0; i < user.donations.length; i += 1) {
            if (user.donations[i].crowdrise_donation_id
                === req.body.crowdrise_donation_id) {
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
