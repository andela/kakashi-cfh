const users = require('../app/controllers/users');
const answers = require('../app/controllers/answers');
const index = require('../app/controllers/index');
const avatars = require('../app/controllers/avatars');
const questions = require('../app/controllers/questions');

module.exports = (app, passport) => {
  // User Routes
  const mongoose = require('mongoose');

  const User = mongoose.model('User');

  mongoose.Promise = global.Promise;

  // User Routes
  app.get('/signin', users.signin);
  app.get('/signup', users.signup);
  app.get('/chooseavatars', users.checkAvatar);
  app.get('/signout', users.signout);

    // Setting up the users api
  app.post('/api/auth/signin', users.signin);
  app.post('/api/auth/signup', users.create);
  app.post('/users', users.create);
  app.post('/users/avatars', users.avatars);

    // Donation Routes
  app.post('/donations', users.addDonation);

  app.post('/users/session', passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: 'Invalid email or password.'
  }), users.session);

  app.get('/users/me', users.me);
  app.get('/users/:userId', users.show);

    // API routes for user search
  app.get('/api/search/users', users.isAuthenticated, users.findUsers);
  app.get('/api/search/users/:userid', users.isAuthenticated, users.findUser);
  app.post('/users/sendinvite', users.sendInvites);

  // const Game = require('../app/models/game');
  app.post('/api/games/:id/start', users.isAuthenticated, (req, res) => {
    const gameOwnerId = req.params.gameOwnerId;
    const players = req.body.gamePlayers;
    const winner = req.body.gameWinner;
    const gameID = req.body.gameID;
    const round = req.body.gameRound;
    const updates = {
      [gameID]: {
        date: Date.now(),
        rounds: round,
        players,
        winner,
      }
    };
    User.findByIdAndUpdate(gameOwnerId,
      {
        $push: { games: updates }
      }, {
        upsert: true
      }, (error) => {
        if (!(error)) {
          res.status(200).json({
            message: 'game successfully recorded'
          });
        } else {
          res.send('An error occured.');
        }
      });
  });

    // Setting the facebook oauth routes
  app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['email'],
    failureRedirect: '/signin'
  }), users.signin);

  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/signin'
  }), users.authCallback);

    // Setting the github oauth routes
  app.get('/auth/github', passport.authenticate('github', {
    failureRedirect: '/signin'
  }), users.signin);

  app.get('/auth/github/callback', passport.authenticate('github', {
    failureRedirect: '/signin'
  }), users.authCallback);

    // Setting the twitter oauth routes
  app.get('/auth/twitter', passport.authenticate('twitter', {
    failureRedirect: '/signin'
  }), users.signin);

  app.get('/auth/twitter/callback', passport.authenticate('twitter', {
    failureRedirect: '/signin'
  }), users.authCallback);

    // Setting the google oauth routes
  app.get('/auth/google', passport.authenticate('google', {
    failureRedirect: '/signin',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  }), users.signin);

  app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/signin'
  }), users.authCallback);

    // Finish with setting up the userId param
  app.param('userId', users.user);

    // Answer Routes
  app.get('/answers', answers.all);
  app.get('/answers/:answerId', answers.show);
    // Finish with setting up the answerId param
  app.param('answerId', answers.answer);

    // Question Routes
  app.get('/questions', questions.all);
  app.get('/questions/:questionId', questions.show);
    // Finish with setting up the questionId param
  app.param('questionId', questions.question);


  app.get('/avatars', avatars.allJSON);

    // Home route
  app.get('/play', index.play);
  app.get('/', index.render);
};
