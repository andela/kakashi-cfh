/**
 * Module dependencies.
 */
const mongoose = require('mongoose');

const Answer = mongoose.model('Answer');
const _ = require('underscore');


/**
 * Find answer by id
 */
exports.answer = (req, res, next, id) => {
  Answer.load(id, (err, answer) => {
    if (err) return next(err);
    if (!answer) return next(new Error(`Failed to load answer ${id}`));
    req.answer = answer;
    next();
  });
};

/**
 * Show an answer
 */
exports.show = (req, res) => {
  res.jsonp(req.answer);
};

/**
 * List of Answers
 */
exports.all = (req, res) => {
  Answer.find({ official: true }).select('-_id').exec((err, answers) => {
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
exports.allAnswersForGame = (region, cb) => {
  const query = (region === 'general') ?
                { official: true } :
                { official: true, location: region };
  Answer.find(query).select('-_id').exec((err, answers) => {
    if (err) {
      // console.log(err);
    } else {
      cb(answers);
    }
  });
};
