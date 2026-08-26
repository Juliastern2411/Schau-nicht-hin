import { DIALOGS } from "./dialogsData.js";

// Verwaltet den gescripteten Warn-Dialog zwischen Figur 1 und Figur 2.

let currentDialog = null;
let currentDialogIndex = 0;
let currentDialogTimer = 0;
// Verhindert, dass der Warn-Dialog direkt nach dem Ende erneut startet
let dialogAvailable = true;

export function isDialogActive() {
  return currentDialog !== null;
}

// Wird aufgerufen, sobald Figur 1 neu in Panik gerät - schaltet den Dialog wieder frei
export function allowDialogAgain() {
  dialogAvailable = true;
}

export function updateDialogSystem(deltaTime, { character, character2, userIsWatching, onPanicTrigger }) {
  if (!currentDialog) {
    if (dialogAvailable && userIsWatching && character.fear > 0.25 && character2.active) {
      currentDialog = DIALOGS.warning;
      currentDialogIndex = 0;
      currentDialogTimer = 0;
    }
    return;
  }

  currentDialogTimer += deltaTime;
  const currentLine = currentDialog[currentDialogIndex];

  if (!currentLine) {
    currentDialog = null;
    currentDialogIndex = 0;
    currentDialogTimer = 0;
    dialogAvailable = false;
    character.thought = "";
    character2.thought = "";

    if (character.fear > 0.65 && character.state !== "panicked") {
      onPanicTrigger();
    }
    return;
  }

  if (currentLine.speaker === "none") {
    character.thought = "";
    character2.thought = "";
  } else if (currentLine.speaker === "character1") {
    character.thought = currentLine.text;
    character.lastThoughtChange = performance.now();
  } else if (currentLine.speaker === "character2") {
    character2.thought = currentLine.text;
    character2.lastThoughtChange = performance.now();
  }

  if (currentDialogTimer > currentLine.duration) {
    currentDialogIndex += 1;
    currentDialogTimer = 0;
  }
}
