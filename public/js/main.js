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
$('body').on('click', '#openChat', () => {
  $('#openChat').hide();
  $('#closeChat').show();
  $('.chat-content').slideDown();
});

$(window).ready(() => {
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
  }, 300);
});
