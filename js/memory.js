const resources = ['../resources/cb.svg', '../resources/co.svg',
                   '../resources/sb.svg', '../resources/so.svg',
                   '../resources/tb.svg', '../resources/to.svg'];
const back = '../resources/back.svg';

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

export function getScore(){     return game.score;     }
export function getPairs(){     return game.pairs;     }
export function getMode(){      return game.mode;      }
export function getGroupSize(){ return game.groupSize; }
