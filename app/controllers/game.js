const mongoose = require('mongoose');

const User = mongoose.model('User');

exports.record = (req, res) => {
  const gameOwnerId = req.params.id;
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
      upsert: true,
    }, (error) => {
      if (!(error)) {
        res.status(200).json({
          message: 'Game successfully recorded'
        });
      } else {
        res.send('An error occured.');
      }
    });
};
