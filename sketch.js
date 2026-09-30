
let currentCharacter = 0;

function setup() {
    createCanvas(windowWidth, windowHeight);
    textFont("IBM Plex Sans");
    textStyle(BOLD);
    textSize(20);
    textAlign(CENTER, CENTER);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function typewriter(string) {
    clear();

    let displayed_text = string.substring(0, currentCharacter);
    text(displayed_text, width / 2, height / 4);

    // Blinking cursor
    let cursorX = width / 2 + textWidth(displayed_text) / 2 + 5;

    if (currentCharacter < string.length || frameCount % 60 < 30) {
        text("|", cursorX, height / 4);
    }

    if (frameCount % 10 === 0 && currentCharacter < string.length) {
        currentCharacter++;
    }
}

function draw() {
    let intro_text = "WELCOME TO MY PORTFOLIO";
    typewriter(intro_text);
}