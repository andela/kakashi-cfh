/**
 * Module dependencies.
 */
const mongoose = require('mongoose');

const Question = mongoose.model('Question');
const _ = require('underscore');

/**
 * Find question by id
 */
exports.question = (req, res, next, id) => {
  Question.load(id, (err, question) => {
    if (err) return next(err);
    if (!question) return next(new Error(`Failed to load question ${id}`));
    req.question = question;
    next();
  });
};

/**
 * Show an question
 */
exports.show = (req, res) => {
  res.jsonp(req.question);
};

/**
 * List of Questions
 */
exports.all = function (req, res) {
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
exports.allQuestionsForGame = (region, cb) => {
  const query = (region === 'general') ?
                    { official: true, numAnswers: { $lt: 3 } }
                    :
                    { official: true, location: region, numAnswers: { $lt: 3 } };

  Question.find(query).select('-_id').exec((err, questions) => {
    if (err) {
      console.log(err);
    } else {
      cb(questions);
    }
  });
};
