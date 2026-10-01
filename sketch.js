let currentCharacter = 0;
let nextCharacterTime = 0;

function setup() {
    createCanvas(windowWidth, 200);

    textFont("IBM Plex Sans");
    textStyle(BOLD);
    textSize(20);
    textAlign(CENTER, CENTER);

    nextCharacterTime = millis() + 400;
}

function windowResized() {
    resizeCanvas(windowWidth, 200);
}

function typewriter(string) {
    clear();

    let displayedText = string.substring(0, currentCharacter);

    text(displayedText, width / 2, height - 50);

    // Blinking cursor
    let cursorX =
        width / 2 +
        textWidth(displayedText) / 2 +
        5;

    if (currentCharacter < string.length || frameCount % 60 < 30) {
        text("|", cursorX, height - 50);
    }

    // Type each character at a slightly different speed
    if (
        currentCharacter < string.length &&
        millis() >= nextCharacterTime
    ) {
        currentCharacter++;

        let delay = random(45, 130);

        // Slightly longer pause after spaces
        if (string[currentCharacter - 1] === " ") {
            delay += random(40, 100);
        }

        // Occasional natural pause
        if (random() < 0.08) {
            delay += random(150, 350);
        }

        nextCharacterTime = millis() + delay;
    }
}

function draw() {
    let introText = "WELCOME TO MY PORTFOLIO";

    typewriter(introText);
}