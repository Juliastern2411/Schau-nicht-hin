
export function random(seed) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

export function drawGround(ctx, width, height) {
  ctx.fillStyle = "#2d5135";
  ctx.fillRect(0, 0, width, height);

  for (let y = 0; y < height; y += 4) {
    for (let x = 0; x < width; x += 4) {
      const value = random(x * 0.1 + y * 0.2);
      if (value > 0.82) ctx.fillStyle = "#345b3a";
      else if (value > 0.72) ctx.fillStyle = "#29482f";
      else continue;
      ctx.fillRect(x, y, 3, 3);
    }
  }
}

export function drawPath(ctx, width) {
  const pathPoints = [[0, 410], [140, 360], [260, 370], [370, 310], [490, 290], [610, 310], [720, 260], [960, 280]];
  ctx.fillStyle = "#66705a";

  for (let i = 0; i < pathPoints.length - 1; i++) {
    const [x1, y1] = pathPoints[i];
    const [x2, y2] = pathPoints[i + 1];
    ctx.lineWidth = 42;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = "#65715b";
    ctx.stroke();
  }

  ctx.fillStyle = "#707b62";
  for (let i = 0; i < 80; i++) {
    const x = random(i * 11) * width;
    const y = 250 + random(i * 27) * 160;
    ctx.fillRect(x, y, 5, 3);
  }
}

export function drawTree(ctx, x, y, size = 1) {
  const trunkWidth = 14 * size;
  const trunkHeight = 26 * size;

  ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
  ctx.fillRect(x - 28 * size, y + 34 * size, 56 * size, 14 * size);
  ctx.fillStyle = "#5a3c29";
  ctx.fillRect(x - trunkWidth / 2, y + 20 * size, trunkWidth, trunkHeight);
  ctx.fillStyle = "#7a5134";
  ctx.fillRect(x - trunkWidth / 2 + 4 * size, y + 20 * size, 4 * size, trunkHeight);
  ctx.fillStyle = "#1d4a31";
  ctx.fillRect(x - 32 * size, y - 30 * size, 64 * size, 58 * size);
  ctx.fillStyle = "#255b37";
  ctx.fillRect(x - 24 * size, y - 40 * size, 48 * size, 70 * size);
  ctx.fillStyle = "#2e6a40";
  ctx.fillRect(x - 14 * size, y - 46 * size, 28 * size, 28 * size);
  ctx.fillStyle = "#3a7a49";
  ctx.fillRect(x - 8 * size, y - 40 * size, 20 * size, 18 * size);
}

export function drawRock(ctx, x, y, size = 1) {
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(x - 18 * size, y + 12 * size, 36 * size, 10 * size);
  ctx.fillStyle = "#5e655f";
  ctx.fillRect(x - 18 * size, y - 10 * size, 36 * size, 26 * size);
  ctx.fillStyle = "#747c73";
  ctx.fillRect(x - 10 * size, y - 18 * size, 20 * size, 12 * size);
  ctx.fillStyle = "#8c948a";
  ctx.fillRect(x - 6 * size, y - 14 * size, 14 * size, 5 * size);
}

export function drawWorkshop(ctx) {
  const x = 735;
  const y = 105;

  ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
  ctx.fillRect(x - 10, y + 190, 200, 30);
  ctx.fillStyle = "#4c4032";
  ctx.fillRect(x, y + 70, 180, 130);
  ctx.fillStyle = "#352e29";
  ctx.fillRect(x - 15, y + 30, 210, 50);
  ctx.fillStyle = "#292520";
  ctx.fillRect(x, y + 10, 180, 40);
  ctx.fillStyle = "#241f1a";
  ctx.fillRect(x + 120, y + 120, 36, 80);
  ctx.fillStyle = "#5d4a37";
  ctx.fillRect(x + 124, y + 124, 28, 76);
  ctx.fillStyle = "#b7c4a5";
  ctx.fillRect(x + 30, y + 105, 40, 32);
  ctx.fillStyle = "#384e50";
  ctx.fillRect(x + 34, y + 109, 32, 24);
  ctx.fillStyle = "#5d766f";
  ctx.fillRect(x + 48, y + 109, 3, 24);
  ctx.fillRect(x + 34, y + 120, 32, 3);
}

export function drawCrate(ctx, x, y) {
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(x + 5, y + 25, 52, 10);
  ctx.fillStyle = "#8b6037";
  ctx.fillRect(x, y, 56, 30);
  ctx.fillStyle = "#b8864e";
  ctx.fillRect(x + 5, y + 4, 46, 6);
  ctx.fillRect(x + 5, y + 20, 46, 6);
  ctx.fillStyle = "#6a472a";
  ctx.fillRect(x + 25, y, 6, 30);
}

export function drawWorkbench(ctx, x, y) {
  ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
  ctx.fillRect(x - 4, y + 52, 120, 14);
  ctx.fillStyle = "#5f422b";
  ctx.fillRect(x, y + 8, 110, 20);
  ctx.fillStyle = "#9a6a3f";
  ctx.fillRect(x - 5, y, 120, 10);
  ctx.fillStyle = "#493221";
  ctx.fillRect(x + 12, y + 28, 14, 34);
  ctx.fillRect(x + 85, y + 28, 14, 34);
  ctx.fillStyle = "#b4b4a6";
  ctx.fillRect(x + 25, y - 8, 28, 5);
  ctx.fillStyle = "#80542f";
  ctx.fillRect(x + 47, y - 3, 6, 18);
}

const THOUGHT_BUBBLE_MAX_TEXT_WIDTH = 200;
const THOUGHT_BUBBLE_LINE_HEIGHT = 16;
// Abstand der Blasen-Unterkante zum Kopf - bleibt fix, damit der Schweif
// immer an derselben Stelle sitzt, egal wie viele Zeilen die Blase hat
const THOUGHT_BUBBLE_BOTTOM_OFFSET = 47;

function wrapThoughtText(ctx, text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (currentLine && ctx.measureText(testLine).width > maxWidth) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) lines.push(currentLine);
  return lines;
}

export function drawThoughtBubble(ctx, x, y, text) {
  if (!text) return;

  const padding = 12;
  ctx.font = "14px monospace";

  const lines = wrapThoughtText(ctx, text, THOUGHT_BUBBLE_MAX_TEXT_WIDTH);
  const widestLineWidth = Math.max(...lines.map(line => ctx.measureText(line).width));
  const bubbleWidth = widestLineWidth + padding * 2;
  const bubbleHeight = lines.length * THOUGHT_BUBBLE_LINE_HEIGHT + padding * 1.5;
  const bubbleX = x - bubbleWidth / 2;
  const bubbleBottom = y - THOUGHT_BUBBLE_BOTTOM_OFFSET;
  const bubbleY = bubbleBottom - bubbleHeight;

  ctx.fillStyle = "#ece8d9";
  ctx.fillRect(bubbleX, bubbleY, bubbleWidth, bubbleHeight);
  ctx.strokeStyle = "#4a4a44";
  ctx.lineWidth = 2;
  ctx.strokeRect(bubbleX, bubbleY, bubbleWidth, bubbleHeight);
  ctx.fillStyle = "#ece8d9";
  ctx.fillRect(x - 12, bubbleBottom, 8, 8);
  ctx.fillRect(x - 6, bubbleBottom + 9, 5, 5);

  ctx.fillStyle = "#242424";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const firstLineY = bubbleY + padding * 0.75 + THOUGHT_BUBBLE_LINE_HEIGHT / 2;
  lines.forEach((line, index) => {
    ctx.fillText(line, x, firstLineY + index * THOUGHT_BUBBLE_LINE_HEIGHT);
  });

  ctx.textAlign = "left";
}

export function drawCharacter(ctx, x, y, fear = 0, blinking = false, furColor = "#f1db93", bodyColor = "#e9d182", bellyColor = "#efdfbb", carrier) {
 
  x = Math.round(x);
  y = Math.round(y);

  ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
  ctx.fillRect(x - 22, y + 30, 44, 8);

  ctx.fillStyle = furColor;
  ctx.fillRect(x - 19, y - 40, 10, 28);
  ctx.fillRect(x - 22, y - 35, 16, 16);
  ctx.fillStyle = "#863a29";
  ctx.fillRect(x - 16, y - 35, 5, 19);
  ctx.fillStyle = furColor;
  ctx.fillRect(x + 9, y - 40, 10, 28);
  ctx.fillRect(x + 6, y - 35, 16, 16);
  ctx.fillStyle = "#863a29";
  ctx.fillRect(x + 11, y - 35, 5, 19);

  ctx.fillStyle = furColor;
  ctx.fillRect(x - 19, y - 28, 38, 28);
  ctx.fillRect(x - 23, y - 21, 46, 14);
  ctx.fillRect(x - 10, y - 25, 20, 9);

  ctx.fillStyle = "#3b302d";
  ctx.fillRect(x - 11, y - 15, 5, 7);
  ctx.fillRect(x + 6, y - 15, 5, 7);

  ctx.fillStyle = "#cd6f5a";
  ctx.fillRect(x - 19, y - 8, 6, 4);
  ctx.fillRect(x + 13, y - 8, 6, 4);

  ctx.fillStyle = "#533121";
  ctx.fillRect(x - 3, y - 8, 6, 4);

  ctx.fillStyle = bodyColor;
  ctx.fillRect(x - 18, y + 1, 36, 27);
  ctx.fillRect(x - 22, y + 8, 44, 14);

  ctx.fillStyle = bellyColor;
  ctx.fillRect(x - 11, y + 8, 22, 16);
  ctx.fillRect(x - 8, y + 4, 16, 24);

  ctx.fillStyle = furColor;
  ctx.fillRect(x - 25, y + 8, 7, 15);
  ctx.fillRect(x + 18, y + 8, 7, 15);

  ctx.fillStyle = "#cd6f5a";
  ctx.fillRect(x - 17, y + 26, 13, 7);
  ctx.fillRect(x + 4, y + 26, 13, 7);

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(x - 10, y - 17, 2, 2);
  ctx.fillRect(x + 7, y - 17, 2, 2);

  if (blinking) {
    ctx.fillStyle = "#352a20";
    ctx.fillRect(x - 8, y - 18, 5, 1);
    ctx.fillRect(x + 3, y - 18, 5, 1);
  }

  if (fear > 0.25) {
    ctx.fillStyle = "#5a4030";
    ctx.fillRect(x - 8, y - 24, 5, 1);
    ctx.fillRect(x + 3, y - 24, 5, 1);
  }

  if (fear > 0.55) {
    const sweatPulse = Math.sin(carrier.panicTime * 6);
    if (sweatPulse > 0.2) {
      ctx.fillStyle = "#74b9c8";
      ctx.fillRect(x + 13, y - 22, 2, 3);
      ctx.fillRect(x + 14, y - 19, 1, 2);
    }
  }

  if (fear > 0.82) {
    ctx.fillStyle = "#8b3d3d";
    ctx.fillRect(x - 13, y - 26, 2, 2);
    ctx.fillRect(x + 12, y - 26, 2, 2);
  }

  if (carrier.carryingItem === "bolt") {
    ctx.fillStyle = "#b8b8b8";
    ctx.fillRect(x + 10 * carrier.direction, y - 2, 6, 3);
    ctx.fillStyle = "#666666";
    ctx.fillRect(x + 12 * carrier.direction, y + 1, 2, 4);
  }

  if (carrier.carryingItem === "gear") {
    ctx.fillStyle = "#b88a3b";
    ctx.fillRect(x + 8 * carrier.direction, y - 4, 7, 7);
    ctx.fillStyle = "#4d3920";
    ctx.fillRect(x + 10 * carrier.direction, y - 2, 3, 3);
  }

  if (carrier.carryingItem === "spring") {
    ctx.fillStyle = "#c0a080";
    ctx.fillRect(x + 8 * carrier.direction, y - 5, 5, 10);
    ctx.fillStyle = "#806040";
    ctx.fillRect(x + 10 * carrier.direction, y - 2, 2, 4);
  }

  if (carrier.carryingItem === "cable") {
    ctx.fillStyle = "#c0956b";
    ctx.fillRect(x + 6 * carrier.direction, y - 3, 8, 6);
    ctx.fillStyle = "#503020";
    ctx.fillRect(x + 10 * carrier.direction, y + 2, 3, 2);
  }

  if (carrier.carryingItem === "crystal") {
    ctx.fillStyle = "#6ba8ff";
    ctx.beginPath();
    ctx.moveTo(x + 10 * carrier.direction, y - 6);
    ctx.lineTo(x + 16 * carrier.direction, y);
    ctx.lineTo(x + 4 * carrier.direction, y);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#a8d8ff";
    ctx.fillRect(x + 8 * carrier.direction, y - 4, 2, 2);
  }
}

export function drawBoltIcon(ctx, pos) {
  ctx.fillStyle = "#9c9c9c";
  ctx.fillRect(pos.x - 5, pos.y - 3, 10, 6);
  ctx.fillStyle = "#666666";
  ctx.fillRect(pos.x - 1, pos.y + 3, 2, 7);
  ctx.fillStyle = "#d8d8d8";
  ctx.fillRect(pos.x - 3, pos.y - 2, 3, 1);
}

export function drawGearIcon(ctx, pos) {
  ctx.fillStyle = "#b88a3b";
  ctx.fillRect(pos.x - 7, pos.y - 4, 14, 8);
  ctx.fillRect(pos.x - 4, pos.y - 7, 8, 14);
  ctx.fillStyle = "#5d4726";
  ctx.fillRect(pos.x - 3, pos.y - 3, 6, 6);
  ctx.fillStyle = "#252525";
  ctx.fillRect(pos.x - 1, pos.y - 1, 2, 2);
}

export function drawSpringIcon(ctx, pos) {
  ctx.fillStyle = "#c0a080";
  ctx.fillRect(pos.x - 5, pos.y - 6, 10, 3);
  ctx.fillRect(pos.x - 5, pos.y - 1, 10, 3);
  ctx.fillRect(pos.x - 5, pos.y + 4, 10, 3);
  ctx.fillStyle = "#806040";
  ctx.fillRect(pos.x - 2, pos.y - 2, 4, 4);
}

export function drawCableIcon(ctx, pos) {
  ctx.fillStyle = "#c0956b";
  ctx.fillRect(pos.x - 8, pos.y - 2, 16, 4);
  ctx.fillRect(pos.x - 2, pos.y - 6, 4, 8);
  ctx.fillStyle = "#503020";
  ctx.fillRect(pos.x - 3, pos.y + 2, 6, 4);
}

export function drawCrystalIcon(ctx, pos) {
  ctx.fillStyle = "#6ba8ff";
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y - 8);
  ctx.lineTo(pos.x + 8, pos.y + 4);
  ctx.lineTo(pos.x - 8, pos.y + 4);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#a8d8ff";
  ctx.fillRect(pos.x - 2, pos.y - 4, 4, 3);
}

const TASK_ROW_HEIGHT = 15;
const TASK_BOX_SIZE = 10;

function drawTaskLine(ctx, x, y, completed, text) {
  const boxTop = y - TASK_BOX_SIZE + 3;

  if (completed) {
    ctx.fillStyle = "#4d9a58";
    ctx.fillRect(x, boxTop, TASK_BOX_SIZE, TASK_BOX_SIZE);

    ctx.strokeStyle = "#f2fff2";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x + 2, boxTop + TASK_BOX_SIZE / 2);
    ctx.lineTo(x + TASK_BOX_SIZE / 2, boxTop + TASK_BOX_SIZE - 2);
    ctx.lineTo(x + TASK_BOX_SIZE - 1, boxTop + 1);
    ctx.stroke();
  } else {
    ctx.strokeStyle = "rgba(232, 223, 201, 0.55)";
    ctx.lineWidth = 1.2;
    ctx.strokeRect(x, boxTop, TASK_BOX_SIZE, TASK_BOX_SIZE);
  }

  ctx.fillStyle = completed ? "#d8d2c2" : "#f2ead6";
  ctx.font = "10px monospace";
  ctx.fillText(text, x + TASK_BOX_SIZE + 7, y);
}

export function drawTaskPanel(ctx, width, height, task, userIsWatching, character) {
  const tasksList = [
    [task.hasBolt || task.step > 0, "Schraube"],
    [task.hasGear || task.step > 2, "Zahnrad"],
    [task.hasSpring || task.step > 4, "Feder"],
    [task.hasCable || task.step > 6, "Kabel"],
    [task.hasCrystal || task.step > 8, "Kristall"],
    [task.machineActivated || task.step > 10, "Aktivieren"]
  ];

  const panelWidth = 168;
  const headerHeight = 24;
  const footerHeight = 28;
  const panelHeight = headerHeight + tasksList.length * TASK_ROW_HEIGHT + footerHeight;
  const panelX = 40;
  const panelY = height - panelHeight - 36;
  const radius = 8;

  ctx.fillStyle = "rgba(15, 15, 15, 0.4)";
  ctx.beginPath();
  ctx.roundRect(panelX, panelY, panelWidth, panelHeight, radius);
  ctx.fill();

  ctx.fillStyle = "#f2ead6";
  ctx.font = "bold 11px monospace";
  ctx.fillText("HEUTIGE AUFGABE", panelX + 12, panelY + 17);

  let rowY = panelY + headerHeight + 10;
  for (const [done, label] of tasksList) {
    drawTaskLine(ctx, panelX + 12, rowY, done, label);
    rowY += TASK_ROW_HEIGHT;
  }

  const progress = task.completed ? 1 : task.step / 11;
  const barWidth = panelWidth - 24;
  const barY = rowY - 3;

  ctx.fillStyle = "rgba(242, 234, 214, 0.2)";
  ctx.fillRect(panelX + 12, barY, barWidth, 5);
  ctx.fillStyle = "#6fc47a";
  ctx.fillRect(panelX + 12, barY, barWidth * progress, 5);

  const statusY = barY + 16;
  ctx.font = "8px monospace";

  if (task.completed) {
    ctx.fillStyle = "#7ee08a";
    ctx.fillText("STATUS: FERTIG!", panelX + 12, statusY);
  } else if (userIsWatching) {
    ctx.fillStyle = "#e8746a";
    ctx.fillText("STATUS: BEOBACHTET...", panelX + 12, statusY);
  } else if (character.state === "panicked") {
    ctx.fillStyle = "#e0a45f";
    ctx.fillText("STATUS: PANIK!", panelX + 12, statusY);
  } else {
    ctx.fillStyle = "#8fd490";
    ctx.fillText("STATUS: ARBEITET", panelX + 12, statusY);
  }
}

export function drawWatchWarning(ctx, width) {
  const text = "SCHAU NICHT HIN";
  ctx.font = "bold 20px monospace";
  ctx.fillStyle = "#e8dfc9";
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  ctx.fillText(text, 40, 34);
  ctx.textBaseline = "alphabetic";
}

// Einmaliger Warn-Screen vor Spielstart, verschwindet nach dem ersten Klick
export function drawIntroScreen(ctx, width, height) {
  ctx.fillStyle = "#14100e";
  ctx.fillRect(0, 0, width, height);

  ctx.textAlign = "center";

  ctx.fillStyle = "#e8746a";
  ctx.font = "bold 30px monospace";
  ctx.fillText("WARNUNG!", width / 2, height / 2 - 70);

  ctx.fillStyle = "#f2ead6";
  ctx.font = "18px monospace";
  ctx.fillText("Egal was du tust...", width / 2, height / 2 - 20);

  ctx.fillStyle = "#e8746a";
  ctx.font = "bold 26px monospace";
  ctx.fillText("SCHAU NICHT HIN.", width / 2, height / 2 + 20);

  ctx.fillStyle = "#8fd490";
  ctx.font = "14px monospace";
  ctx.fillText("[ KLICKEN ZUM STARTEN ]", width / 2, height / 2 + 80);

  ctx.textAlign = "left";
}

function getFearJitterX(entity, includeExtremeJitter) {
  let offset = 0;
  if (entity.fear > 0.25) offset += Math.sin(entity.panicTime * 14) * entity.fear * 1.5;
  if (entity.fear > 0.50) offset += Math.sin(entity.panicTime * 32) * entity.fear * 2.5;
  if (includeExtremeJitter && entity.fear > 0.75) offset += Math.sin(entity.panicTime * 55) * 3;
  return offset;
}

export function renderWorld(ctx, width, height, state) {
  const { character, secondaryCharacters, task, items, userIsWatching, workbenchPosition, gameOverMessage, gameOver } = state;

  ctx.clearRect(0, 0, width, height);

  drawGround(ctx, width, height);
  drawPath(ctx, width);

  drawTree(ctx, 90, 100, 1.2);
  drawTree(ctx, 200, 120, 0.9);
  drawTree(ctx, 100, 470, 1.3);
  drawTree(ctx, 210, 460, 1.1);
  drawTree(ctx, 420, 440, 1.2);
  drawTree(ctx, 620, 450, 1.3);
  drawTree(ctx, 900, 450, 1.4);

  drawRock(ctx, 540, 110, 1.3);
  drawRock(ctx, 620, 160, 1.1);
  drawRock(ctx, 680, 90, 0.9);

  drawWorkshop(ctx);
  drawWorkbench(ctx, 440, 210);
  drawCrate(ctx, 590, 360);

  let characterVisualY = character.y;
  let characterVisualX = character.x;

  if (character.state !== "walking") {
    characterVisualX += getFearJitterX(character, true);
  }

  if (character.state === "walking" || character.state === "panicked") {
    const walkSpeed = character.state === "panicked" ? 18 : 10;
    const walkHeight = character.state === "panicked" ? 4 : 2;
    characterVisualY += Math.sin(character.walkTime * walkSpeed) * walkHeight;
  }

  if (character.state === "noticed") {
    characterVisualX += Math.sin(character.emotionTime * 45) * 3;
  }

  if (character.state === "idle") {
    characterVisualY += Math.sin(character.idleTime * 2) * 1;
  }

  if (character.fear > 0.60 && character.state !== "walking") {
    characterVisualY += (character.fear - 0.60) * 12;
  }

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (!(task[item.hasFlag] || task.step > i * 2)) {
      item.draw(ctx, item.position);
    }
  }

  ctx.fillStyle = "#5b3924";
  ctx.fillRect(workbenchPosition.x - 38, workbenchPosition.y - 22, 76, 8);
  ctx.fillRect(workbenchPosition.x - 30, workbenchPosition.y - 14, 7, 35);
  ctx.fillRect(workbenchPosition.x + 23, workbenchPosition.y - 14, 7, 35);

  ctx.fillStyle = "#9a9a9a";
  ctx.fillRect(workbenchPosition.x - 12, workbenchPosition.y - 30, 5, 10);
  ctx.fillRect(workbenchPosition.x - 15, workbenchPosition.y - 30, 11, 3);

  if (!task.machineFixed) {
    ctx.fillStyle = "#4d4d4d";
    ctx.fillRect(workbenchPosition.x + 5, workbenchPosition.y - 42, 25, 18);
    ctx.fillStyle = "#b84a42";
    ctx.fillRect(workbenchPosition.x + 21, workbenchPosition.y - 38, 4, 4);

    if (Math.sin(performance.now() / 150) > 0.5) {
      ctx.fillStyle = "#e7c65f";
      ctx.fillRect(workbenchPosition.x + 32, workbenchPosition.y - 45, 3, 3);
    }
  } else {
    ctx.fillStyle = "#6d8d78";
    ctx.fillRect(workbenchPosition.x + 5, workbenchPosition.y - 42, 25, 18);
    ctx.fillStyle = "#7dcc76";
    ctx.fillRect(workbenchPosition.x + 21, workbenchPosition.y - 38, 4, 4);
  }

  if (task.machineNeedsTwiceRepair && !task.machineFixed && Math.sin(performance.now() / 100) > 0.5) {
    ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
    ctx.fillRect(workbenchPosition.x - 5, workbenchPosition.y - 50, 40, 30);
  }

  drawCharacter(ctx, characterVisualX, characterVisualY, character.fear, character.blinking, undefined, undefined, undefined, character);

  for (const chainCharacter of secondaryCharacters) {
    if (!chainCharacter.active) continue;

    let chainVisualY = chainCharacter.y;
    let chainVisualX = chainCharacter.x;

    if (chainCharacter.state === "panicked") {
      chainVisualX += getFearJitterX(chainCharacter, true);
      chainVisualY += Math.sin(chainCharacter.walkTime * 18) * 4;
    } else if (chainCharacter.state === "entering") {
      chainVisualY += Math.sin(chainCharacter.walkTime * 10) * 2;
    } else {
      // observing / reacting: Figur steht und schaut nur zu
      chainVisualY += Math.sin(chainCharacter.emotionTime * 2) * 1;
    }

    drawCharacter(
      ctx, chainVisualX, chainVisualY, chainCharacter.fear, chainCharacter.blinking,
      chainCharacter.furColor, chainCharacter.bodyColor, chainCharacter.bellyColor, character
    );
    drawThoughtBubble(ctx, chainCharacter.x, chainCharacter.y, chainCharacter.thought);
  }

  drawThoughtBubble(ctx, characterVisualX, characterVisualY, character.thought);
  drawTaskPanel(ctx, width, height, task, userIsWatching, character);
  drawWatchWarning(ctx, width);

  if (gameOverMessage || task.completed) {
    drawGameOverOverlay(ctx, width, height, gameOverMessage, gameOver, task.completed);
  }
}

function drawGameOverOverlay(ctx, width, height, message, isFinal, isWon) {
  ctx.fillStyle = isFinal || isWon ? "rgba(12, 9, 7, 0.85)" : "rgba(12, 9, 7, 0.4)";
  ctx.fillRect(0, 0, width, height);

  ctx.textAlign = "center";

  if (isWon) {
    ctx.fillStyle = "#8fd490";
    ctx.font = "bold 38px monospace";
    ctx.fillText("GEWONNEN", width / 2, height / 2 - 30);

    ctx.fillStyle = "#f2ead6";
    ctx.font = "18px monospace";
    ctx.fillText("Gewonnen, das Kätzchen hat die", width / 2, height / 2 + 12);
    ctx.fillText("Werkbank erfolgreich repariert.", width / 2, height / 2 + 40);

    ctx.fillStyle = "#8fd490";
    ctx.font = "12px monospace";
    ctx.fillText("klicken zum neu starten.", width / 2, height / 2 + 75);
    ctx.textAlign = "left";
    return;
  }

  if (!isFinal) {
    ctx.fillStyle = "#f2ead6";
    ctx.font = "bold 24px monospace";
    ctx.fillText(message, width / 2, height / 2);
    ctx.textAlign = "left";
    return;
  }

  ctx.fillStyle = "#e8746a";
  ctx.font = "bold 46px monospace";
  ctx.fillText("GAME OVER", width / 2, height / 2 - 30);

  ctx.fillStyle = "#f2ead6";
  ctx.font = "18px monospace";
  ctx.fillText("Du hast eine Massenpanik ausgelöst.", width / 2, height / 2 + 12);

  ctx.fillStyle = "#c9bfa8";
  ctx.font = "13px monospace";
  ctx.fillText("Vielleicht nächstes Mal weniger hinschauen.", width / 2, height / 2 + 40);

  ctx.fillStyle = "#8fd490";
  ctx.font = "12px monospace";
  ctx.fillText("Klicken zum Neustart", width / 2, height / 2 + 75);

  ctx.textAlign = "left";
}
