angular.module('mean.system')
  .factory('Chat', ['socket', (socket) => {
    let isPlayerSet = false;

    // Send chat message
    const sendChatMessage = () => {
      const chat = {};
      chat.message = $('.emojionearea-editor').html();
      if (!chat.message) return;
      chat.date = new Date().toString();
      chat.avatar = window.localStorage.getItem('avatar');
      chat.username = window.localStorage.getItem('username');
      socket.emit('chat message', chat);
      $('.emojionearea-editor').html('');
    };

    // set current players details to localStorage
    const setPlayer = (avatar, username) => {
      if (isPlayerSet) return;
      window.localStorage.setItem('avatar', avatar);
      window.localStorage.setItem('username', username);
      isPlayerSet = true;
    };

    // function to display a chat message
    const displayChat = (chat) => {
      const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const chatDiv = $('#chatInner');
      const date = new Date(chat.date);
      chatDiv.append(
        `<div class="chat"> <div class="chat-meta">
        <img src="${chat.avatar}"> ${chat.username} <br> 
        ${month[date.getMonth()]} ${date.getDate()},
        ${date.getHours()}:${date.getMinutes()} </div>
        <div class="clearfix"></div>
        <div class="chat-message">${chat.message}</div></div>`
      );
      $('#chatContent').scrollTop(chatDiv.height());
      if (chat.username !== window.localStorage.getItem('username')) {
        $('#chatNotification').show();
      }
    };

    // listen for chat messages
    socket.on('chat message', (chat) => {
      displayChat(chat);
    });

    // Initializes chat when socket is connected
    socket.on('initializeChat', (messages) => {
      messages.forEach((chat) => {
        displayChat(chat);
      });
    });

    // Submit the chat when the 'enter' key is pressed
    $('body').on('keyup', '.emojionearea-editor', (event) => {
      if (event.which === 13) {
        sendChatMessage();
      }
    });

    return {
      sendChatMessage,
      setPlayer,
      isPlayerSet,
    };
  }]);
