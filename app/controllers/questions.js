
const mongoose = require('mongoose');

const Question = mongoose.model('Question');


/**
 * Find question by id
 */
exports.question = function question(req, res, next, id) {
  Question.load(id, (err, newQuestion) => {
    if (err) return next(err);
    if (!newQuestion) return next(new Error(`Failed to load question ${id}`));
    req.question = newQuestion;
    next();
  });
};

/**
 * Show an question
 */
exports.show = function show(req, res) {
  res.jsonp(req.question);
};

/**
 * List of Questions
 */
exports.all = function all(req, res) {
  Question.find({ official: true, numAnswers: { $lt: 3 } }).select('-_id').exec((err, questions) => {
    if (err) {
      res.render('error', {
        status: 500
      });
    } else {
      res.jsonp(questions);
    }
  });
};

/**
 * List of Questions (for Game class)
 */
exports.allQuestionsForGame = function allQuestionsForGame(region, cb) {
  Question.find({ official: true, location: region, numAnswers: { $lt: 3 } }).select('-_id').exec((err, questions) => {
    if (err) {
      return err;
    }
    cb(questions);
  });
};
