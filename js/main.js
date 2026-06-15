addEventListener('load', function() {
    document.getElementById('play').addEventListener('click', () => {
        const mode = prompt("Selecciona el mode de joc:\n1 - Mode 1 (Nivell únic)\n2 - Mode 2 (Dificultat progressiva)");
        if (mode === '1') {
            localStorage.removeItem('current_slot');
            localStorage.removeItem('game_to_load');
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

    document.getElementById('saves').addEventListener('click', () => {
        let saves = JSON.parse(localStorage.getItem('memory_saves')) || [null, null, null, null, null];
        let menuText = "Selecciona una partida per carregar (1-5):\n";
        for (let i = 0; i < 5; i++) {
            if (saves[i]) {
                menuText += `${i + 1} - Mode: ${saves[i].mode} | Punts: ${saves[i].score})\n`;
            } else {
                menuText += `${i + 1} - [Buit]\n`;
            }
        }
        let choice = prompt(menuText);
        let slotNum = parseInt(choice);
        if (!isNaN(slotNum) && slotNum >= 1 && slotNum <= 5) {
            if (saves[slotNum - 1]) {
                localStorage.setItem('current_slot', slotNum);
                localStorage.setItem('game_to_load', JSON.stringify(saves[slotNum - 1]));
                window.location.href = 'html/game.html';
            } else {
            alert("Aquest slot està buit.");
            }
        } else if (choice !== null) {
            alert("Opció no vàlida.");
        }
});

    document.getElementById('exit').addEventListener('click', function(){
        console.warn("No es pot sortir!");
    });
});

function loadRankings() {
    let highscores = JSON.parse(localStorage.getItem('highscores')) || [];
    let list = document.getElementById('ranking-list');
    if (!list) return;
    list.innerHTML = '';
    highscores.forEach((entry, index) => {
        let li = document.createElement('li');
        li.innerHTML = `<strong> - ${index + 1}</strong> --> ${entry.score} pts <em>(Mode ${entry.mode})</em>`;
        list.appendChild(li);
    });
}

window.addEventListener('load', loadRankings);
