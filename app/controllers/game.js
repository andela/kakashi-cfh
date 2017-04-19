const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const Game = mongoose.model('Game');

exports.saveRecord = (req, res) => {
  const game = new Game({
    gameID: req.params.id,
    gamePlayers: req.body.gamePlayers,
    gameOwnerId: req.body.gameOwnerId,
    gameRounds: req.body.gameRounds,
    gameWinner: req.body.gameWinner,
    gameStartTime: req.body.gameStartTime,
    gameEndTime: req.body.gameEndTime,
  });

  game.save((error) => {
    if (!(error)) {
      res.status(200)
        .json({
          message: 'Game successfully recorded'
        });
    } else {
      res.status(500)
        .json({
          message: 'Unable to save this game log'
        });
    }
  });
};

exports.updateRecord = (req, res) => {
  const game = new Game({
    gameID: req.params.id,
    gameRounds: req.body.gameRounds,
    gameWinner: req.body.gameWinner,
    gameEndTime: req.body.gameEndTime,
  });

  Game.findOneAndUpdate({ gameID: game.gameID },
    {
      $set: {
        gameID: game.gameID,
        gameRounds: game.gameRounds,
        gameWinner: game.gameWinner,
        gameEndTime: game.gameEndTime,
      }
    },
    {
      upsert: true,
    }, (error) => {
      if (!(error)) {
        res.status(200).json({
          message: 'Game successfully recorded'
        });
      } else {
        res.status(500)
          .json('An error occured. saving this game log');
      }
    });
};
