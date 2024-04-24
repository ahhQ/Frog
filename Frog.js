let dataset;
let lilyPads = [];
let frogs = [];
let jumpStarted = false;
let generationColors = {
  '901': '#8DC63F',
  'G': '#80C342',
  '964': '#72BF44',
  '993': '#62BB46',
  '996': '#50B848',
  '997': '#39B54A',
  '991': '#0DB14B',
  '992': '#00AE4D'
};
let lilyPadPNGs = {}; // Object to store the loaded PNG images

function preload() {
  dataset = loadTable('Frog.csv', 'csv', 'header');
  // Load PNG images for each lily pad generation, assuming files are named accordingly
  lilyPadPNGs['901'] = loadImage('lilyPad901.png');
  lilyPadPNGs['G'] = loadImage('lilyPadG.png');
  lilyPadPNGs['964'] = loadImage('lilyPad964.png');
  lilyPadPNGs['993'] = loadImage('lilyPad993.png');
  lilyPadPNGs['996'] = loadImage('lilyPad996.png');
  lilyPadPNGs['997'] = loadImage('lilyPad997.png');
  lilyPadPNGs['991'] = loadImage('lilyPad991.png');
  lilyPadPNGs['992'] = loadImage('lilyPad992.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(8);
  textAlign(CENTER, TOP);

  // Setup lily pads with associated PNG images
  lilyPads = [
    { x: width * 0.12, y: height * 0.22, size: 330, generation: '992', angle: PI / 4, png: lilyPadPNGs['992'] },
    { x: width * 0.32, y: height * 0.4, size: 330, generation: '991', angle: PI / 4, png: lilyPadPNGs['991'] },
    { x: width * 0.5, y: height * 0.22, size: 310, generation: '997', angle: PI / 250, png: lilyPadPNGs['997'] },
    { x: width * 0.7, y: height * 0.4, size: 300, generation: '996', angle: PI / 100, png: lilyPadPNGs['996'] },
    { x: width * 0.9, y: height * 0.3, size: 290, generation: '993', angle: PI / 100, png: lilyPadPNGs['993'] },
    { x: width * 0.2, y: height * 0.78, size: 310, generation: '964', angle: PI / 10, png: lilyPadPNGs['964'] },
    { x: width * 0.5, y: height * 0.8, size: 280, generation: 'G', angle: PI / 4, png: lilyPadPNGs['G'] },
    { x: width * 0.8, y: height * 0.75, size: 260, generation: '901', angle: PI / 10, png: lilyPadPNGs['901'] }
  ];

  frogs = dataset.getRows().map(row => {
    let generation = row.getString('Generation');
    let targetPad = lilyPads.find(pad => pad.generation === generation);
    if (targetPad) {
      let offsetX = random(-targetPad.size / 4, targetPad.size / 4);
      let offsetY = random(-targetPad.size / 4, targetPad.size / 4);

      return {
        x: random(-100, -50), // Start off-screen
        y: random(height),
        startX: random(-100, -50),
        startY: random(height),
        targetX: targetPad.x + offsetX, // Centered on lily pad
        targetY: targetPad.y + offsetY, // Centered on lily pad
        headSize: 10,
        bodyWidth: 15,
        bodyHeight: 10,
        power: row.getNum('Power'),
        jumpHeight: 350,
        progress: 0,
        speed: 0.03,
        jumpDelay: random(10, 800), // Delay in frames
        startJumpFrame: frameCount + random(10, 1000), // New property to hold start time

        jump: function () {
          if (frameCount >= this.startJumpFrame && this.progress < 1) {
            this.progress += this.speed;

            let sineValue = Math.pow(Math.sin(Math.PI * this.progress), 2);
            this.y = this.linearInterpolate(this.startY, this.targetY, this.progress) - sineValue * this.jumpHeight * (1 - this.progress);
            this.x = this.linearInterpolate(this.startX, this.targetX, this.progress);

            if (this.progress >= 1) {
              this.x = this.targetX;
              this.y = this.targetY;
            }
          }
        },

        linearInterpolate: function (start, end, t) {
          return start + (end - start) * t;
        }
      };
    }
    return null;
  }).filter(frog => frog !== null);
}

let jumpStartFrame = 0; // Track when jumping starts

function mousePressed() {
  jumpStarted = true;
  jumpStartFrame = frameCount; // Record the frame when jump was started
  frogs.forEach(frog => {
    frog.progress = 0;
  });
}

function isMouseOverLilyPad(pad) {
  // Calculate the rotated mouse coordinates
  let dx = mouseX - pad.x;
  let dy = mouseY - pad.y;
  let cosTheta = cos(-pad.angle);
  let sinTheta = sin(-pad.angle);
  let rotatedX = dx * cosTheta - dy * sinTheta;
  let rotatedY = dx * sinTheta + dy * cosTheta;

  // Adjust calculation to consider the size of the PNG
  return abs(rotatedX) <= pad.size / 2 && abs(rotatedY) <= pad.size / 2;
}

function drawLilyPad(x, y, size, angle) {
  push(); // Save the current drawing state
  translate(x, y); // Move the origin to the lily pad's location
  rotate(angle); // Rotate by the specified angle

  const dentSize = size / 4; // Size of the notch in the lily pad
  beginShape();
  vertex(0, size / 2); // Start at the bottom center of the lily pad
  bezierVertex(-size / 2, size / 2, -size / 2, -size / 2, 0, -size / 2); // Left curve
  bezierVertex(size / 2, -size / 2, size / 2, dentSize, 0, size / 2); // Right curve and up to start
  endShape(CLOSE);

  pop();
}

function draw() {
  background('#174991'); // Set to a pleasant blue color, adjust the code for different shades

  noStroke();
  let hoverText = null;
  let hoverPad = null;

  lilyPads.forEach(pad => {
    push();
    translate(pad.x, pad.y);
    rotate(pad.angle);
    imageMode(CENTER);
    image(pad.png, 0, 0, pad.size, pad.size);
    pop();

    if (isMouseOverLilyPad(pad)) {
      fill(0);
      noStroke();
      textSize(18);
      textAlign(CENTER, TOP);
      let textY = pad.y + pad.size / 10 + 10; // Position the text 10 pixels below the lily pad
      text(pad.generation, pad.x, pad.y);
    }
  });

  frogs.forEach(frog => {
    frog.jump(); // Adjusted to check startJumpFrame internally

    if (jumpStarted) {
      let shadowOffsetX = 12;
      let shadowOffsetY = 13;

      // FROG SHADOW
      fill(0, 0, 0, 200); // Shadow color
      ellipse(frog.x + shadowOffsetX, frog.y + shadowOffsetY, frog.bodyWidth, frog.headSize + frog.bodyHeight);

      // FROG
      let headX = frog.x + (frog.bodyWidth - frog.headSize) / 2;
      fill('#008000'); // Head color
      rect(headX, frog.y, frog.headSize, frog.headSize); // Head
      fill('#228B22'); // Body Color
      rect(frog.x, frog.y + frog.headSize, frog.bodyWidth, frog.bodyHeight); // Body
      fill('#323232'); // Eyes color
      ellipse(headX, frog.y, Math.max(frog.power * 0.05, 1), Math.max(frog.power * 0.05, 1)); // Eyes
      ellipse(headX + frog.headSize, frog.y, Math.max(frog.power * 0.05, 1), Math.max(frog.power * 0.05, 1));
    }
  });

  drawLegend();
}

function drawLegend() {
  const legendTop = height - 80;  // Position the legend 50px from the bottom of the canvas
  const legendLeft = width - 130;  // Position the legend 300px from the right of the canvas

  // Reset text settings for legend
  fill(0); // Black color for all text
  textSize(12);
  textAlign(LEFT, TOP);  // Set text alignment for legend

  // Displaying legend items for Power
  fill('#000')
  text('Power', legendLeft + 30, legendTop + 2);
  fill('#000000'); // Dark color for eyes
  ellipse(legendLeft + 3, legendTop + 7, 7, 7); // First eye
  ellipse(legendLeft + 10, legendTop + 7, 7, 7); // Second eye, placed next to the first

  // Displaying legend items for Speed
  fill('#000')
  text('Acceleration', legendLeft + 30, legendTop + 22);
  fill('#008000'); // Color for speed
  rect(legendLeft, legendTop + 20, 15, 15); // Rectangle for speed

  // Displaying legend items for Acceleration
  fill('#000')
  text('Speed', legendLeft + 30, legendTop + 42);
  fill('#228B22'); // Green color for acceleration
  rect(legendLeft, legendTop + 42, 20, 12); // Rectangle for acceleration (not a square)
}
