"use strict"
class _line {
    constructor(x, y, graphic) {
        this.x = x;
        this.y = y;
        this.x2 = x + 1;
        this.y2 = y + 1;
        this.renderx2 = x;
        this.rendery2 = y;
        this.graphic = graphic;
    }

    render() {
        // Update line position if animation is not finished
        if (this.renderx2 != this.x2) {
            this.renderx2 += (this.x2 - this.renderx2) * 0.1;
            if (Math.abs(this.x2 - this.renderx2) < 0.01) {
                this.renderx2 = this.x2;
            }
        }
        if (this.rendery2 != this.y2) {
            this.rendery2 += (this.y2 - this.rendery2) * 0.1;
            if (Math.abs(this.y2 - this.rendery2) < 0.01) {
                this.rendery2 = this.y2;
            }
        }
        // Draw the line
        this.graphic.stroke(Math.min(255, 100 + 155 * 50/myp5.dist(this.x * line_width, this.y * line_height, myp5.mouseX, myp5.mouseY)))
        this.graphic.strokeWeight(Math.min(3, 1 + 2 * 50/myp5.dist(this.x * line_width, this.y * line_height, myp5.mouseX, myp5.mouseY)))
        this.graphic.line(this.x * line_width, this.y * line_height, this.renderx2 * line_width, this.rendery2 * line_height);
    }

    update(y, y2) {
        this.y = y;
        this.y2 = y2;
        this.x2 = this.x + 1;
        this.renderx2 = this.x;
        this.rendery2 = this.y;
    }
}

// Init line array
function initLines(graphic) {
    let lines = new Array();
    for (let y = 0; y < line_count_y; y++) {
        let row = new Array();
        for (let x = 0; x < line_count_x; x++) {
            let line = new _line(x,y,graphic);
            row.push(line);
        }
        lines.push(row);
    }
    return lines
}

// Globals
var myp5;
var start;

let header_size = 50;
let secondary_size = 30;
let offset = 250;
// 10PRINT animation
let line_count_x = 20;
let line_count_y = 10;
let line_width;
let line_height;
let interval;
let lines;
let texts = new Array("I make stuff on the internet", `Move your ${window.innerWidth <= 1024 ? "finger" : "mouse"} around or something`, "sup", "uwu whats dis");
let display_text = texts[0];
let update_x = 0;
let update_y = 0;
// Resources
let heart;
let pixelFont;
// Canvas and animation stuff
let graphic;
let state = 0;

const sketch = (p) => {
    // Load resources
    p.preload = function() {
        pixelFont = p.loadFont("static/pixelFont.ttf");
        heart = p.loadModel("static/Love.obj");  
    }

    p.setup = function() {
        // Create the canvas
        let canvas = p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
        canvas.parent("first-page");
        // Canvas settings
        p.background(0);
        p.stroke(100);
        p.strokeWeight(1);
        p.fill(255);
        p.angleMode(p.DEGREES);
        line_width = p.width / line_count_x;
        line_height = p.height / line_count_y;
        // Create the graphic for 2d animations
        graphic = p.createGraphics(p.windowWidth, p.windowHeight);
        // Graphics settings
        graphic.stroke(100);
        graphic.strokeWeight(0);
        graphic.fill(255);
        graphic.textFont(pixelFont);
        graphic.textAlign(p.CENTER, p.CENTER);
        lines = initLines(graphic);
        p.updateLines();
        // Responsive
        p.adjustSizes();
        start = p.millis();
    }

    // Changes state as time goes on
    setInterval(function() {
        state++;
        if (state >= 2) {state = 0}
        if (state == 0) {
            display_text = texts[Math.floor(Math.random() * texts.length)];
            start = p.millis();
        }
    } , 5000);

    // 10PRINT animation update
    p.updateLines = function() {
        if (state == 0) {
            if (Math.random() < 0.5) {
                lines[update_y][update_x].update(update_y, update_y + 1);
            } else {
                lines[update_y][update_x].update(update_y + 1, update_y);
            }
            update_x++;
            if (update_x >= line_count_x) {
                update_x = 0;
                update_y++;
            }
            if (update_y >= line_count_y) {
                update_y = 0;
            }
        }
        setTimeout(p.updateLines, interval);
    }

    p.draw = function() {
        // Clear everything
        p.background(0);
        graphic.clear();
        // Choose animation to play
        switch (state) {
            // 10PRINT
            case 0:
                // Random characters animation
                let str = display_text.slice(0, Math.floor((p.millis() - start) % 10000 / 80));
                for (let i=0; i < display_text.length - Math.floor((p.millis() - start) % 10000 / 80); i++) {
                    str += String.fromCharCode(33 + Math.floor(Math.random() * 57));
                }
                // Draw lines
                graphic.push();
                lines.forEach(row => {
                    row.forEach(line__ => {
                        line__.render();
                    })
                })
                graphic.pop();
                // Draw text
                graphic.textSize(header_size);
                graphic.text(str, p.width / 2, p.height / 2);
                // Secondary text
                graphic.textSize(secondary_size);
                graphic.push();
                graphic.noFill();
                graphic.stroke(255);
                graphic.strokeWeight(1);
                // Arrow
                graphic.line(graphic.width / 2 - 50, graphic.height / 2 + offset + graphic.textSize() + p.sin(p.frameCount * 3) * graphic.textSize() * 0.8, graphic.width / 2, graphic.height / 2 + offset + graphic.textSize() + 40 + p.sin(p.frameCount * 3) * graphic.textSize() * 0.8);
                graphic.line(graphic.width / 2 + 50, graphic.height / 2 + offset + graphic.textSize() + p.sin(p.frameCount * 3) * graphic.textSize() * 0.8, graphic.width / 2, graphic.height / 2 + offset + graphic.textSize() + 40 + p.sin(p.frameCount * 3) * graphic.textSize() * 0.8);
                // Reponsive text
                if (p.width < 1330) {
                    graphic.strokeWeight(0);
                    graphic.fill(255);
                }
                graphic.text("SCROLL", p.width / 2, p.height / 2 + offset - graphic.textSize() + p.sin(p.frameCount * 3) * graphic.textSize() * 0.8);
                graphic.pop();
                // Put the graphic on to the canvas
                p.translate(-p.width/2, -p.height/2);
                p.image(graphic, 0, 0);
                break;
            // Heart animation
            case 1:
                // Camera following mouse
                p.rotateX(Math.min(30, Math.max(-30, p.map(p.mouseY / p.height, 0, 1, 30, -30))));
                p.rotateY(Math.min(30, Math.max(-30, p.map(p.mouseX / p.width, 0, 1, -30, 30))));
                p.push();
                // Light following mouse
                let dirX = (p.mouseX / p.width - 0.5) * 2;
                let dirY = (p.mouseY / p.height - 0.5) * 2;
                p.directionalLight(100, 100, 100, -dirX, -dirY, -1);
                // Draw heart
                p.rotateX(180);
                p.rotateY(p.sin(p.frameCount % 90) * 360);
                p.scale(5);
                p.translate(0, -30);
                p.model(heart);
                p.pop();
                // Draw text
                graphic.push();
                graphic.textSize(header_size);
                graphic.noFill();
                graphic.stroke(200);
                graphic.strokeWeight(2);
                // Reponsive text
                if (p.width < 1330) {
                    graphic.strokeWeight(0);
                    graphic.fill(200);
                }
                graphic.textLeading(graphic.textSize() * 2);
                graphic.text("NOTHING\nMATTERS", graphic.width / 2 + p.map(p.noise(p.millis() - start), 0, 1, -graphic.textSize() * 0.1, graphic.textSize() * 0.1), graphic.height / 2 + p.map(p.noise(0, p.millis() - start), 0, 1, -graphic.textSize() * 0.1, graphic.textSize() * 0.1));
                // Secondary text
                graphic.textSize(secondary_size);
                graphic.noFill();
                graphic.stroke(200);
                graphic.strokeWeight(1);
                // Arrow
                graphic.line(graphic.width / 2 - 50, graphic.height / 2 + offset + graphic.textSize() + p.sin(p.frameCount * 3) * graphic.textSize() * 0.8, graphic.width / 2, graphic.height / 2 + offset + graphic.textSize() + 40 + p.sin(p.frameCount * 3) * graphic.textSize() * 0.8);
                graphic.line(graphic.width / 2 + 50, graphic.height / 2 + offset + graphic.textSize() + p.sin(p.frameCount * 3) * graphic.textSize() * 0.8, graphic.width / 2, graphic.height / 2 + offset + graphic.textSize() + 40 + p.sin(p.frameCount * 3) * graphic.textSize() * 0.8);
                // Reponsive text
                if (p.width < 1330) {
                    graphic.strokeWeight(0);
                    graphic.fill(200);
                }
                graphic.text("SO SCROLL", p.width / 2, p.height / 2 + offset - graphic.textSize() + p.sin(p.frameCount * 3) * graphic.textSize() * 0.8);
                graphic.pop();
                // Draw image with text
                p.translate(0, 0, 210);
                p.image(graphic, -graphic.width/2, -graphic.height/2); 
        }
    }

    // Responsive
    p.adjustSizes = function() {
        if (p.windowWidth <= 768) {
            header_size = 10;
            secondary_size = 10;
            offset = 100;
            line_count_x = 5;
            line_count_y = 5;
            interval = 50;
        } else if (p.windowWidth < 1330) {
            header_size = 20;
            secondary_size = 15;
            offset = 150;
            line_count_x = 10;
            interval = 40;
        } else {
            header_size = 50;
            secondary_size = 30;
            offset = 250;
            line_count_x = 20;
            line_count_y = 10;
            interval = 30;
        }
        line_width = p.width / line_count_x;
        line_height = p.height / line_count_y;
        texts[1] = `Move your ${window.innerWidth <= 1024 ? "finger" : "mouse"} around or something`;
    }

    p.windowResized = function() {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        graphic.resizeCanvas(p.windowWidth, p.windowHeight);
        p.adjustSizes();
    }
}