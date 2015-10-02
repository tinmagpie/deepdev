(function(){

    function checkFont(fontName, fontWeight) {
        new FontFaceObserver(fontName, {
          weight: fontWeight
        }).check().then( function(){
            document.documentElement.classList.add(fontName+fontWeight);
        }, function () {
            document.documentElement.classList.add("default-fonts");
        });
    }

    checkFont('Merriweather', 700);
    checkFont('Merriweather', 900);
    checkFont('leagueSpartanRegular', 400);
})();
