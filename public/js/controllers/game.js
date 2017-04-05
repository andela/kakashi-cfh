angular.module('mean.system')
.controller('GameController', ['$scope', '$sce', 'game', '$timeout', '$location',
  'MakeAWishFactsService', '$http', 'Users',
  function GameController($scope, $sce, game, $timeout,
    $location, MakeAWishFactsService, $http, Users) {
    $scope.hasPickedCards = false;
    $scope.winningCardPicked = false;
    $scope.showTable = false;
    $scope.modalShown = false;
    $scope.game = game;
    $scope.pickedCards = [];
    $scope.showFindUsersButton = true;
    let makeAWishFacts = MakeAWishFactsService.getMakeAWishFacts();
    $scope.makeAWishFact = makeAWishFacts.pop();
    $scope.usersInvited = Users.usersInvited || [];
    $scope.showStartButtonOverlay = false;

    $scope.pickCard = (card) => {
      if (!$scope.hasPickedCards) {
        if ($scope.pickedCards.indexOf(card.id) < 0) {
          $scope.pickedCards.push(card.id);
          if (game.curQuestion.numAnswers === 1) {
            $scope.sendPickedCards();
            $scope.hasPickedCards = true;
          } else if (game.curQuestion.numAnswers === 2 &&
            $scope.pickedCards.length === 2) {
            // delay and send
            $scope.hasPickedCards = true;
            $timeout($scope.sendPickedCards, 300);
          }
        } else {
          $scope.pickedCards.pop();
        }
      }
    };

    $scope.pointerCursorStyle = () => {
      if ($scope.isCzar() && $scope.game.state === 'waiting for czar to decide') {
        return { cursor: 'pointer' };
      }
      return {};
    };

    $scope.sendPickedCards = () => {
      game.pickCards($scope.pickedCards);
      $scope.showTable = true;
    };

    $scope.cardIsFirstSelected = (card) => {
      if (game.curQuestion.numAnswers > 1) {
        return card === $scope.pickedCards[0];
      }
      return false;
    };

    $scope.cardIsSecondSelected = (card) => {
      if (game.curQuestion.numAnswers > 1) {
        return card === $scope.pickedCards[1];
      }
      return false;
    };

    $scope.firstAnswer = ($index) => {
      if ($index % 2 === 0 && game.curQuestion.numAnswers > 1) {
        return true;
      }
      return false;
    };

    $scope.secondAnswer = ($index) => {
      if ($index % 2 === 1 && game.curQuestion.numAnswers > 1) {
        return true;
      }
      return false;
    };

    $scope.showFirst = card => game.curQuestion.numAnswers > 1 && $scope.pickedCards[0] === card.id;

    $scope.showSecond = card => game.curQuestion.numAnswers > 1 &&
      $scope.pickedCards[1] === card.id;

    $scope.isCzar = () => game.czar === game.playerIndex;

    $scope.isPlayer = $index => $index === game.playerIndex;

    $scope.isCustomGame = () => !(/^\d+$/).test(game.gameID) && game.state === 'awaiting players';

    $scope.isPremium = $index => game.players[$index].premium;

    $scope.currentCzar = $index => $index === game.czar;

    $scope.winningColor = ($index) => {
      if (game.winningCardPlayer !== -1 && $index === game.winningCard) {
        return $scope.colors[game.players[game.winningCardPlayer].color];
      }
      return '#f9f9f9';
    };

    $scope.pickWinning = (winningSet) => {
      if ($scope.isCzar()) {
        game.pickWinning(winningSet.card[0]);
        $scope.winningCardPicked = true;
      }
    };

    $scope.winnerPicked = () => game.winningCard !== -1;

    $scope.startAnyWay = () => {
      const gamePlayers = [];
      Object.keys(game.players).map((index) => {
        gamePlayers.push(game.players[index].username);
      });
      const gameWinner = game.gameWinner;
      const gameID = game.gameID;
      const gameRound = game.round;
      const gameOwnerId = window.localStorage.userid;
      const gameInfo = { gamePlayers, gameWinner, gameOwnerId, gameID, gameRound };
      game.record(gameInfo)
        .then(() => {
          game.startGame();
          $scope.showFindUsersButton = false;
          $(() => {
            $('.gameModalClose').click();
          });
        })
        .catch(() => {
          // console.log(error, ' another error');
        });
    };

    $scope.startGame = () => {
      if ((game.playerIndex === 0 || game.joinOverride) &&
        (game.players.length >= game.playerMinLimit)) {
        if (game.players.length < game.playerMaxLimit) {
          $('#gameModal').modal();
          $scope.gameInviteMessage = `Are you sure you want to start with ${game.players.length} players? 
          CLicking the start button will begin a new game session`;
          $scope.showStartButtonOverlay = true;
        } else {
          $scope.startAnyWay();
        }
      } else if (game.players.length < game.playerMinLimit) {
        $('#gameModal').modal();
        $scope.gameInviteMessage = 'The minimum required number of players have not been reached';
      } else if (game.players.length > game.playerMaxLimit) {
        $('#gameModal').modal();
        $scope.gameInviteMessage = 'The maximum required number of players have reached. Bye bye';
      }
    };

    $scope.sendInvites = (email) => {
      Users.sendInvite(email).then((response) => {
        $scope.gameInviteMessage = response.msg;
        if ($scope.usersInvited.length >= 11) {
          $scope.showFindUsersButton = false;
          $scope.gameInviteMessage = 'Maximum number (11) of users invited. Wait 5 seconds...';
          $('.sendInviteButton').attr('disabled', 'disabled').off('click');
          setTimeout(() => {
            $(() => {
              $('.gameModalClose').click();
            });
          }, 5000);
        }
      })
      .catch((error) => {
        $scope.gameInviteMessage = error;
      });
    };
    $scope.findUsers = () => {
      Users.findUsers().then((resolvedusers) => {
        $scope.availableUsers = resolvedusers;
        $('#availableUsers').modal();
      });
    };

    $scope.$watch('Users.users.signedInusers', () => {
      if (Users.users.signedInusers.length > 0) {
        $scope.signedInusers = Users.users.signedInusers;
      }
    });

    $scope.$watch('game.state', () => {
      if (game.state === 'gamestarted') {
        $scope.showFindUsersButton = false;
        $scope.gameInviteMessage = 'Oh No! \nYou are late. Game has already started\nYou will be redirected';
        $('#gameModal').modal();
        setTimeout(() => {
          $('.gameModalClose').click();
          setTimeout(() => {
            $location.path('/');
          }, 1000);
        }, 3000);
      }
    });

    $scope.abandonGame = () => {
      game.leaveGame();
      $location.path('/');
    };

    // Catches changes to round to update when no players pick card
    // (because game.state remains the same)
    $scope.$watch('game.round', () => {
      $scope.hasPickedCards = false;
      $scope.showTable = false;
      $scope.winningCardPicked = false;
      $scope.makeAWishFact = makeAWishFacts.pop();
      if (!makeAWishFacts.length) {
        makeAWishFacts = MakeAWishFactsService.getMakeAWishFacts();
      }
      $scope.pickedCards = [];
    });

    // In case player doesn't pick a card in time, show the table
    $scope.$watch('game.state', () => {
      if (game.state === 'waiting for czar to decide' && $scope.showTable === false) {
        $scope.showTable = true;
      }
    });

    $scope.$watch('game.gameID', () => {
      // if (!($window.localstorage)) $scope.showFindUsersButton = false;
      if (game.gameID && game.state === 'awaiting players') {
        if (!$scope.isCustomGame() && $location.search().game) {
          // If the player didn't successfully enter the request room,
          // reset the URL so they don't think they're in the requested room.
          $location.search({});
        } else if ($scope.isCustomGame() && !$location.search().game) {
          // Once the game ID is set, update the URL if this is a game with friends,
          // where the link is meant to be shared.
          $location.search({ game: game.gameID });
          if (!$scope.modalShown) {
            game.gameOwner = game.playerIndex;
            game.gamePlayersId = window.localStorage.userid;
            setTimeout(() => {
              const link = document.URL;
              const txt = 'Give the following link to your friends so they can join your game: ';
              $('#lobby-how-to-play').text(txt);
              $('#oh-el').css({ 'text-align': 'center', 'font-size': '22px', background: 'white', color: 'black' }).text(link);
            }, 200);
            $scope.modalShown = true;
          }
        }
        if (game.gameOwner === game.playerIndex) {
          $scope.showFindUsersButton = true;
        } else {
          $scope.showFindUsersButton = false;
        }
      }
    });

    if ($location.search().game && !(/^\d+$/).test($location.search().game)) {
      // joining custom game;
      if (game.players.length >= game.playerMaxLimit) {
        $scope.gameInviteMessage = 'Maximum number of players for this game has been reached. You\'ll be redirected';
        $('#gameModal').modal(); // show message and redirect the user
      } else {
        game.joinGame('joinGame', $location.search().game);
      }
    } else if ($location.search().custom) {
      if (game.players.length >= game.playerMaxLimit) {
        $scope.gameInviteMessage = 'Maximum number of players for this game has been reached. You\'ll be redirected';
        $('#gameModal').modal(); // show message and redirect the user
      } else {
        game.joinGame('joinGame', null, true);
      }
    } else {
      game.joinGame();
    }
  }]);
