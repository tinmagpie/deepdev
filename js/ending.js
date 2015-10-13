var Ending = (function() {
  function Ending() {
  };

  Ending.prototype.inject = function() {
    var url;
    if (shouldShowBloop()) {
      url = 'snippets/bloop.html';
    } else {
      url = 'snippets/alternate-ending.html';
    }
    $.get(url)
    .done(function(html) {
      $('#d2200').html(html);
    });
  }

  function shouldShowBloop() {
    return !!navigator.userAgent.search(/refo/i);
  }

  return new Ending();
})()
