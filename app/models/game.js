const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const GameSchema = new Schema({
  gameID: String,
  gamePlayers: [],
  gameOwnerId: String,
  gameWinner: String,
  gameRounds: Number,
  gameStartTime: String,
  gameEndTime: String,
});

mongoose.model('Game', GameSchema);
