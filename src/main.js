import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import "./style.css";
import { drawBoltIcon, drawGearIcon, drawSpringIcon, drawCableIcon, drawCrystalIcon, renderWorld, drawIntroScreen } from "./pixelArt.js";
import { CHAIN_OBSERVE_THOUGHTS, CHAIN_REACTION_THOUGHTS } from "./dialogue/thoughtsData.js";
import { DIALOGS } from "./dialogue/dialogsData.js";
import { updateThought } from "./dialogue/thoughtSystem.js";
import { updateDialogSystem, isDialogActive, allowDialogAgain } from "./dialogue/dialogSystem.js";

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const WIDTH = 960;
const HEIGHT = 540;
canvas.width = WIDTH;
canvas.height = HEIGHT;

// Einmaliger Warn-Screen vor Spielstart, verschwindet nach dem ersten Klick
let introScreenActive = true;

const WORKBENCH_POSITION = { x: 720, y: 350 };

const BOLT_POSITION = { x: 250, y: 360 };
const GEAR_POSITION = { x: 540, y: 420 };
const SPRING_POSITION = { x: 850, y: 480 };
const CABLE_POSITION = { x: 150, y: 280 };
const CRYSTAL_POSITION = { x: 700, y: 150 };

const task = {
  step: 0,
  hasBolt: false,
  hasGear: false,
  hasSpring: false,
  hasCable: false,
  hasCrystal: false,
  machineFixed: false,
  machineActivated: false,
  completed: false,
  repairAttempts: 0,
  machineNeedsTwiceRepair: false
};

const character = {
  x: 430, y: 330, targetX: 720, targetY: 350, speed: 30,
  state: "walking", direction: 1, idleTime: 0, walkTime: 0,
  noticeTime: 0, watchedTime: 0, fear: 0, emotionTime: 0,
  thought: "", lastThoughtChange: 0, safeTime: 0, panicTime: 0,
  sweatTimer: 0, blinkTimer: 0, blinking: false,
  panicMoveTimer: 0, panicTargetX: 0, panicTargetY: 0,
  carryingItem: null, actionTime: 0, isWorking: false,
  introActive: true, introPhase: 0, introTimer: 0, introStarted: false,
  lastThoughtTime: 0
};

function createChainCharacter(spawn) {
  const entryX = spawn.side === "left" ? -50 : WIDTH + 50;

  return {
    x: entryX, y: spawn.entryY, targetX: spawn.targetX, targetY: spawn.targetY, speed: spawn.speed,
    direction: spawn.side === "left" ? 1 : -1,
    furColor: spawn.furColor, bodyColor: spawn.bodyColor, bellyColor: spawn.bellyColor,
    state: "idle", fear: 0, watchedTime: 0, noticeTime: 0,
    emotionTime: 0, walkTime: 0, idleTime: 0, panicTime: 0,
    blinkTimer: 0, blinking: false, thought: "", lastThoughtChange: 0,
    panicMoveTimer: 0, panicTargetX: 0, panicTargetY: 0,
    observeTimer: 0, observeDuration: 0, saidMoment: false,
    active: false, activeTimer: 0
  };
}

const MAX_PANIC_CHARACTERS = 5;

const CHAIN_SPAWNS = [
  {
    side: "right", entryY: 280, targetX: 820, targetY: 300, speed: 50,
    furColor: "#d97a2e", bodyColor: "#b8631f", bellyColor: "#f2c581" // orange getigert
  },
  {
    side: "left", entryY: 420, targetX: 220, targetY: 420, speed: 55,
    furColor: "#b8b8b8", bodyColor: "#a0a0a0", bellyColor: "#e2e2e2" // hellgrau getigert
  },
  {
    side: "right", entryY: 460, targetX: 760, targetY: 460, speed: 45,
    furColor: "#b8834a", bodyColor: "#9c6c38", bellyColor: "#e0bd8a" // hellbraun
  },
  {
    side: "left", entryY: 230, targetX: 260, targetY: 250, speed: 60,
    furColor: "#8a8a8a", bodyColor: "#75757a", bellyColor: "#bcbcbc" // rauchgrau statt schwarz
  }
];

const chainCharacters = CHAIN_SPAWNS
  .slice(0, MAX_PANIC_CHARACTERS - 1)
  .map(createChainCharacter);

const character2 = chainCharacters[0];

const panicCharacters = [character, ...chainCharacters];

let lastTime = performance.now();
let userIsWatching = false;
let faceLandmarker = null;
let webcamVideo = null;
let webcamIsRunning = false;
let faceDetected = false;
let eyesOpen = true;
let lookingAtScreen = false;
let watchingConfidence = 0;
let lastTrackingTime = performance.now();
let lastBlinkTime = performance.now();
let lastDeltaTime = 0;

function updateBlinking(entity, deltaTime) {
  entity.blinkTimer += deltaTime;

  let blinkInterval = 4;
  if (entity.fear > 0.25) blinkInterval = 3;
  if (entity.fear > 0.50) blinkInterval = 1.8;
  if (entity.fear > 0.75) blinkInterval = 1.1;

  if (entity.blinkTimer > blinkInterval) entity.blinking = true;
  if (entity.blinkTimer > blinkInterval + 0.12) {
    entity.blinking = false;
    entity.blinkTimer = 0;
  }
}

let panicLevel = 0;

const PANIC_FEAR_THRESHOLD = 0.85;

let panicSpeedMultiplier = 1;

let massPanicTimer = 0;
let gameOverMessage = "";
let gameOver = false;

function updateMassPanicSequence(deltaTime) {
  if (gameOver || panicLevel < 5) return;

  massPanicTimer += deltaTime;

  if (massPanicTimer < 2.5) {
    gameOverMessage = "";
  } else if (massPanicTimer < 4.5) {
    gameOverMessage = "";
    panicSpeedMultiplier = 1.7;
  } else if (massPanicTimer < 6.7) {
    gameOverMessage = "ZU VIELE KÄTZCHEN HABEN ANGST.";
  } else if (massPanicTimer < 8.9) {
    gameOverMessage = "DU HAST EINE MASSENPANIK AUSGELÖST.";
  } else {
    gameOverMessage = "GAME OVER";
    gameOver = true;
  }
}

function isActive(entity) {
  return entity.active !== false;
}

function updatePanicLevel() {
  const panickedCount = panicCharacters.filter(entity => entity.state === "panicked").length;
  const activeCount = panicCharacters.filter(isActive).length;

  if (panickedCount >= panicCharacters.length) {
    panicLevel = 5;
  } else if (panickedCount >= Math.ceil(panicCharacters.length / 2)) {
    panicLevel = 4;
  } else if (panickedCount >= 2) {
    panicLevel = 3;
  } else if (activeCount >= 2) {
    panicLevel = 2;
  } else if (panickedCount >= 1) {
    panicLevel = 1;
  } else {
    panicLevel = 0;
  }
}

function updatePanicMovement(entity, deltaTime) {
  entity.panicMoveTimer -= deltaTime;

  if (entity.panicMoveTimer <= 0) {
    entity.panicTargetX = 60 + Math.random() * (WIDTH - 120);
    entity.panicTargetY = 200 + Math.random() * (HEIGHT - 260);
    entity.panicMoveTimer = 0.5 + Math.random() * 0.7;
  }

  const dx = entity.panicTargetX - entity.x;
  const dy = entity.panicTargetY - entity.y;
  const distance = Math.hypot(dx, dy);
  const panicSpeed = entity.speed * 4 * panicSpeedMultiplier;

  if (distance > 2) {
    entity.x += (dx / distance) * panicSpeed * deltaTime;
    entity.y += (dy / distance) * panicSpeed * deltaTime;
    if (Math.abs(dx) > 0.5) entity.direction = dx > 0 ? 1 : -1;
  }

  entity.walkTime += deltaTime * 3;
}

function updateEnteringCharacter(entity, deltaTime) {
  const dx = entity.targetX - entity.x;
  const dy = entity.targetY - entity.y;
  const distance = Math.hypot(dx, dy);

  if (distance > 2) {
    if (Math.abs(dx) > 0.5) entity.direction = dx > 0 ? 1 : -1;
    entity.x += (dx / distance) * entity.speed * deltaTime;
    entity.y += (dy / distance) * entity.speed * deltaTime;
    entity.walkTime += deltaTime;
    return;
  }

  entity.x = entity.targetX;
  entity.y = entity.targetY;
  entity.state = "observing";
  entity.observeDuration = 0.8 + Math.random() * 0.7;
  entity.observeTimer = entity.observeDuration;
  entity.saidMoment = false;
  entity.thought = CHAIN_OBSERVE_THOUGHTS[Math.floor(Math.random() * CHAIN_OBSERVE_THOUGHTS.length)];
  entity.lastThoughtChange = performance.now();
}

function updateChainActivation() {
  for (let i = 1; i < panicCharacters.length; i++) {
    const previous = panicCharacters[i - 1];
    const next = panicCharacters[i];

    if (!next.active && previous.state === "panicked") {
      next.active = true;
      next.activeTimer = performance.now();
      next.state = "entering";
    }
  }
}

function updateChainCharacter(entity, deltaTime) {
  if (!entity.active) return;

  entity.emotionTime += deltaTime;
  entity.panicTime += deltaTime;
  updateBlinking(entity, deltaTime);

  if (entity.state === "entering") {
    updateEnteringCharacter(entity, deltaTime);
    return;
  }

  if (entity.state === "observing") {
    entity.observeTimer -= deltaTime;

    if (!entity.saidMoment && entity.observeTimer < entity.observeDuration / 2) {
      entity.thought = "Moment...";
      entity.saidMoment = true;
    }

    if (entity.observeTimer <= 0) {
      entity.state = "reacting";
    }
    return;
  }

  if (entity.state === "reacting") {
    entity.fear = Math.min(1, entity.fear + deltaTime * 0.25);

    if (entity.fear > PANIC_FEAR_THRESHOLD) {
      entity.state = "panicked";
      entity.thought = CHAIN_REACTION_THOUGHTS[Math.floor(Math.random() * CHAIN_REACTION_THOUGHTS.length)];
      entity.lastThoughtChange = performance.now();
    }
    return;
  }

  if (entity.state === "panicked") {
    updatePanicMovement(entity, deltaTime);
  }
}

function updateIntro(deltaTime) {
  if (!character.introActive) return;

  if (task.step !== 0) {
    character.introActive = false;
    return;
  }

  if (!character.introStarted) {
    character.introStarted = true;
    character.introTimer = 0;
    character.introPhase = 0;
    character.x = 750;
    character.y = 300;
    return;
  }

  character.introTimer += deltaTime;

  const currentPhase = DIALOGS.intro[character.introPhase];
  if (!currentPhase) {
    character.introActive = false;
    return;
  }

  character.thought = currentPhase.text;
  character.lastThoughtChange = performance.now();

  if (currentPhase.action === "walking") {
    character.state = "walking";
    character.targetX = currentPhase.targetX;
    character.targetY = currentPhase.targetY;
    character.direction = currentPhase.targetX > character.x ? 1 : -1;

    const dx = character.targetX - character.x;
    const dy = character.targetY - character.y;
    const distanceToTarget = Math.hypot(dx, dy);

    if (distanceToTarget > 2) {
      character.x += (dx / distanceToTarget) * character.speed * deltaTime;
      character.y += (dy / distanceToTarget) * character.speed * deltaTime;
      character.walkTime += deltaTime;
      if (Math.abs(dx) > 0.5) character.direction = dx > 0 ? 1 : -1;
    } else {
      character.x = character.targetX;
      character.y = character.targetY;
      character.state = "idle";
    }
  } else if (currentPhase.action === "idle") {
    character.state = "idle";
  }

  if (character.introTimer > currentPhase.duration) {
    character.introPhase += 1;
    character.introTimer = 0;
  }
}

function updateCharacterEmotion(deltaTime) {
  character.panicTime += deltaTime;
  updateBlinking(character, deltaTime);

  character.sweatTimer += deltaTime;
  if (character.fear < 0.50) character.sweatTimer = 0;
}

function triggerPanic(entity) {
  entity.state = "panicked";
  entity.thought = "";

  if (entity === character) {
    allowDialogAgain();
  }
}

function updatePanicTrigger() {
  if (character.fear > PANIC_FEAR_THRESHOLD && character.state === "watched") {
    triggerPanic(character);
  }
}

function updateWalkingMovement(deltaTime) {
  const dx = character.targetX - character.x;
  const dy = character.targetY - character.y;
  const distanceToTarget = Math.hypot(dx, dy);
  const movementSpeed = character.speed * (task.completed ? 1 : 1.15);

  if (distanceToTarget > 2) {
    character.state = "walking";
    if (Math.abs(dx) > 0.5) character.direction = dx > 0 ? 1 : -1;

    character.x += (dx / distanceToTarget) * movementSpeed * deltaTime;
    character.y += (dy / distanceToTarget) * movementSpeed * deltaTime;

    if (character.direction === 1 && character.x > character.targetX) character.x = character.targetX;
    if (character.direction === -1 && character.x < character.targetX) character.x = character.targetX;

    character.walkTime += deltaTime;
  } else {
    character.state = "idle";
    character.idleTime += deltaTime;
  }
}


function updateWatchingFearAndMovement(deltaTime) {
  if (character.state === "panicked") {
    updatePanicMovement(character, deltaTime);
    return;
  }

  if (userIsWatching) {
    if (character.state !== "noticed" && character.state !== "watched") {
      character.state = "noticed";
      character.noticeTime = performance.now();
      character.watchedTime = 0;
      character.fear = Math.max(0.05, character.fear);
      return;
    }

    if (character.state === "noticed") {
      if (performance.now() - character.noticeTime > 350) {
        character.state = "watched";
        character.watchedTime = 0;
      }
      return;
    }

    if (character.state === "watched") {
      character.watchedTime += deltaTime;
      character.fear = Math.min(1, character.fear + deltaTime * 0.010);
      return;
    }
  }

  character.safeTime += deltaTime;
  character.fear = Math.max(0, character.fear - deltaTime * 0.1);

  if (character.state === "watched" || character.state === "noticed") {
    character.state = "walking";
    character.watchedTime = 0;
    character.thought = "";
    character.lastThoughtChange = performance.now();
  }

  if (character.isWorking) return;

  updateWalkingMovement(deltaTime);
}

function updateCharacter(deltaTime) {
  if (character.introActive) {
    character.fear = 0;
    updateIntro(deltaTime);
    updateCharacterEmotion(deltaTime);
    return;
  }

  character.emotionTime += deltaTime;

  updateChainActivation();
  for (let i = 1; i < panicCharacters.length; i++) {
    updateChainCharacter(panicCharacters[i], deltaTime);
  }

  updateThought(character, isDialogActive(), userIsWatching, task.step);
  updateDialogSystem(deltaTime, { character, character2, userIsWatching, onPanicTrigger: () => triggerPanic(character) });
  updateCharacterEmotion(deltaTime);
  updatePanicTrigger();

  if (!userIsWatching && character.state !== "panicked") {
    updateTask(deltaTime);
  }

  updateWatchingFearAndMovement(deltaTime);
  updatePanicLevel();
}

function randomChance(percentage) {
  return Math.random() < percentage / 100;
}

const ITEMS = [
  {
    key: "bolt", position: BOLT_POSITION, hasFlag: "hasBolt", draw: drawBoltIcon,
    foundThought: "Gefunden! Zur Werkbank!", mountedThought: "Schraube montiert! Zahnrad suchen..."
  },
  {
    key: "gear", position: GEAR_POSITION, hasFlag: "hasGear", draw: drawGearIcon,
    foundThought: "Zahnrad gefunden!", mountedThought: "Zwei Teile fertig! Feder holen..."
  },
  {
    key: "spring", position: SPRING_POSITION, hasFlag: "hasSpring", draw: drawSpringIcon,
    foundThought: "Feder gefunden!", mountedThought: "Drei Teile erledigt! Weiter geht's..."
  },
  {
    key: "cable", position: CABLE_POSITION, hasFlag: "hasCable", draw: drawCableIcon,
    foundThought: "Kabel! Zur Werkbank!", mountedThought: "Noch ein Teil... der Kristall!"
  },
  {
    key: "crystal", position: CRYSTAL_POSITION, hasFlag: "hasCrystal", draw: drawCrystalIcon,
    foundThought: "Der Kristall! Das letzte Teil!", mountedThought: "Alle Teile montiert! Jetzt aktivieren!"
  }
];

function runGatherStep(position, radius, actionDuration, onComplete) {
  character.targetX = position.x;
  character.targetY = position.y;

  const distance = Math.hypot(character.x - position.x, character.y - position.y);
  if (distance >= radius) return;

  character.state = "working";
  character.isWorking = true;
  character.actionTime += lastDeltaTime;

  if (character.actionTime > actionDuration) {
    character.actionTime = 0;
    character.isWorking = false;
    character.state = "walking";
    character.lastThoughtChange = performance.now();
    onComplete();
  }
}

function updateCrystalRepair(deltaTime, item) {
  character.targetX = WORKBENCH_POSITION.x;
  character.targetY = WORKBENCH_POSITION.y;

  const distance = Math.hypot(character.x - WORKBENCH_POSITION.x, character.y - WORKBENCH_POSITION.y);
  if (distance >= 10) return;

  character.state = "working";
  character.isWorking = true;
  character.actionTime += deltaTime;

  if (task.repairAttempts === 0 && character.actionTime > 0.5) {
    if (randomChance(40)) {
      task.machineNeedsTwiceRepair = true;
    }
    task.repairAttempts += 1;
  }

  const repairDuration = task.machineNeedsTwiceRepair ? 6 : 5;

  if (character.actionTime > repairDuration) {
    character.isWorking = false;
    character.actionTime = 0;
    task.machineFixed = true;
    task[item.hasFlag] = false;
    character.carryingItem = null;
    task.step = 10;
    character.state = "walking";
    character.thought = item.mountedThought;
    character.lastThoughtChange = performance.now();
  }
}

function updateTask(deltaTime) {
  lastDeltaTime = deltaTime;

  if (task.completed) {
    character.isWorking = false;
    return;
  }

  if (character.introActive) return;

  for (let i = 0; i < ITEMS.length; i++) {
    const item = ITEMS[i];
    const findStep = i * 2;
    const mountStep = i * 2 + 1;

    if (task.step === findStep) {
      runGatherStep(item.position, 8, 2.5, () => {
        task[item.hasFlag] = true;
        character.carryingItem = item.key;
        task.step = mountStep;
        character.thought = item.foundThought;
      });
      return;
    }

    if (task.step === mountStep) {
      if (item.key === "crystal") {
        updateCrystalRepair(deltaTime, item);
      } else {
        runGatherStep(WORKBENCH_POSITION, 10, 3.5, () => {
          task[item.hasFlag] = false;
          character.carryingItem = null;
          task.step = mountStep + 1;
          character.thought = item.mountedThought;
        });
      }
      return;
    }
  }

  if (task.step === 10) {
    runGatherStep(WORKBENCH_POSITION, 10, 3, () => {
      task.machineActivated = true;
      task.step = 11;
      character.state = "idle";
      character.thought = "Es funktioniert!";
    });
    return;
  }

  if (task.step === 11) {
    task.completed = true;
    character.state = "idle";
    character.thought = "Endlich... ich bin fertig!";
    character.lastThoughtChange = performance.now();
  }
}

async function setupEyeTracking() {
  try {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
    );

    faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
        delegate: "GPU"
      },
      runningMode: "VIDEO",
      numFaces: 1,
      outputFaceBlendshapes: true
    });
  } catch (error) {
    console.error("Fehler beim Laden des Face Trackings:", error);
  }
}

async function startWebcam() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });

    webcamVideo = document.createElement("video");
    webcamVideo.autoplay = true;
    webcamVideo.playsInline = true;
    webcamVideo.muted = true;
    webcamVideo.srcObject = stream;
    webcamVideo.style.position = "fixed";
    webcamVideo.style.width = "1px";
    webcamVideo.style.height = "1px";
    webcamVideo.style.opacity = "0";
    webcamVideo.style.pointerEvents = "none";
    webcamVideo.style.left = "-100px";
    webcamVideo.style.top = "-100px";

    document.body.appendChild(webcamVideo);
    await webcamVideo.play();

    if (webcamVideo.readyState < 2) {
      await new Promise(resolve => webcamVideo.addEventListener("loadeddata", resolve, { once: true }));
    }

    webcamIsRunning = true;
    detectFace();
  } catch (error) {
    console.error("Webcam konnte nicht gestartet werden:", error);

    webcamIsRunning = false;

    if (webcamVideo && webcamVideo.srcObject) {
      webcamVideo.srcObject.getTracks().forEach(track => track.stop());
      webcamVideo.srcObject = null;
    }

    webcamVideo = null;
    userIsWatching = false;
  }
}

function detectFace() {
  if (!webcamIsRunning || !webcamVideo || !faceLandmarker) {
    if (!webcamIsRunning && webcamVideo && webcamVideo.srcObject) {
      webcamVideo.srcObject.getTracks().forEach(track => track.stop());
      webcamVideo.srcObject = null;
    }
    return;
  }

  if (webcamVideo.readyState >= 2) {
    const now = performance.now();
    const result = faceLandmarker.detectForVideo(webcamVideo, now);

    if (result.faceLandmarks && result.faceLandmarks.length > 0) {
      faceDetected = true;

      const landmarks = result.faceLandmarks[0];
      const leftEye = landmarks[33];
      const rightEye = landmarks[263];
      const nose = landmarks[1];

      const eyeCenterX = (leftEye.x + rightEye.x) / 2;
      const eyeDistance = Math.abs(rightEye.x - leftEye.x);

      if (eyeDistance < 0.0001) {
        lookingAtScreen = false;
        userIsWatching = false;
        requestAnimationFrame(detectFace);
        return;
      }

      lookingAtScreen = Math.abs(nose.x - eyeCenterX) / eyeDistance < 0.28;
    } else {
      faceDetected = false;
      lookingAtScreen = false;
      userIsWatching = false;
      watchingConfidence = 0;
      eyesOpen = false;
      window.eyesClosedTimer = 0;
    }

    if (!result.faceBlendshapes || result.faceBlendshapes.length === 0) {
      eyesOpen = false;
      watchingConfidence = 0;
      userIsWatching = false;
    }

    if (result.faceBlendshapes && result.faceBlendshapes.length > 0) {
      const shapes = result.faceBlendshapes[0].categories;
      const leftBlink = shapes.find(shape => shape.categoryName === "eyeBlinkLeft");
      const rightBlink = shapes.find(shape => shape.categoryName === "eyeBlinkRight");
      const leftBlinkScore = leftBlink ? leftBlink.score : 0;
      const rightBlinkScore = rightBlink ? rightBlink.score : 0;
      const eyesClosed = leftBlinkScore > 0.65 && rightBlinkScore > 0.65;

      const blinkDelta = Math.min((now - lastBlinkTime) / 1000, 0.1);
      lastBlinkTime = now;

      if (eyesClosed) {
        if (!window.eyesClosedTimer) window.eyesClosedTimer = 0;
        window.eyesClosedTimer += blinkDelta;
        eyesOpen = window.eyesClosedTimer < 0.3;
      } else {
        window.eyesClosedTimer = 0;
        eyesOpen = true;
      }

      const currentlyWatching = faceDetected && eyesOpen && lookingAtScreen;

      const trackingNow = performance.now();
      const trackingDelta = Math.min((trackingNow - lastTrackingTime) / 1000, 0.1);
      lastTrackingTime = trackingNow;

      watchingConfidence += currentlyWatching ? trackingDelta * 2.5 : -trackingDelta * 3.5;
      watchingConfidence = Math.max(0, Math.min(1, watchingConfidence));

      userIsWatching = watchingConfidence > 0.65;
    }
  }

  requestAnimationFrame(detectFace);
}

async function startEyeTrackingSystem() {
  await setupEyeTracking();

  if (!faceLandmarker) {
    console.error("Eye Tracking konnte nicht gestartet werden: Face-Landmarker fehlt.");
    return;
  }

  await startWebcam();
}

function gameLoop(currentTime) {
  const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.1);
  lastTime = currentTime;

  if (introScreenActive) {
    drawIntroScreen(ctx, WIDTH, HEIGHT);
    requestAnimationFrame(gameLoop);
    return;
  }

  if (!gameOver) {
    updateCharacter(deltaTime);
    updateMassPanicSequence(deltaTime);
  }

  renderWorld(ctx, WIDTH, HEIGHT, {
    character, secondaryCharacters: panicCharacters.slice(1), task, items: ITEMS, userIsWatching,
    workbenchPosition: WORKBENCH_POSITION, gameOverMessage, gameOver
  });

  requestAnimationFrame(gameLoop);
}

canvas.addEventListener("click", () => {
  if (introScreenActive) {
    introScreenActive = false;
    return;
  }
  if (gameOver || task.completed) location.reload();
});

requestAnimationFrame(gameLoop);
startEyeTrackingSystem();
