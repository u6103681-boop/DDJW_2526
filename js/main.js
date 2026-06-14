addEventListener('load', function() {
    document.getElementById('play').addEventListener('click', function(){
        sessionStorage.groupSize = localStorage.options ? JSON.parse(localStorage.options).groupSize : 2;
        sessionStorage.numPairs  = localStorage.options ? JSON.parse(localStorage.options).pairs : 2;
        sessionStorage.removeItem('load');
        window.location.assign("./html/game.html");
    });

    document.getElementById('options').addEventListener('click', function(){
        window.location.assign("./html/options.html");
    });

    document.getElementById('saves').addEventListener('click', function(){
        let to_load = localStorage.save;
        
        if (!to_load) {
            alert("No hi ha cap partida a carregar");
            return;
        }
        
        sessionStorage.load = to_load;
        window.location.assign("./html/game.html");
    });

    document.getElementById('exit').addEventListener('click', function(){
        console.warn("No es pot sortir des del navegador!");
    });
});
