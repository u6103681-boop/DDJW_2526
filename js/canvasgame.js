import {
    clickCard, gameItems, selectCards, startGame, initCard, saveGame,
    getScore, getPairs, getMode, getGroupSize, back as BACK_SRC
} from "./memory.js";

const CANVAS_W = 800;
const CANVAS_H = 600;
const HUD_H    = 50;
const c_w      = 90;
const c_h      = 120;
const gap      = 10;

let canvas, ctx;
let cardsMap = [];

function start() {
    canvas = document.getElementById('game');
    if (!canvas) {
        console.error("No se ha encontrado el canvas con id 'game'");
        return;
    }
    ctx = canvas.getContext('2d');

    selectCards();

    let saveBtn = document.getElementById('save');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            saveGame();
        });
    }

    let totalCards = gameItems.length;
    let cols = Math.ceil(Math.sqrt(totalCards));
    let rows = Math.ceil(totalCards / cols);

    let gridW = cols * c_w + (cols - 1) * gap;
    let gridH = rows * c_h + (rows - 1) * gap;

    let marginX = (CANVAS_W - gridW) / 2;
    let marginY = HUD_H + (CANVAS_H - HUD_H - gridH) / 2;

    for (let i = 0; i < totalCards; i++) {
        let c = i % cols;
        let r = Math.floor(i / cols);
        let x = marginX + c * (c_w + gap);
        let y = marginY + r * (c_h + gap);

        let imgObj = new Image();
        
        let cardObj = { x: x, y: y, img: imgObj };
        cardsMap.push(cardObj);

        initCard((src) => {
            cardObj.img.src = src;
        });
    }

    canvas.addEventListener('click', (e) => {
        let rect = canvas.getBoundingClientRect();
        let mouseX = e.clientX - rect.left;
        let mouseY = e.clientY - rect.top;

        for (let i = 0; i < cardsMap.length; i++) {
            let card = cardsMap[i];
            if (mouseX >= card.x && mouseX <= card.x + c_w &&
                mouseY >= card.y && mouseY <= card.y + c_h) {
                clickCard(i);
                break;
            }
        }
    });

    startGame();
    
    requestAnimationFrame(drawLoop);
}

function drawLoop() {
    ctx.fillStyle = '#263a3a'; 
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 0, CANVAS_W, HUD_H);

    ctx.fillStyle = 'white';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    
    let currentMode = getMode() || 1;
    let currentPairs = getPairs() || 0;
    ctx.fillText(`Mode ${currentMode} - Grups restants: ${currentPairs}`, 20, HUD_H / 2);

    ctx.fillStyle = '#00b2fe';
    ctx.textAlign = 'right';
    let currentScore = getScore() || 0;
    ctx.fillText(`Puntuació: ${currentScore}`, CANVAS_W - 20, HUD_H / 2);

    for (let i = 0; i < cardsMap.length; i++) {
        let card = cardsMap[i];
        
        if (card.img.complete && card.img.naturalWidth !== 0) {
            ctx.drawImage(card.img, card.x, card.y, c_w, c_h);
        } else {
            ctx.fillStyle = '#37474F';
            ctx.fillRect(card.x, card.y, c_w, c_h);
        }
    }

    requestAnimationFrame(drawLoop);
}

window.addEventListener('load', start);
