/**
 * Module dependencies.
 */
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Answer Schema
 */
const AnswerSchema = new Schema({
  id: {
    type: Number
  },
  text: {
    type: String,
    default: '',
    trim: true
  },
  official: {
    type: Boolean
  },
  expansion: {
    type: String,
    default: '',
    trim: true
  },
  location: {
    type: String
  }
});

/**
 * Statics
 */
AnswerSchema.statics = {
  load: (id, cb) => {
    this.findOne({
      id
    }).select('-_id').exec(cb);
  }
};

mongoose.model('Answer', AnswerSchema);
