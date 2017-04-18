/**
 * Module dependencies.
 */
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Question Schema
 */
const QuestionSchema = new Schema({
  id: {
    type: Number
  },
  text: {
    type: String,
    default: '',
    trim: true
  },
  numAnswers: {
    type: Number
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
QuestionSchema.statics = {
  load: (id, cb) => {
    this.findOne({
      id
    }).select('-_id').exec(cb);
  }
};

mongoose.model('Question', QuestionSchema);
