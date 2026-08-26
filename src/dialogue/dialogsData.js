// Feste Dialogzeilen zwischen den Figuren bzw. während des Intros
export const DIALOGS = {
  warning: [
    { speaker: "character1", text: "Pass auf...", duration: 1.5 },
    { speaker: "character2", text: "Was ist denn?", duration: 1.5 },
    { speaker: "character1", text: "Der Riese beobachtet mich!", duration: 2 },
    { speaker: "character2", text: "Welcher Riese?", duration: 1.5 },
    { speaker: "character1", text: "Schau nicht hin!", duration: 1.5 },
  ],
  intro: [
    { speaker: "character1", text: "Endlich Zeit für die Maschine...", duration: 2.2, action: "idle" },
    { speaker: "character1", text: "Ich brauche noch ein paar Teile dafür.", duration: 2.8, action: "idle" },
    { speaker: "character1", text: "Die hatte ich doch hier hingelegt...", duration: 4, action: "walking", targetX: 550, targetY: 350 },
    { speaker: "character1", text: "Moment... wo sind sie denn?", duration: 2.5, action: "idle" },
  ]
};
