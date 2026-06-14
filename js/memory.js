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
    items:     [],
    states:    [],
    setValue:  null,
    ready:     0,
    lastCards: [],
    waiting:   false,
    score:     200,
    pairs:     2,
    groupSize: 2,

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
            let toLoad = JSON.parse(sessionStorage.load);
            this.items     = toLoad.items;
            this.states    = toLoad.states;
            this.lastCards = toLoad.lastCards || [];
            this.score     = toLoad.score;
            this.pairs     = toLoad.pairs;
            this.groupSize = toLoad.groupSize || 2;
        }
        else{
            if (sessionStorage.groupSize) this.groupSize = parseInt(sessionStorage.groupSize);
            if (sessionStorage.numPairs)  this.pairs     = parseInt(sessionStorage.numPairs);

            this.pairs = Math.min(this.pairs, resources.length);

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
            if (this.states[indx] === StateCard.DISABLE ||
                this.states[indx] === StateCard.DONE){
                this.ready++;
            } else {
                setTimeout(() => {
                    this.ready++;
                    this.goBack(indx);
                }, 1000 + 100 * indx);
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

        localStorage.save = to_save;

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
