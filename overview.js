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
  displayFrogs();
  drawLegend();
  displayHoverData();
}

function displayFrogs() {
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
}

function drawLegend() {
  const legendTop = height - 1630;
  const legendLeft = width - 500; // Adjust width for horizontal layout

  fill(0);
  textSize(12);
  textAlign(LEFT, TOP);

  text('Power', legendLeft + 160, legendTop + 12);
  fill('#000000');
  ellipse(legendLeft + 140, legendTop + 18, 7, 7);
  ellipse(legendLeft + 150, legendTop + 18, 7, 7);

  text('Acceleration', legendLeft + 255, legendTop + 12);
  fill('#008000');
  rect(legendLeft + 230, legendTop + 10, 15, 15);

  fill('#000')
  text('Speed', legendLeft + 380, legendTop + 12);
  fill('#228B22');
  rect(legendLeft + 350, legendTop + 11, 20, 12);
}

function displayHoverData() {
  textSize(12);
  frogs.forEach(frog => {
    let headX = frog.x + (frog.bodyWidth - frog.headSize) / 2;
    if (mouseX >= headX && mouseX <= headX + frog.headSize && mouseY >= frog.y && mouseY <= frog.y + frog.headSize + frog.bodyHeight ||
        mouseX >= frog.x && mouseX <= frog.x + frog.bodyWidth && mouseY >= frog.y + frog.headSize && mouseY <= frog.y + frog.headSize + frog.bodyHeight) {
      fill(0);
      text(`Speed (km/h): ${frog.speed}, Acceleration 0-100km/h (s): ${frog.acceleration}, Power/Liter: ${frog.power}`, mouseX + 15, mouseY - 15);
    }
  });
  textSize(8); // Reset text size after displaying hover data
}

function windowResized() {
  resizeCanvas(windowWidth, 1660);
}
