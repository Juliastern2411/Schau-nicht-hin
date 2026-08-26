import { THOUGHTS, TASK_THOUGHTS } from "./thoughtsData.js";

// Verwaltet die Angst-abhängigen Gedankenblasen der Hauptfigur: Auswahl,
// Wiederholungsschutz und die feste skeptical-Einstiegsreihenfolge.

let shownThoughts = { skeptical: [], suspicious: [], afraid: [], panicked: [] };
let shownTaskThoughts = {};
let currentThoughtPhase = "neutral";
// Zählt die feste Einstiegs-Reihenfolge beim (erneuten) Betreten der skeptical-Phase
let skepticalIntroStep = 0;
let thoughtPauseTimer = 0;
let thoughtPauseDuration = 0;
let isThoughtPause = false;

function getNewThought(phase) {
  const phaseThoughts = THOUGHTS[phase];
  const shownInPhase = shownThoughts[phase];
  const availableThoughts = phaseThoughts.filter(thought => !shownInPhase.includes(thought));

  if (availableThoughts.length === 0) {
    shownThoughts[phase] = [];
    return phaseThoughts[Math.floor(Math.random() * phaseThoughts.length)];
  }

  const newThought = availableThoughts[Math.floor(Math.random() * availableThoughts.length)];
  shownThoughts[phase].push(newThought);
  return newThought;
}

function getNewTaskThought(taskStep) {
  const stepThoughts = TASK_THOUGHTS[taskStep];
  if (!stepThoughts || stepThoughts.length === 0) return "";

  const shownForStep = shownTaskThoughts[taskStep] || [];
  const availableThoughts = stepThoughts.filter(thought => !shownForStep.includes(thought));

  if (availableThoughts.length === 0) {
    shownTaskThoughts[taskStep] = [];
    return stepThoughts[Math.floor(Math.random() * stepThoughts.length)];
  }

  const newThought = availableThoughts[Math.floor(Math.random() * availableThoughts.length)];
  shownTaskThoughts[taskStep] = [...shownForStep, newThought];
  return newThought;
}

// Aktualisiert character.thought abhängig von fear. `hasActiveDialog` unterdrückt
// die normale Gedankenrotation, solange ein gescripteter Dialog läuft.
export function updateThought(character, hasActiveDialog, userIsWatching, taskStep) {
  const now = performance.now();

  if (character.introActive || hasActiveDialog) return;

  thoughtPauseTimer += (now - character.lastThoughtTime || now) / 1000;
  character.lastThoughtTime = now;

  if (isThoughtPause) {
    if (thoughtPauseTimer > thoughtPauseDuration) {
      isThoughtPause = false;
      thoughtPauseTimer = 0;

      let newThought = "";

      if (!userIsWatching && character.state !== "panicked") {
        currentThoughtPhase = "task";
        newThought = getNewTaskThought(taskStep);
      } else {
        let phase;
        if (character.fear < 0.35) {
          phase = "skeptical";
        } else if (character.fear < 0.65) {
          phase = "suspicious";
        } else if (character.fear < 0.85) {
          phase = "afraid";
        } else {
          phase = "panicked";
        }

        if (phase === "skeptical" && currentThoughtPhase !== "skeptical") {
          skepticalIntroStep = 0;
        }
        currentThoughtPhase = phase;

        if (phase === "skeptical" && skepticalIntroStep < 2) {
          newThought = skepticalIntroStep === 0 ? "Ein Moment..." : "Wer ist das denn?";
          shownThoughts.skeptical.push(newThought);
          skepticalIntroStep += 1;
        } else {
          newThought = getNewThought(phase);
        }
      }

      character.thought = newThought;
      character.lastThoughtChange = now;
      thoughtPauseDuration = 2.2;
    }
    return;
  }

  if (thoughtPauseTimer > thoughtPauseDuration) {
    isThoughtPause = true;
    character.thought = "";
    thoughtPauseTimer = 0;
    thoughtPauseDuration = 2.5;
  }
}
