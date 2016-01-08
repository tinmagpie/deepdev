(function(){
    "use strict";

    function checkFont(fontName, fontWeight) {
        new FontFaceObserver(fontName, {
          weight: fontWeight
        }).check().then( function(){
            document.documentElement.classList.add(fontName+fontWeight);
        }, function () {
            document.documentElement.classList.add("default-fonts");
        });
    }

    checkFont('Merriweather', 400);
    checkFont('Merriweather', 700);
    checkFont('leagueSpartanRegular', 400);

    var ajax = new XMLHttpRequest();
    ajax.open("GET", "/img/svg/sprite.svg", true);
    ajax.send();
    ajax.onload = function(e) {
      var div = document.createElement("div");
      div.setAttribute("id","svg-sprite");
      div.innerHTML = ajax.responseText;
      document.body.insertBefore(div, document.body.childNodes[0]);
    }

})();
