const svg_co = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="128" viewBox="0 0 96 128">
  <rect width="96" height="128" rx="8" fill="#ebe8cd" stroke="#37474F" stroke-width="2"/>
  <rect x="5" y="5" width="86" height="118" rx="5" fill="none" stroke="#00b2fe" stroke-width="1"/>
  <circle cx="48" cy="64" r="28" fill="#e6921d" stroke="#9c6312" stroke-width="2.5"/>
</svg>`;

const svg_cb = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="128" viewBox="0 0 96 128">
  <rect width="96" height="128" rx="8" fill="#ebe8cd" stroke="#37474F" stroke-width="2"/>
  <rect x="5" y="5" width="86" height="118" rx="5" fill="none" stroke="#00b2fe" stroke-width="1"/>
  <circle cx="48" cy="64" r="28" fill="#00b2fe" stroke="#005b82" stroke-width="2.5"/>
</svg>`;

const svg_to = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="128" viewBox="0 0 96 128">
  <rect width="96" height="128" rx="8" fill="#ebe8cd" stroke="#37474F" stroke-width="2"/>
  <rect x="5" y="5" width="86" height="118" rx="5" fill="none" stroke="#00b2fe" stroke-width="1"/>
  <polygon points="48,30 77.44,81 18.56,81" fill="#e6921d" stroke="#9c6312" stroke-width="2.5" stroke-linejoin="round"/>
</svg>`;

const svg_tb = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="128" viewBox="0 0 96 128">
  <rect width="96" height="128" rx="8" fill="#ebe8cd" stroke="#37474F" stroke-width="2"/>
  <rect x="5" y="5" width="86" height="118" rx="5" fill="none" stroke="#00b2fe" stroke-width="1"/>
  <polygon points="48,30 77.44,81 18.56,81" fill="#00b2fe" stroke="#005b82" stroke-width="2.5" stroke-linejoin="round"/>
</svg>`;

const svg_so = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="128" viewBox="0 0 96 128">
  <rect width="96" height="128" rx="8" fill="#ebe8cd" stroke="#37474F" stroke-width="2"/>
  <rect x="5" y="5" width="86" height="118" rx="5" fill="none" stroke="#00b2fe" stroke-width="1"/>
  <rect x="24" y="40" width="48" height="48" fill="#e6921d" stroke="#9c6312" stroke-width="2.5"/>
</svg>`;

const svg_sb = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="128" viewBox="0 0 96 128">
  <rect width="96" height="128" rx="8" fill="#ebe8cd" stroke="#37474F" stroke-width="2"/>
  <rect x="5" y="5" width="86" height="118" rx="5" fill="none" stroke="#00b2fe" stroke-width="1"/>
  <rect x="24" y="40" width="48" height="48" fill="#00b2fe" stroke="#005b82" stroke-width="2.5"/>
</svg>`;

const svg_back = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="128" viewBox="0 0 96 128">
  <rect width="96" height="128" rx="8" fill="#37474F" stroke="#ebe8cd" stroke-width="2"/>
  <circle cx="48" cy="64" r="20" fill="none" stroke="#ebe8cd" stroke-width="4"/>
</svg>`;

function svgToDataURL(svgStr) {
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgStr);
}

export const back = svgToDataURL(svg_back);

const resources = [
    svgToDataURL(svg_cb), svgToDataURL(svg_co),
    svgToDataURL(svg_sb), svgToDataURL(svg_so),
    svgToDataURL(svg_tb), svgToDataURL(svg_to)
];

const StateCard = Object.freeze({
  DISABLE: 0,
  ENABLE:  1,
  DONE:    2
});

var game = {
    items:        [],
    states:       [],
    setValue:     null,
    ready:        0,
    lastCards:    [],
    waiting:      false,
    score:        200,
    initialScore: 200,
    pairs:        2,
    groupSize:    2,
    penalty:      25,
    mode:         1,

    goBack: function(idx){
        this.setValue && this.setValue[idx] && this.setValue[idx](back);
        this.states[idx] = StateCard.ENABLE;
    },
    goFront: function(idx){
        this.setValue && this.setValue[idx] && this.setValue[idx](this.items[idx]);
        this.states[idx] = StateCard.DISABLE;
    },

    select: function(){
        if (sessionStorage.load){
            let toLoad        = JSON.parse(sessionStorage.load);
            this.items        = toLoad.items;
            this.states       = toLoad.states;
            this.lastCards    = toLoad.lastCards    || [];
            this.score        = toLoad.score;
            this.initialScore = toLoad.initialScore || 200;
            this.pairs        = toLoad.pairs;
            this.groupSize    = toLoad.groupSize    || 2;
            this.penalty      = toLoad.penalty      || 25;
            this.mode         = toLoad.mode         || 1;
        }
        else{
            if (sessionStorage.groupSize)    this.groupSize    = parseInt(sessionStorage.groupSize);
            if (sessionStorage.numPairs)     this.pairs        = parseInt(sessionStorage.numPairs);
            if (sessionStorage.penalty)      this.penalty      = parseInt(sessionStorage.penalty);
            if (sessionStorage.initialScore) this.initialScore = parseInt(sessionStorage.initialScore);
            if (sessionStorage.mode)         this.mode         = parseInt(sessionStorage.mode);

            this.pairs = Math.min(this.pairs, resources.length);
            this.score = this.initialScore;

            this.items = resources.slice();
            shuffe(this.items);
            let uniqueCards = this.items.slice(0, this.pairs);

            this.items = [];
            for (let i = 0; i < this.groupSize; i++){
                this.items = this.items.concat(uniqueCards);
            }
            shuffe(this.items);
            this.states = new Array(this.items.length);
        }
    },

    start: function(){
      let savedData = localStorage.getItem('game_to_load');
      if (savedData) {
        let data = JSON.parse(savedData);
        score = data.score;
        mode = data.mode;
        pairs = data.pairs;
        gameItems = data.gameItems;
        localStorage.removeItem('game_to_load');
        return; 
      }
        this.items.forEach((_, indx) => {
            if (this.states[indx] === StateCard.DONE){
                this.setValue && this.setValue[indx] && this.setValue[indx](this.items[indx]);
                this.ready++;
            } else {
                this.goBack(indx);
                this.ready++;
            }
        });
    },

    click: function(indx){
        if (this.states[indx] !== StateCard.ENABLE) return;
        if (this.ready < this.items.length)          return;
        if (this.waiting)                            return;
        if (this.lastCards.includes(indx))           return;

        this.goFront(indx);
        this.lastCards.push(indx);

        if (this.lastCards.length === this.groupSize){
            let firstItem = this.items[this.lastCards[0]];
            let allMatch  = this.lastCards.every(i => this.items[i] === firstItem);

            if (allMatch){
                this.pairs--;
                this.lastCards.forEach(i => this.states[i] = StateCard.DONE);
                if (this.pairs <= 0){
                    alert(`Has guanyat amb ${this.score} punts!!!!`);
                    window.location.assign("../");
                }
            } else {
                this.score -= this.penalty;
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
        this.lastCards.forEach(i => this.goBack(i));
        this.lastCards = [];

        let to_save = JSON.stringify({
            items:        this.items,
            states:       this.states,
            lastCards:    this.lastCards,
            score:        this.score,
            initialScore: this.initialScore,
            pairs:        this.pairs,
            groupSize:    this.groupSize,
            penalty:      this.penalty,
            mode:         this.mode
        });

        localStorage.save = to_save;
        alert("Partida guardada correctament!");
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

export function saveGame() {
    let saves = JSON.parse(localStorage.getItem('memory_saves')) || [null, null, null, null, null];
    let currentSlot = localStorage.getItem('current_slot');
    if (!currentSlot) {
        let slotInput = prompt("A quin slot vols guardar la partida? (Tria de l'1 al 5)");
        let slotNum = parseInt(slotInput);
        if (isNaN(slotNum) || slotNum < 1 || slotNum > 5) {
            alert("Slot no vàlid, guardat cancel·lat.");
            return;
        }
        currentSlot = slotNum;
        localStorage.setItem('current_slot', currentSlot);
    }
    let dataToSave = {
        mode: getMode(),
        score: getScore(),
        pairs: getPairs(),
        gameItems: gameItems, 
        date: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString()
    };
    saves[currentSlot - 1] = dataToSave;
    localStorage.setItem('memory_saves', JSON.stringify(saves));
    alert(`Partida guardada correctament al slot ${currentSlot}`);
}

export function getScore(){     return game.score;     }
export function getPairs(){     return game.pairs;     }
export function getMode(){      return game.mode;      }
export function getGroupSize(){ return game.groupSize; }
