// Reine Gedanken-Texte, aufgeteilt nach Angst-Phase der Hauptfigur
export const THOUGHTS = {
  skeptical: [
    "Ein Moment...", "Wer ist das denn?", "Warum schaut er mich an?", "Will er etwas von mir?",
    "Das ist... seltsam.", "Ich kenne ihn nicht.", "Was schaut der denn so?",
    "Warum starrt er?", "Das ist unangenehm.", "Sollte ich weglaufen?",
    "Wer ist dieser Fremde?", "Das gefällt mir nicht.", "Warum beobachtet er mich?",
    "Das ist komisch.", "Ich bin hier nicht sicher.", "Was will dieser Riese?",
    "Das Gefühl... kenne ich nicht.", "Ist das normal?", "Warum schaut der mich nur an?"
  ],
  suspicious: [
    "Er hatte doch gerade weggeschaut...", "Warum starrt er mich JETZT wieder an?",
    "Das ist kein Zufall.", "Er verfolgt mich mit den Augen.", "Das wird mir zu viel.",
    "Ich mag das nicht.", "Der schaut mich ja an wie ein Raubtier.", "Was hat er vor?",
    "Das ist eine Bedrohung.", "Warum kann er nicht woanders hinschauen?",
    "Diese Augen... sie sehen MICH.", "Ich bin sein Ziel.", "Er beobachtet jeden Schritt.",
    "Das ist Absicht.", "Er wartet auf etwas.", "Ich weiß nicht, was er will.",
    "Das macht mir Angst.", "Wie lange schaut er schon?", "Er blinzelt nicht mal.",
    "Diese Stille... es ist unheimlich."
  ],
  afraid: [
    "Ich halte das nicht aus!", "Bitte geh weg!", "Nicht bewegen... nicht atmen...",
    "Vielleicht sieht er mich nicht wenn ich still bin.", "Warum ist dieser Riese hier?",
    "Ich bin gefangen.", "Wie lange noch?", "Die Augen... so groß... so nah.",
    "Ich muss mich verstecken.", "Das ist der Horror.", "Bitte hör auf mich anzuschauen!",
    "Ich werde beobachtet.", "Ich bin völlig ausgeliefert.", "Das kann nicht wahr sein.",
    "Ich bin Beute.", "Diese Präsenz... sie erdrückt mich.", "Kann niemand mir helfen?",
    "Das ist unmöglich zu ertragen.", "Mein Herz rast.", "Ich muss weg von hier."
  ],
  panicked: [
    "ICH MUSS HIER WEG!", "JETZT GLEICH!", "RUN! RUN! RUN!", "HILF MIR!",
    "NEIN NEIN NEIN!", "DIE AUGEN!", "MACH DICH KLEIN!", "VERSTECK DICH!",
    "KEINE ZEIT!", "NICHT SEHEN LASSEN!"
  ]
};

// Gedanken der Panik-Kettenreaktion (Figur 2, 3, 4, 5, ...)
export const CHAIN_OBSERVE_THOUGHTS = [
  "Was ist hier los?", "Warum rennt der?!", "Warum hat der so Angst?", "Er schaut den Riesen an!"
];

export const CHAIN_REACTION_THOUGHTS = [
  "OH NEIN!", "OH.", "DER SIEHT UNS!", "LAUF!", "NICHT HINSCHAUEN!", "ER HAT AUCH ANGST!"
];

// Alltagsgedanken zur Aufgabe, während der Nutzer NICHT hinschaut (Schlüssel = task.step)
export const TASK_THOUGHTS = {
  0: ["Ich suche erstmal die Schraube, wo ist sie denn?", "Wo hab ich die Schraube nur hingelegt?", "Ich muss die Schraube finden..."],
  1: ["Ab zur Werkbank damit.", "Die Schraube muss ich noch anbringen.", "Weiter zur Werkbank..."],
  2: ["Jetzt brauch ich noch das Zahnrad.", "Wo ist bloß das Zahnrad?", "Ich suche das Zahnrad..."],
  3: ["Das Zahnrad muss noch montiert werden.", "Ab zur Werkbank mit dem Zahnrad."],
  4: ["Jetzt fehlt nur noch die Feder.", "Wo ist die Feder hin?", "Ich suche die Feder..."],
  5: ["Die Feder muss noch rein.", "Schnell zur Werkbank mit der Feder."],
  6: ["Als Nächstes brauch ich das Kabel.", "Wo ist das Kabel geblieben?", "Ich suche das Kabel..."],
  7: ["Das Kabel muss noch angeschlossen werden.", "Ab zur Werkbank mit dem Kabel."],
  8: ["Jetzt fehlt nur noch der Kristall.", "Wo ist der Kristall nur?", "Ich suche den Kristall..."],
  9: ["Der Kristall braucht eine Reparatur.", "Ich muss den Kristall reparieren."],
  10: ["Gleich ist die Maschine fertig.", "Nur noch aktivieren..."],
  11: ["Endlich fertig!", "Die Maschine läuft!"]
};
