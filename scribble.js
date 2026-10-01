const scribbleSketch = (p) => {
    let canvas;
    let points = [];
    let progress = 1;

    let hovered = null;
    let lastEvent = null;
    let hoverTime = 0;

    const HOVER_DELAY = 3400; // ms of hovering before the circle starts

    p.setup = () => {
        canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.parent("scribble-container");
        canvas.elt.style.opacity = 0;

        p.stroke(23);
        p.strokeCap(p.ROUND);

        document.querySelectorAll(".project-image").forEach((el) => {
            el.addEventListener("mouseenter", (e) => {
                hovered = el;
                lastEvent = e;
                hoverTime = 0;
                points = [];
            });

            el.addEventListener("mousemove", (e) => (lastEvent = e));

            el.addEventListener("mouseleave", () => {
                hovered = null;
                canvas.elt.style.transition = "opacity 0.6s";
                canvas.elt.style.opacity = 0;
            });
        });
    };

    p.draw = () => {
        p.clear();

        if (hovered) {
            hoverTime += p.deltaTime;

            if (hoverTime > HOVER_DELAY && points.length === 0) {
                points = createCircle(hovered, lastEvent);
                progress = 0;
                canvas.elt.style.transition = "opacity 0.15s";
                canvas.elt.style.opacity = 0.28;
            }
        }

        progress = Math.min(1, progress + p.deltaTime * 0.002);

        const end = Math.floor((points.length - 1) * progress);

        for (let i = 1; i <= end; i++) {
            // Line width tapers at both ends.
            p.strokeWeight(0.5 + 1.5 * Math.sin(Math.PI * i / points.length));
            p.line(points[i - 1].x, points[i - 1].y, points[i].x, points[i].y);
        }
    };

    // Everything is randomized per hover, so each circle is different.
    function createCircle(el, e) {
        const rect = el.getBoundingClientRect();
        const mx = e.clientX - (rect.left + rect.width / 2);
        const my = e.clientY - (rect.top + rect.height / 2);

        const cx = rect.left + rect.width / 2 + p.random(-3, 3);
        const cy = rect.top + rect.height / 2 + p.random(-3, 3);
        const rx = rect.width / 2 + 8;
        const ry = rect.height / 2 + 8;

        const start = Math.atan2(my, mx) + p.random(-0.5, 0.5);
        const sweep = p.TWO_PI * p.random(1.04, 1.2); // overshoots the start
        const tilt = p.random(-0.2, 0.2);
        const drift = p.random(-0.1, 0.1);
        const seed = p.random(1000);

        const result = [];

        for (let i = 0; i <= 120; i++) {
            const t = i / 120;
            const angle = start + t * sweep;
            const r = 1 + drift * t + (p.noise(seed + t * 1.5) - 0.5) * 0.12;

            const dx = p.cos(angle) * rx * r;
            const dy = p.sin(angle) * ry * r;

            result.push({
                x: cx + dx * p.cos(tilt) - dy * p.sin(tilt),
                y: cy + dx * p.sin(tilt) + dy * p.cos(tilt)
            });
        }

        return result;
    }

    p.windowResized = () => p.resizeCanvas(p.windowWidth, p.windowHeight);
};

new p5(scribbleSketch);