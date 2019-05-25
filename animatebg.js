var canvas
var ylength = 10;
var length = 20;
var line_height;
var line_width;

class stroke_ {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.x2 = x + 1;
        this.y2 = y + 1;
        this.renderx2 = x;
        this.rendery2 = y;
    }

    render() {
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
        graphic.stroke(Math.min(255, 100 + 155 * 50/dist(this.x * line_width, this.y * line_height, mouseX, mouseY)))
        graphic.strokeWeight(Math.min(4, 1 + 3 * 50/dist(this.x * line_width, this.y * line_height, mouseX, mouseY)))
        graphic.line(this.x * line_width, this.y * line_height, this.renderx2 * line_width, this.rendery2 * line_height);
    }

    update(y, y2) {
        this.y = y;
        this.y2 = y2;
        this.x2 = this.x + 1;
        this.renderx2 = this.x;
        this.rendery2 = this.y;
    }
}

function setup() {
    pixelFont = loadFont("pixelFont.ttf");
    canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    canvas.parent("first-page");
    background(0);
    stroke(100);
    strokeWeight(1);
    angleMode(DEGREES);
    if (windowWidth <= 768) {
        length = 5;
        ylength = 5;
        interval = 50;
    }
    line_width = width / length;
    line_height = height / ylength;
    heart = loadModel("Love.obj");
    graphic = createGraphics(windowWidth, windowHeight);
}

// Init strokes array
function initStrokes() {
    let strokes = Array();
    for (let y = 0; y < ylength; y++) {
        let row = Array();
        for (let x = 0; x < length; x++) {
            let l = new stroke_(x,y);
            row.push(l);
        }
        strokes.push(row);
    }
    return strokes
}

var pixelFont;
var state = 0;
var strokes = initStrokes();
var interval = 30;
var last_updated = -interval;
var update_x = 0;
var update_y = 0;
var heart;
var graphic;
var texts = Array("I make stuff on the internet", "Move your mouse around or something", "sup", "uwu whats dis");
var original = texts[0];

setInterval(function() {
    if (state == 1) {
        state = 0;
        original = texts[Math.floor(Math.random() * texts.length)];
    } else{
        state = 1;
    }
}, 5000);

function draw() {
    let offset = 250;
    console.log(`%cCurrent FPS: %c${frameRate()}`, "color:black;background:red;", "color:white;background:black;")
    resizeCanvas(windowWidth,windowHeight);
    // Resize graphic
    if (graphic.width !== width || graphic.height !== height) {
        graphic.remove();
        graphic = createGraphics(windowWidth, windowHeight);
    }
    background(0);
    graphic.background(0);
    switch (state) {
        case 0:
            translate(-width/2,-height/2)
            line_height = height / ylength;
            line_width = width / length;
            if (millis() - last_updated >= interval) {
                if (update_y < ylength) {
                    if (Math.random() > 0.5) {
                        strokes[update_y][update_x].update(update_y, update_y + 1);
                    } else {
                        strokes[update_y][update_x].update(update_y + 1, update_y);
                    }
                    last_updated = millis();
                    update_x++;
                    if (update_x >= length) {
                        update_x = 0;
                        update_y++;
                    } 
                } else {
                    update_y = 0;
                }
            }
            for (let y = 0; y < ylength; y++) {
                for (let x = 0; x < length; x++) {
                    strokes[y][x].render();
                }
            }
            let str = original.slice(0, Math.floor(millis() % 10000 / 80));
            for (let i=0; i < original.length - Math.floor(millis() % 10000 / 80); i++) {
                str += String.fromCharCode(33 + Math.floor(Math.random() * 57));
            }
            graphic.push();
            graphic.textFont(pixelFont);
            graphic.textSize(50);
            if (width < 1330) {
                graphic.textSize(20);
            }
            if (width < 768) {
                graphic.textSize(10);
            }
            graphic.textAlign(CENTER, CENTER);
            graphic.noStroke();
            graphic.fill(255);
            graphic.text(str, graphic.width / 2, graphic.height / 2);
            graphic.noFill();
            graphic.stroke(255);
            graphic.strokeWeight(1);
            graphic.textSize(30);
            if (width < 1330) {
                graphic.fill(200);
                graphic.noStroke();
                graphic.textSize(5);
                offset = 150;
            }
            if (width < 768) {
                offset = 100;
            }
            graphic.text("SCROLL", graphic.width / 2, graphic.height / 2 + offset - graphic.textSize() * 2 + sin(frameCount * 3) * 20);
            graphic.stroke(200);
            graphic.line(graphic.width / 2 - 50, graphic.height / 2 + offset + sin(frameCount * 3) * 20, graphic.width / 2, graphic.height / 2 + offset + 40 + sin(frameCount * 3) * 20);
            graphic.line(graphic.width / 2 + 50, graphic.height / 2 + offset + sin(frameCount * 3) * 20, graphic.width / 2, graphic.height / 2 + offset + 40 + sin(frameCount * 3) * 20);
            graphic.pop();
            image(graphic, 0, 0);
            break;
        case 1:
            rotateX(map(height / 2 - mouseY, height / 2, -height / 2, 30, -30));
            rotateY(map(-(width / 2 - mouseX), width / 2, -width / 2, 30, -30));
            push();
            let dirX = (mouseX / width - 0.5) * 2;
            let dirY = (mouseY / height - 0.5) * 2;
            directionalLight(100, 100, 100, -dirX, -dirY, -1)
            rotateX(180);
            rotateY(sin(frameCount % 90) * 360);
            scale(5)
            if (width < 768) {scale(1);}
            translate(0, -30);
            model(heart);
            pop();
            graphic.push();
            graphic.clear();
            graphic.noFill();
            graphic.stroke(200);
            graphic.strokeWeight(2);
            graphic.textAlign(CENTER, CENTER);
            graphic.textSize(50);
            graphic.textLeading(80);
            if (width < 768) {
                graphic.textSize(10);
                graphic.strokeWeight(1);
                graphic.textLeading(20);
            }
            graphic.textFont(pixelFont);
            graphic.text("NOTHING\nMATTERS", graphic.width / 2 + map(noise(millis()), 0, 1, -5, 10), graphic.height / 2 + map(noise(0, millis()), 0, 1, -5, 5));
            graphic.noFill();
            graphic.stroke(255);
            graphic.strokeWeight(1);
            graphic.textSize(30);
            if (width < 1330) {
                graphic.fill(200);
                graphic.noStroke();
                graphic.textSize(5);
                offset = 150;
            }
            if (width < 768) {
                offset = 100;
            }
            graphic.text("NOW SCROLL", graphic.width / 2, graphic.height / 2 + offset - graphic.textSize() * 2 + sin(frameCount * 3) * 20);
            graphic.stroke(200);
            graphic.line(graphic.width / 2 - 50, graphic.height / 2 + offset + sin(frameCount * 3) * 20, graphic.width / 2, graphic.height / 2 + offset + 40 + sin(frameCount * 3) * 20);
            graphic.line(graphic.width / 2 + 50, graphic.height / 2 + offset + sin(frameCount * 3) * 20, graphic.width / 2, graphic.height / 2 + offset + 40 + sin(frameCount * 3) * 20);
            translate(0,0,210);
            image(graphic, -graphic.width/2, -graphic.height/2);
            graphic.pop();
            break;
    }
}