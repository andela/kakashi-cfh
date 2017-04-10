/* global Tour */

// Homepage scroll snippet
$('body').on('click', '#scroll-to-how', () => {
  const target = $('#how-to-play-section');
  if (target.length) {
    $('html, body').animate({
      scrollTop: target.offset().top - 50
    }, 1000);
  }
});

$('body').on('click', '#scroll-to-home', () => {
  $('html, body').animate({
    scrollTop: 0
  }, 1000);
});

// Show or hide ChatBox
$('body').on('click', '#closeChat', () => {
  $('#closeChat').hide();
  $('#openChat').show();
  $('.chat-content').slideUp();
});
$('body').on('click', '#openChat, .emojionearea-editor', () => {
  $('#openChat').hide();
  $('#closeChat').show();
  $('.chat-content').slideDown();
});
$('body').on('click', '.chatbox', () => $('#chatNotification').hide());

$(window).ready(() => {
// Instance the tour
  const tour = new Tour({
    storage: false,
    backdrop: false,
    steps: [
      {
        element: '.q-players',
        title: 'Number of players',
        content: 'This section shows how many players have joined the game. A minimum of 3 players and a maximum of 12 players can play the game.'
      },
      {
        element: '.timer .number',
        title: 'Timer',
        content: 'This is a countdown timer that shows how much time is remaining to perform an action (e.g select answer, start next round).'
      },
      {
        element: '.chatbox',
        title: 'Chat window',
        placement: 'top',
        content: 'Here you can chat and view conversations between players in the game. Click the chevron button to expand or collapse the ChatBox.'
      },
      {
        element: '#abandon-game',
        title: 'Abandon Game',
        placement: 'bottom',
        content: 'Click this button to Leave the game. You will not be able to get back into this game if it has already started.'
      },
      {
        element: '#player-section',
        title: 'Players',
        placement: 'left',
        content: 'This section shows the names and avatars of players currently in the game. It also shows the score of each player.'
      },
      {
        element: '#question-div',
        title: 'Question',
        placement: 'bottom',
        content: 'The question for the current round.'
      },
      {
        element: '#answers-div',
        title: 'Answer options',
        placement: 'top',
        content: 'Shows possible answers to the question above here.'
      },
      {
        element: '.how-to-play',
        title: 'How to Play',
        content: 'Brief instructions on how to play the game.'
      }
    ] });

  $('body').on('click', '#startTour', () => {
    tour.start();
  });

  // Initialize emoji
  setTimeout(() => {
    $('#chatInput').emojioneArea({
      pickerPosition: 'top',
      filtersPosition: 'top',
      tones: false,
      autocomplete: false,
      inline: true,
      hidePickerOnBlur: true
    });

    // Initialize the tour
    tour.init();
  }, 300);
});
