import {$} from "../library/jquery-4.0.0.slim.module.min.js";
import {
    clickCard, gameItems, selectCards, startGame, initCard, saveGame,
    getScore, getPairs, getMode, getGroupSize, back as BACK_SRC
} from "./memory.js";

const BACK_SRC = '../resources/back.svg';
const CANVAS_W = 800;
const CANVAS_H = 600;
const HUD_H    = 50;
const c_w      = 90;
const c_h      = 120;
const gap      = 10;

let gameEl    = $('#game');
let ctx       = gameEl[0].getContext('2d');
let resources = {};
let cards     = [];
const e_click = {click: false, x: -1, y: -1};
let key       = null;
let idxSel    = -1;

if (ctx){
    gameEl.attr("width",  CANVAS_W);
    gameEl.attr("height", CANVAS_H);
    start();
    update();
}

function getGridLayout(numCards){
    let cols = Math.ceil(Math.sqrt(numCards * 1.3));
    cols = Math.min(cols, Math.floor(CANVAS_W / (c_w + gap)));
    cols = Math.max(cols, 1);
    return { cols, rows: Math.ceil(numCards / cols) };
}

function start(){
    selectCards();
    
    cards = gameItems.map(() => ({texture: BACK_SRC}));
    loadCardResource(BACK_SRC);
    
    gameItems.forEach(src => loadCardResource(src));

    let {cols, rows} = getGridLayout(cards.length);
    let gridW  = cols * c_w + (cols - 1) * gap;
    let gridH  = rows * c_h + (rows - 1) * gap;
    let startX = Math.floor((CANVAS_W - gridW) / 2);
    let startY = HUD_H + Math.floor((CANVAS_H - HUD_H - gridH) / 2);

    cards.forEach((card, indx) => {
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
    let saveBtn = document.getElementById('save');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            saveGame();
        });
    }

    startGame();
}
}

function update(){
    checkInput();
    draw();
    requestAnimationFrame(update);
}

function loadCardResource(src){
    if (!resources[src]){
        let res = {image: null, ready: false};
        res.image     = new Image();
        res.image.src = src;
        res.image.onload = () => res.ready = true;
        resources[src] = res;
    }
}

function drawHUD(){
    let score     = getScore();
    let pairs     = getPairs();
    let mode      = getMode();
    let groupSize = getGroupSize();
    let gsLabel   = ['', '', 'Parelles', 'Trios', 'Quartets'][groupSize] || `×${groupSize}`;

    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    ctx.fillRect(0, 0, CANVAS_W, HUD_H);

    ctx.fillStyle    = '#ffffff';
    ctx.font         = 'bold 18px Arial';
    ctx.textBaseline = 'middle';

    ctx.textAlign = 'left';
    ctx.fillText(`Mode ${mode}  ·  ${gsLabel}  ·  Grups restants: ${pairs}`, 14, HUD_H / 2);

    ctx.textAlign = 'right';
    ctx.fillStyle = score > 100 ? '#4af' : '#f84';
    ctx.fillText(`Puntuació: ${score}`, CANVAS_W - 14, HUD_H / 2);

    ctx.restore();
}

function draw(){
    ctx.reset();

    cards.forEach((card, indx) => {
        let res = resources[card.texture];
        if (!res || !res.ready) return;
        let {xMin, yMin} = card.position;

        if (idxSel === indx){
            ctx.save();
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth   = 3;
            ctx.strokeRect(xMin - 3, yMin - 3, c_w + 6, c_h + 6);
            ctx.restore();
        }
        ctx.drawImage(res.image, xMin, yMin, c_w, c_h);
    });

    drawHUD();
}

function moveSelection(delta){
    if (idxSel < 0) { idxSel = 0; return; }
    idxSel = ((idxSel + delta) % cards.length + cards.length) % cards.length;
}
function moveSelectionGrid(delta){
    let {cols} = getGridLayout(cards.length);
    if (idxSel < 0) { idxSel = 0; return; }
    idxSel = Math.max(0, Math.min(idxSel + delta * cols, cards.length - 1));
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
            case "Escape":     saveGame();            break;
            case "ArrowRight": moveSelection(1);      break;
            case "ArrowLeft":  moveSelection(-1);     break;
            case "ArrowDown":  moveSelectionGrid(1);  break;
            case "ArrowUp":    moveSelectionGrid(-1); break;
            case "Enter":
                if (idxSel >= 0) clickCard(idxSel);
                break;
            default:
                console.warn("Tecla " + key + " no reconeguda.");
        }
    }
    e_click.click = key = false;
}
