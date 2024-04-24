let dataset;
let frogs = []; // Array to store frog data for hover functionality

function preload() {
  dataset = loadTable('Frog.csv', 'csv', 'header');
}

function setup() {
  createCanvas(windowWidth, 1660);
  textSize(8);
  textAlign(CENTER, TOP);

  let frogsPerRow = 18;
  let marginX = 15;
  let marginY = 100;
  let spacingX = (width - marginX * 2) / frogsPerRow;
  let spacingY = spacingX + 15; // Extra space for labels and vertical margins
  let scaleFactors = { speed: 0.2, acceleration: 5.5, power: 0.05 };

  for (let i = 0; i < dataset.getRowCount(); i++) {
    let row = dataset.getRow(i);
    frogs.push({
      speed: row.getNum('Speed'),
      acceleration: row.getNum('Acceleration'),
      power: row.getNum('Power'),
      generation: row.getString('Generation'),
      x: marginX + (i % frogsPerRow) * spacingX,
      y: marginY + Math.floor(i / frogsPerRow) * spacingY,
      headSize: row.getNum('Acceleration') * scaleFactors.acceleration,
      bodyWidth: row.getNum('Speed') * scaleFactors.speed,
      bodyHeight: 30, // Constant body height
    });
  }
}

function draw() {
  background(255);
  fill('#0db14b');
  noStroke();

  frogs.forEach(frog => {
    let headX = frog.x + (frog.bodyWidth - frog.headSize) / 2;
    fill('#008000'); // Head color
    rect(headX, frog.y, frog.headSize, frog.headSize); // Head
    fill('#228B22'); // Body Color
    rect(frog.x, frog.y + frog.headSize, frog.bodyWidth, frog.bodyHeight); // Body

    fill(0);
    ellipse(headX, frog.y, Math.max(frog.power * 0.07, 2), Math.max(frog.power * 0.07, 2)); // Left Eye
    ellipse(headX + frog.headSize, frog.y, Math.max(frog.power * 0.07, 2), Math.max(frog.power * 0.07, 2)); // Right Eye
    fill('#0db14b'); // Reset color for the next frog
  });

  displayHoverData();
}

function displayHoverData() {
  frogs.forEach(frog => {
    let headX = frog.x + (frog.bodyWidth - frog.headSize) / 2;
    // Check if mouse is over the frog's body or head
    if (mouseX >= headX && mouseX <= headX + frog.headSize && mouseY >= frog.y && mouseY <= frog.y + frog.headSize + frog.bodyHeight ||
        mouseX >= frog.x && mouseX <= frog.x + frog.bodyWidth && mouseY >= frog.y + frog.headSize && mouseY <= frog.y + frog.headSize + frog.bodyHeight) {
      fill(0);
      textSize(12);
      text(`Speed (km/h): ${frog.speed}, Acceleration 0-100km/h (s): ${frog.acceleration}, Power/Liter: ${frog.power}`, mouseX + 15, mouseY - 15);
      textSize(8); // Reset text size for other elements
    }
  });
}

function windowResized() {
  resizeCanvas(windowWidth, 1660); // Keep the canvas height constant on resize
}