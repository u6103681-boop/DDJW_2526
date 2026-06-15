addEventListener('load', function() {
    document.getElementById('play').addEventListener('click', () => {
        const mode = prompt("Selecciona el mode de joc:\n1 - Mode 1 (Nivell únic)\n2 - Mode 2 (Dificultat progressiva)");
        if (mode === '1') {
            window.location.href = 'html/game.html'; 
        } 
        else if (mode === '2') {
            console.log("Mode 2 seleccionat. Encara no implementat.");
        } 
        else if (mode !== null) {
        alert("Opció no vàlida, introdueix '1' o '2'.");
        }
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
        console.warn("No es pot sortir!");
    });
});
