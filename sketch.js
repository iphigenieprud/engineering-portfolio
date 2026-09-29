let initializing = false;
let coding = false;
let finished = false;

let initTime = 0;
let codeTime = 0;

let glitchLines = [];

let scanY = 0;

let codeLines = [
    "IPHIGÉNIE PRUD'HOMME",
    "COMPUTER ENGINEERING",
    "HARDWARE / SOFTWARE / ROBOTICS"
];

let typingSpeed = 90;


function setup() {

    let container =
        document.getElementById("p5-background");

    let canvas = createCanvas(
        container.clientWidth,
        container.clientHeight
    );

    canvas.parent("p5-background");

    textFont("monospace");

    createGlitchLines();

    scanY = height * 0.2;

    background(0);
}


function draw() {

    background(0);

    drawBackground();

    if (initializing) {

        drawInitializing();

    } else if (coding) {

        drawCodeScene();

    } else if (finished) {

        drawFinished();

    } else {

        drawStandby();

    }

    drawHUD();
}


/* =========================
   START ANIMATION
========================= */

function mouseMoved() {

    if (
        !initializing &&
        !coding &&
        !finished
    ) {

        initializing = true;

        initTime = millis();
    }
}


/* =========================
   BACKGROUND
========================= */

function drawBackground() {

    // Very subtle grid

    stroke(255, 10);
    strokeWeight(1);

    let gridSize = 40;

    for (
        let x = 0;
        x < width;
        x += gridSize
    ) {

        line(
            x,
            0,
            x,
            height
        );
    }

    for (
        let y = 0;
        y < height;
        y += gridSize
    ) {

        line(
            0,
            y,
            width,
            y
        );
    }

    noStroke();


    // Moving scan line

    scanY += 0.5;

    if (scanY > height) {
        scanY = 0;
    }

    stroke(255, 18);

    line(
        0,
        scanY,
        width,
        scanY
    );

    noStroke();


    // Small moving interface fragments

    for (
        let i = 0;
        i < glitchLines.length;
        i++
    ) {

        let lineData = glitchLines[i];

        lineData.x += lineData.speed;

        if (
            lineData.x >
            width + lineData.width
        ) {

            lineData.x =
                -lineData.width;

            lineData.y =
                random(height);
        }

        if (random(1) < 0.05) {

            stroke(
                255,
                random(10, 30)
            );

            line(
                lineData.x,
                lineData.y,
                lineData.x +
                    lineData.width,
                lineData.y
            );
        }
    }

    noStroke();
}


/* =========================
   STANDBY
========================= */

function drawStandby() {

    textFont("monospace");

    textAlign(
        CENTER,
        CENTER
    );

    let pulse = map(
        sin(millis() * 0.003),
        -1,
        1,
        100,
        220
    );

    fill(
        255,
        pulse
    );

    textSize(
        min(width * 0.015, 15)
    );

    text(
        "MOVE CURSOR TO INITIALIZE",
        width / 2,
        height / 2
    );
}


/* =========================
   INITIALIZATION
========================= */

function drawInitializing() {

    let elapsed =
        millis() - initTime;

    textFont("monospace");

    textAlign(
        CENTER,
        CENTER
    );

    let dotCount =
        min(
            floor(elapsed / 350) + 1,
            3
        );

    let dots =
        ".".repeat(dotCount);

    fill(255);

    textSize(
        min(width * 0.018, 18)
    );

    text(
        "INITIALIZING" + dots,
        width / 2,
        height / 2
    );


    // Small progress line

    let progress =
        constrain(
            elapsed / 1800,
            0,
            1
        );

    let barWidth =
        min(
            width * 0.25,
            220
        );

    stroke(255, 90);

    line(
        width / 2 - barWidth / 2,
        height / 2 + 28,
        width / 2 - barWidth / 2 +
            barWidth * progress,
        height / 2 + 28
    );

    noStroke();


    if (elapsed > 1800) {

        initializing = false;

        coding = true;

        codeTime = millis();
    }
}


/* =========================
   MAIN TYPING SCENE
========================= */

function drawCodeScene() {

    let elapsed =
        millis() - codeTime;

    let x =
        width * 0.10;

    let titleSize =
        min(
            width * 0.040,
            42
        );

    let normalSize =
        min(
            width * 0.017,
            18
        );

    let smallSize =
        min(
            width * 0.012,
            12
        );

    let lineSpacing =
        normalSize * 1.8;

    let startY =
        height * 0.40;


    // Small label

    textAlign(
        LEFT,
        CENTER
    );

    textFont("monospace");

    textSize(smallSize);

    fill(255, 100);

    text(
        "IDENTITY",
        x,
        startY - titleSize * 1.7
    );


    // Determine how many characters to show

    let charactersToShow =
        floor(
            elapsed / typingSpeed
        );

    let remaining =
        charactersToShow;

    let cursorX = x;
    let cursorY = startY;
    let cursorSize = titleSize;


    for (
        let i = 0;
        i < codeLines.length;
        i++
    ) {

        let lineText =
            codeLines[i];

        let amount =
            constrain(
                remaining,
                0,
                lineText.length
            );

        let typed =
            lineText.substring(
                0,
                amount
            );

        remaining -= amount;


        let size;

        if (i === 0) {

            size = titleSize;

        } else {

            size = normalSize;
        }


        let y =
            startY +
            i * lineSpacing;


        drawGlitchText(
            typed,
            x,
            y,
            size,
            i === 0
        );


        if (
            amount <
            lineText.length
        ) {

            cursorX =
                x +
                textWidth(typed);

            cursorY = y;

            cursorSize = size;

            break;
        }


        cursorX =
            x +
            textWidth(typed);

        cursorY = y;

        cursorSize = size;
    }


    drawCursor(
        cursorX,
        cursorY,
        cursorSize
    );


    // Small lower information

    if (
        charactersToShow >
        codeLines[0].length
    ) {

        drawLowerInterface();
    }


    let totalTypingTime =
        codeLines.join("").length *
        typingSpeed;


    if (
        elapsed >
        totalTypingTime + 1800
    ) {

        finished = true;

        coding = false;
    }
}


/* =========================
   FINISHED SCREEN
========================= */

function drawFinished() {

    let x =
        width * 0.10;

    let titleSize =
        min(
            width * 0.040,
            42
        );

    let normalSize =
        min(
            width * 0.017,
            18
        );

    let smallSize =
        min(
            width * 0.012,
            12
        );

    let lineSpacing =
        normalSize * 1.8;

    let startY =
        height * 0.40;


    textFont("monospace");

    textAlign(
        LEFT,
        CENTER
    );


    // Label

    textSize(smallSize);

    fill(255, 100);

    text(
        "IDENTITY",
        x,
        startY - titleSize * 1.7
    );


    // Name

    textSize(titleSize);

    fill(255);

    text(
        codeLines[0],
        x,
        startY
    );


    // Description

    textSize(normalSize);

    fill(255, 170);

    text(
        codeLines[1],
        x,
        startY + lineSpacing
    );

    text(
        codeLines[2],
        x,
        startY + lineSpacing * 2
    );


    drawLowerInterface();
}


/* =========================
   LOWER INTERFACE
========================= */

function drawLowerInterface() {

    let smallSize =
        min(
            width * 0.012,
            12
        );

    let y =
        height * 0.80;

    let left =
        width * 0.10;

    let right =
        width * 0.90;


    stroke(255, 45);

    line(
        left,
        y,
        right,
        y
    );

    noStroke();


    textFont("monospace");

    textSize(smallSize);

    textAlign(
        LEFT,
        CENTER
    );

    fill(255, 90);

    text(
        "SYSTEM ONLINE",
        left,
        y + 20
    );


    textAlign(
        RIGHT,
        CENTER
    );

    fill(255, 90);

    text(
        "2026",
        right,
        y + 20
    );
}


/* =========================
   HUD
========================= */

function drawHUD() {

    let padding =
        min(
            width * 0.035,
            25
        );

    let corner =
        min(
            width * 0.035,
            25
        );


    stroke(255, 65);

    strokeWeight(1);

    noFill();


    // Top-left

    line(
        padding,
        padding,
        padding + corner,
        padding
    );

    line(
        padding,
        padding,
        padding,
        padding + corner
    );


    // Top-right

    line(
        width - padding - corner,
        padding,
        width - padding,
        padding
    );

    line(
        width - padding,
        padding,
        width - padding,
        padding + corner
    );


    // Bottom-left

    line(
        padding,
        height - padding,
        padding + corner,
        height - padding
    );

    line(
        padding,
        height - padding - corner,
        padding,
        height - padding
    );


    // Bottom-right

    line(
        width - padding - corner,
        height - padding,
        width - padding,
        height - padding
    );

    line(
        width - padding,
        height - padding - corner,
        width - padding,
        height - padding
    );


    noStroke();


    // Top information

    textFont("monospace");

    textSize(
        min(width * 0.010, 10)
    );


    textAlign(
        LEFT,
        TOP
    );

    fill(255, 100);

    text(
        "SYSTEM 01",
        padding + 8,
        padding + 8
    );


    textAlign(
        RIGHT,
        TOP
    );

    text(
        "PLAYER 01",
        width - padding - 8,
        padding + 8
    );
}


/* =========================
   TEXT GLITCH
========================= */

function drawGlitchText(
    textString,
    x,
    y,
    size,
    isTitle
) {

    textSize(size);

    let glitching =
        random(1) < 0.01;


    if (glitching) {

        let offset =
            random(-2, 2);


        fill(255, 45);

        text(
            textString,
            x + offset,
            y
        );


        fill(255);

        text(
            textString,
            x,
            y
        );


        if (
            random(1) < 0.2
        ) {

            drawGlitchSlice(
                textString,
                x,
                y,
                size
            );
        }

    } else {

        if (isTitle) {

            fill(255);

        } else {

            fill(255, 170);
        }

        text(
            textString,
            x,
            y
        );
    }
}


/* =========================
   GLITCH SLICE
========================= */

function drawGlitchSlice(
    textString,
    x,
    y,
    size
) {

    let textWidthValue =
        textWidth(textString);

    let sliceY =
        y +
        random(
            -size * 0.25,
            size * 0.25
        );

    let sliceHeight =
        random(1, 2);

    let offset =
        random(-3, 3);


    drawingContext.save();

    drawingContext.beginPath();

    drawingContext.rect(
        x - 3,
        sliceY - sliceHeight,
        textWidthValue + 6,
        sliceHeight * 2
    );

    drawingContext.clip();


    fill(255);

    text(
        textString,
        x + offset,
        y
    );


    drawingContext.restore();
}


/* =========================
   CURSOR
========================= */

function drawCursor(
    x,
    y,
    size
) {

    if (
        floor(
            millis() / 500
        ) % 2 === 0
    ) {

        stroke(255);

        strokeWeight(1.5);

        line(
            x + 4,
            y - size * 0.45,
            x + 4,
            y + size * 0.45
        );

        noStroke();
    }
}


/* =========================
   GLITCH ELEMENTS
========================= */

function createGlitchLines() {

    glitchLines = [];


    for (
        let i = 0;
        i < 8;
        i++
    ) {

        glitchLines.push({

            x: random(width),

            y: random(height),

            width: random(20, 120),

            speed: random(
                0.2,
                0.7
            )

        });
    }
}


/* =========================
   RESPONSIVE
========================= */

function windowResized() {

    let container =
        document.getElementById(
            "p5-background"
        );


    resizeCanvas(
        container.clientWidth,
        container.clientHeight
    );


    createGlitchLines();
}