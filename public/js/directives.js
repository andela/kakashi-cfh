angular.module('mean.directives', [])
  .directive('player', function (){
    return{
      restrict: 'EA',
      templateUrl: '/views/player.html',
      link: function(scope, elem, attr){
        scope.colors = ['#7CE4E8', '#FFFFa5', '#FC575E', '#F2ADFF', '#398EC4', '#8CFF95'];
      }
    };
  }).directive('answers', function() {
    return {
      restrict: 'EA',
      templateUrl: '/views/answers.html',
      link: function(scope, elem, attr) {

        scope.$watch('game.state', function() {
          if (scope.game.state === 'winner has been chosen') {
            var curQ = scope.game.curQuestion;
            var curQuestionArr = curQ.text.split('_');
            var startStyle = "<span style='color: "+scope.colors[scope.game.players[scope.game.winningCardPlayer].color]+"'>";
            var endStyle = "</span>";
            var shouldRemoveQuestionPunctuation = false;
            var removePunctuation = function(cardIndex) {
              var cardText = scope.game.table[scope.game.winningCard].card[cardIndex].text;
              if (cardText.indexOf('.',cardText.length-2) === cardText.length-1) {
                cardText = cardText.slice(0,cardText.length-1);
              } else if ((cardText.indexOf('!',cardText.length-2) === cardText.length-1 ||
                cardText.indexOf('?',cardText.length-2) === cardText.length-1) &&
                cardIndex === curQ.numAnswers-1) {
                shouldRemoveQuestionPunctuation = true;
              }
              return cardText;
            };
            if (curQuestionArr.length > 1) {
              var cardText = removePunctuation(0);
              curQuestionArr.splice(1,0,startStyle+cardText+endStyle);
              if (curQ.numAnswers === 2) {
                cardText = removePunctuation(1);
                curQuestionArr.splice(3,0,startStyle+cardText+endStyle);
              }
              curQ.text = curQuestionArr.join("");
              // Clean up the last punctuation mark in the question if there already is one in the answer
              if (shouldRemoveQuestionPunctuation) {
                if (curQ.text.indexOf('.',curQ.text.length-2) === curQ.text.length-1) {
                  curQ.text = curQ.text.slice(0,curQ.text.length-2);
                }
              }
            } else {
              curQ.text += ' '+startStyle+scope.game.table[scope.game.winningCard].card[0].text+endStyle;
            }
          }
        });
      }
    };
  }).directive('question', function() {
    return {
      restrict: 'EA',
      templateUrl: '/views/question.html',
      link: function(scope, elem, attr) {}
    };
  })
  .directive('timer', function(){
    return{
      restrict: 'EA',
      templateUrl: '/views/timer.html',
      link: function(scope, elem, attr){}
    };
  }).directive('landing', function() {
    return {
      restrict: 'EA',
      link: function(scope, elem, attr) {
        scope.showOptions = true;

        if (scope.$$childHead.global.authenticated === true) {
          scope.showOptions = false;
        }
      }
    };
  })
  .directive('chatbox', ['socket', socket => ({
    restrict: 'AE',
    replace: true,
    link: (scope, element) => {
        // Send chat message
      scope.sendChatMessage = () => {
        const chat = {};
        chat.message = $('.emojionearea-editor').html();
        if (!chat.message) return;
        chat.date = new Date().toString();
        chat.avatar = window.localStorage.getItem('avatar');
        chat.username = window.localStorage.getItem('username');
        socket.emit('chat message', chat);
        $('.emojionearea-editor').html('');
      };

      // display a chat message
      const displayChat = (chat) => {
        const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const date = new Date(chat.date);
        element.append(
          `<div class="chat"> <div class="chat-meta">
          <img src="${chat.avatar}"> ${chat.username} <br> 
          ${month[date.getMonth()]} ${date.getDate()},
          ${date.getHours()}:${date.getMinutes()} </div>
          <div class="clearfix"></div>
          <div class="chat-message">${chat.message}</div></div>`
        );
        $('#chatContent').scrollTop(element.height());
        if (chat.username !== window.localStorage.getItem('username')) {
          $('#chatNotification').show();
        }
      };

      // set current players details to localStorage and initialize the emoji
      scope.setPlayer = (avatar, username) => {
        window.localStorage.setItem('avatar', avatar);
        window.localStorage.setItem('username', username);

        $('#chatInput').emojioneArea({
          pickerPosition: 'top',
          filtersPosition: 'top',
          tones: false,
          autocomplete: false,
          inline: true,
          hidePickerOnBlur: true
        });
        scope.isPlayerSet = true;
      };

        // Initializes chat when socket is connected
      socket.on('initializeChat', (messages) => {
        messages.forEach((chat) => {
          displayChat(chat);
        });
      });

        // listen for chat messages
      socket.on('chat message', (chat) => {
        displayChat(chat);
      });

        // Submit the chat when the 'enter' key is pressed
      $('body').on('keyup', '.emojionearea-editor', (event) => {
        if (event.which === 13) {
          scope.sendChatMessage();
        }
      });
    },
  })])
  .directive('leaderboard', ['dashboard', dashboard => ({
    restrict: 'EA',
    link: (scope) => {
      dashboard.getGames.then((response) => {
        const players = {};
        const leaderboard = [];
        response.data.forEach((game) => {
          // save game data for leaderboard
          if (game.gameEndTime !== 'not completed') {
            const score = players[game.gameWinner];
            if (score) {
              players[game.gameWinner] += 1;
            } else {
              players[game.gameWinner] = 1;
            }
          }
        });
        $('#Game').addClass('show-game-log');
        Object.keys(players).forEach((key) => {
          leaderboard.push({ username: key, score: players[key] });
        });
        scope.leaderboard = leaderboard;
      });
    },
    template: '<tr ng-repeat="player in leaderboard | orderBy:\'-score\'"><th>{{$index + 1}}</th><td>{{player.username}}</td><td>{{player.score}}</td></tr>',
  })])
  .directive('gameLog', ['dashboard', dashboard => ({
    restrict: 'EA',
    link: (scope) => {
      dashboard.getGameLog.then((response) => {
        const playerGameLog = [];
        const currentPlayer = window.localStorage.getItem('username');
        const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
          'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        response.data.forEach((game) => {
           // save game data for the gamelog
          if (game.gamePlayers.indexOf(currentPlayer) !== -1) {
            let date = new Date(parseInt(game.gameEndTime, 10));
            if (game.gameEndTime !== 'not completed') {
              game.date = `${date.getDate()} ${month[date.getMonth()]}, 
              ${date.getFullYear()}`;
              game.gameStatus = 'completed';
            } else {
              date = new Date(parseInt(game.gameStartTime, 10));
              game.date = `${date.getDate()} ${month[date.getMonth()]}, 
              ${date.getFullYear()}`;
              game.gameStatus = 'not completed';
            }
            playerGameLog.push(game);
          }
        });
        scope.playerGameLog = playerGameLog;
      });
    },
    templateUrl: '/views/game-log.html',
  })])
 .directive('donations', ['dashboard', dashboard => ({
   restrict: 'EA',
   link: (scope) => {
     const getUserDonations = () => {
       dashboard.getDonations.then((response) => {
        // const userData = {};
         let userDonations = 0;
         response.data.forEach((users) => {
            // get no of donations for user
           scope.userName = window.localStorage.getItem('username');
           if (users.donations.length > 0) {
             userDonations = users.donations.length;
             scope.donationMsg = `You have made ${userDonations} donations till now`;
           } else {
             scope.donationMsg = `You have made ${userDonations} donations till now`;
           }
         });
       });
     };
     getUserDonations();
   },
   template: '<p>Hello {{userName}}</p><p>{{donationMsg}}</p>',
 })]);
