const mongoose = require('mongoose');
const Answer = mongoose.model('Answer');

/**
 * Find answer by id
 */
exports.answer = function answer(req, res, next, id) {
  Answer.load(id, (err, newAnswer) => {
    if (err) return next(err);
    if (!newAnswer) return next(new Error(`Failed to load answer ${id}`));
    req.answer = newAnswer;
    next();
  });
};

/**
 * Show an answer
 */
exports.show = function show(req, res) {
  res.jsonp(req.answer);
};

/**
 * List of Answers
 */
exports.all = function all(req, res) {
  Answer.find({
    official: true
  }).select('-_id').exec((err, answers) => {
    if (err) {
      res.render('error', {
        status: 500
      });
    } else {
      res.jsonp(answers);
    }
  });
};

/**
 * List of Answers (for Game class)
 */
exports.allAnswersForGame = function allAnswersForGame(region, cb) {
  const query = (region === 'general') ? {
    official: true
  } : {
    official: true,
    location: region
  };
  Answer.find(query).select('-_id').exec((err, answers) => {
    if (err) {
      return err;
    }
    cb(answers);
  });
};
