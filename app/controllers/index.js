// const mongoose = require('mongoose');
// const async = require('async');
// const undescore = require('underscore');

/**
 * Redirect users to /#!/app (forcing Angular to reload the page)
 */
exports.play = function play(req, res) {
  if (Object.keys(req.query)[0] === 'custom') {
    res.redirect('/#!/app?custom');
  } else {
    res.redirect('/#!/app');
  }
};

exports.render = function render(req, res) {
  res.render('index', {
    user: req.user ? JSON.stringify(req.user) : 'null'
  });
};
