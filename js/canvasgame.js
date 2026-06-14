import {$} from "../library/jquery-4.0.0.slim.module.min.js";
import {clickCard, gameItems, selectCards, startGame, initCard, saveGame} from "./memory.js";

let gameEl    = $('#game');
let ctx       = gameEl[0].getContext('2d');
let resources = {};
let cards     = [];
const e_click = {click: false, x: -1, y: -1};
let key       = null;
const c_w = 96;
const c_h = 128;
const gap = 10;
let idxSel = -1;   // -1 = sense selecció per teclat

if (ctx){
    gameEl.attr("width",  800);
    gameEl.attr("height", 600);
    start();
    update();
}

/**
 * Calcula el layout en graella òptim per a numCards cartes.
 * Retorna { cols, rows }.
 */
function getGridLayout(numCards){
    let cols = Math.ceil(Math.sqrt(numCards * 1.3));   // Lleugerament més ample que alt
    cols = Math.min(cols, Math.floor(800 / (c_w + gap)));
    cols = Math.max(cols, 1);
    return { cols, rows: Math.ceil(numCards / cols) };
}

function start(){
    selectCards();
    cards = gameItems.map(c => ({texture: c}));
    loadCardResource("../resources/back.png");

    let {cols, rows} = getGridLayout(cards.length);
    // Centrar la graella dins del canvas
    let startX = Math.floor((800 - cols * (c_w + gap) + gap) / 2);
    let startY = Math.floor((600 - rows * (c_h + gap) + gap) / 2);

    cards.forEach((card, indx) => {
        loadCardResource(card.texture);
        initCard(val => card.texture = val);

        let col = indx % cols;
        let row = Math.floor(indx / cols);
        card.position = {
            xMin: startX + col * (c_w + gap),
            xMax: startX + col * (c_w + gap) + c_w,
            yMin: startY + row * (c_h + gap),
            yMax: startY + row * (c_h + gap) + c_h
        };
        card.onClick = function(x, y){
            return x >= this.position.xMin && x <= this.position.xMax &&
                   y >= this.position.yMin && y <= this.position.yMax;
        };
    });

    gameEl.on('click', function(e){
        e_click.click = true;
        e_click.x = e.pageX - this.offsetLeft;
        e_click.y = e.pageY - this.offsetTop;
    });
    $(document).keydown(e => key = e.key);
    startGame();
}

function update(){
    checkInput();
    draw();
    requestAnimationFrame(update);
}

function loadCardResource(src){
    if (!resources[src]){
        let res = {image: null, ready: false};
        res.image = new Image();
        res.image.src = src;
        res.image.onload = () => res.ready = true;
        resources[src] = res;
    }
}

function draw(){
    ctx.reset();
    cards.forEach((card, indx) => {
        let res = resources[card.texture];
        if (!res || !res.ready) return;
        let {xMin, yMin} = card.position;

        // Ressaltar carta activa per teclat (marc daurat)
        if (idxSel === indx){
            ctx.save();
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth   = 3;
            ctx.strokeRect(xMin - 3, yMin - 3, c_w + 6, c_h + 6);
            ctx.restore();
        }
        ctx.drawImage(res.image, xMin, yMin, c_w, c_h);
    });
}

/** Mou la selecció de teclat linealment (esquerra/dreta) */
function moveSelection(delta){
    if (idxSel < 0) { idxSel = 0; return; }
    idxSel = ((idxSel + delta) % cards.length + cards.length) % cards.length;
}

/** Mou la selecció de teclat per files de la graella (amunt/avall) */
function moveSelectionGrid(delta){
    let {cols} = getGridLayout(cards.length);
    if (idxSel < 0) { idxSel = 0; return; }
    let next = idxSel + delta * cols;
    idxSel = Math.max(0, Math.min(next, cards.length - 1));
}

function checkInput(){
    if (e_click.click){
        cards.some((card, indx) => {
            let hit = card.onClick(e_click.x, e_click.y);
            if (hit) clickCard(indx);
            return hit;
        });
    }
    if (key){
        switch(key){
            case "Escape":      saveGame();            break;
            case "ArrowRight":  moveSelection(1);      break;
            case "ArrowLeft":   moveSelection(-1);     break;
            case "ArrowDown":   moveSelectionGrid(1);  break;
            case "ArrowUp":     moveSelectionGrid(-1); break;
            case "Enter":
                if (idxSel >= 0) clickCard(idxSel);
                break;
            default:
                console.warn("Tecla " + key + " no reconeguda.");
        }
    }
    e_click.click = key = false;
}
