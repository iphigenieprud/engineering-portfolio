let canvas;

let currentCharacter = 0;
let nextCharacterTime = 0;

function setup() {

    const container = document.getElementById("canvas-container");

    canvas = createCanvas(
        container.offsetWidth,
        140
    );

    canvas.parent("canvas-container");

    textFont("IBM Plex Sans");
    textStyle(BOLD);
    textSize(20);
    textAlign(CENTER, CENTER);

    nextCharacterTime = millis() + 400;
}


function windowResized() {

    const container = document.getElementById("canvas-container");

    resizeCanvas(
        container.offsetWidth,
        140
    );

}


function typewriter(string) {

    clear();

    let displayedText =
        string.substring(0, currentCharacter);


    /*
       Center the text relative to the
       actual canvas width.
    */

    const centerX = width / 2;
    const centerY = height - 40;


    text(
        displayedText,
        centerX,
        centerY
    );


    // Blinking cursor
    let cursorX =
        centerX +
        textWidth(displayedText) / 2 +
        5;


    if (
        currentCharacter < string.length ||
        frameCount % 60 < 30
    ) {

        text(
            "|",
            cursorX,
            centerY
        );

    }


    // Typewriter timing
    if (
        currentCharacter < string.length &&
        millis() >= nextCharacterTime
    ) {

        currentCharacter++;

        let delay =
            random(45, 130);


        // Slightly longer pause after spaces
        if (
            string[currentCharacter - 1] === " "
        ) {

            delay += random(40, 100);

        }


        // Occasional natural pause
        if (random() < 0.08) {

            delay += random(150, 350);

        }


        nextCharacterTime =
            millis() + delay;

    }

}


function draw() {

    typewriter(
        "WELCOME TO MY PORTFOLIO"
    );

}