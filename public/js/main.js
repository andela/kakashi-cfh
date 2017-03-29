$('body').on('click', '#scroll-to-how', () => {
  const target = $('#how-to-play-section');
  if (target.length) {
    $('html, body').animate({
      scrollTop: target.offset().top - 50
    }, 1000);
    return false;
  }
});

$('body').on('click', '#scroll-to-home', () => {
  $('html, body').animate({
    scrollTop: 0
  }, 1000);
});
