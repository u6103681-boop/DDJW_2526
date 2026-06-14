const resources = ['../resources/cb.png', '../resources/co.png',
                '../resources/sb.png', '../resources/so.png',
                '../resources/tb.png', '../resources/to.png'];
const back = '../resources/back.png';

const StateCard = Object.freeze({
  DISABLE: 0,
  ENABLE:  1,
  DONE:    2
});

var game = {
    items:     [],
    states:    [],
    setValue:  null,
    ready:     0,
    lastCards: [],       // ← Array en lloc de lastCard únic
    waiting:   false,    // ← Bloqueja clics durant l'animació de retorn
    score:     200,
    pairs:     2,        // Nombre de grups únics a trobar (decreix quan s'encerta)
    groupSize: 2,        // 2 = parelles | 3 = trios | 4 = quartets

    goBack: function(idx){
        this.setValue && this.setValue[idx](back);
        this.states[idx] = StateCard.ENABLE;
    },
    goFront: function(idx){
        this.setValue && this.setValue[idx](this.items[idx]);
        this.states[idx] = StateCard.DISABLE;
    },

    select: function(){
        if (sessionStorage.load){
            // ── Carreguem partida guardada ──────────────────────────────
            let toLoad = JSON.parse(sessionStorage.load);
            this.items     = toLoad.items;
            this.states    = toLoad.states;
            this.lastCards = toLoad.lastCards || [];
            this.score     = toLoad.score;
            this.pairs     = toLoad.pairs;
            this.groupSize = toLoad.groupSize || 2;
        }
        else{
            // ── Nova partida: llegir opcions de sessionStorage ──────────
            if (sessionStorage.groupSize) this.groupSize = parseInt(sessionStorage.groupSize);
            if (sessionStorage.numPairs)  this.pairs     = parseInt(sessionStorage.numPairs);

            // Garantir que no demanem més grups que recursos disponibles
            this.pairs = Math.min(this.pairs, resources.length);

            // Barrejar recursos i agafar els necessaris
            this.items = resources.slice();
            shuffe(this.items);
            let uniqueCards = this.items.slice(0, this.pairs);

            // Crear groupSize còpies de cada carta única
            this.items = [];
            for (let i = 0; i < this.groupSize; i++){
                this.items = this.items.concat(uniqueCards);
            }
            shuffe(this.items);
            this.states = new Array(this.items.length);
        }
    },

    start: function(){
        this.items.forEach((_, indx) => {
            if (this.states[indx] === StateCard.DISABLE ||
                this.states[indx] === StateCard.DONE){
                this.ready++;            // Carta ja en estat final, no cal animar
            } else {
                setTimeout(() => {
                    this.ready++;
                    this.goBack(indx);   // Mostrar revers (animació d'inici)
                }, 1000 + 100 * indx);
            }
        });
    },

    click: function(indx){
        // ── Guards de bloqueig ──────────────────────────────────────────
        if (this.states[indx] !== StateCard.ENABLE) return;
        if (this.ready < this.items.length)          return;
        if (this.waiting)                            return;
        if (this.lastCards.includes(indx))           return; // Ja seleccionada

        this.goFront(indx);
        this.lastCards.push(indx);

        // ── Comprovem quan tenim groupSize cartes seleccionades ─────────
        if (this.lastCards.length === this.groupSize){
            let firstItem = this.items[this.lastCards[0]];
            let allMatch  = this.lastCards.every(i => this.items[i] === firstItem);

            if (allMatch){
                // ✓ Grup encertat
                this.pairs--;
                this.lastCards.forEach(i => this.states[i] = StateCard.DONE);
                if (this.pairs <= 0){
                    alert(`Has guanyat amb ${this.score} punts!!!!`);
                    window.location.assign("../");
                }
            } else {
                // ✗ Grup erroni: penalitzar i retornar cartes
                this.score -= 25;
                this.waiting = true;
                let toFlip = [...this.lastCards];
                setTimeout(() => {
                    toFlip.forEach(i => this.goBack(i));
                    this.waiting = false;
                    if (this.score <= 0){
                        alert("Has perdut");
                        window.location.assign("../");
                    }
                }, 800);
            }
            this.lastCards = [];
        }
    },

    save: function(){
        // Netejar selecció pendent abans de guardar (estat consistent)
        this.lastCards.forEach(i => this.goBack(i));
        this.lastCards = [];

        let to_save = JSON.stringify({
            items:     this.items,
            states:    this.states,
            lastCards: this.lastCards,
            score:     this.score,
            pairs:     this.pairs,
            groupSize: this.groupSize
        });

        // Guardar sempre en local
        localStorage.save = to_save;

        // Intentar guardar en servidor (sense bloquejar)
        fetch('../php/save.php', {
            method:  "POST",
            body:    to_save,
            headers: {"Content-type": "application/json; charset=UTF-8"}
        }).catch(err => console.error("Error guardant al servidor:", err));

        window.location.assign("../");
    }
};

function shuffe(arr){
    arr.sort(() => Math.random() - 0.5);
}

export var gameItems;
export function selectCards(){
    game.select();
    gameItems = game.items;
}
export function clickCard(indx){ game.click(indx); }
export function startGame(){     game.start();      }
export function initCard(callback){
    if (!game.setValue) game.setValue = [];
    game.setValue.push(callback);
}
export function saveGame(){ game.save(); }
