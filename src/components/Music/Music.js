var context = null;
var oscillator = null;
function getOrCreateContext() {
  if (!context) {
    context = new AudioContext();
    oscillator = context.createOscillator();
    oscillator.connect(context.destination);
  }
  return context;
  
}
const list = document.getElementById('midi-list');
const debugEl = document.getElementById('debug');

let isStarted = false;

function changeType(type) {
  oscillator.type = type;
}

const lengthNote = 2;
const eps = 0.01;

// This is a tetris theme transposed from https://musescore.com/user/16693/scores/38133
const tetris = [
  [76, 4], [71, 8], [72, 8], [74, 4], [72, 8], [71, 8], [69, 4], [69, 8], [72, 8], [76, 4], [74, 8], [72, 8], [71, 4], [71, 8], [72, 8], [74, 4], [76, 4], [72, 4], [69, 4], [69, 4], [0,  4], [74, 3], [77, 8],[81, 4], [79, 8], [77, 8], [76, 3], [72, 8], [76, 4], [74, 8], [72, 8], [71, 4], [71, 8], [72, 8], [74, 4], [76, 4], [72, 4], [69, 4], [69, 4], [0, 4],
]

function playTetris() {
  getOrCreateContext();
  oscillator.start(0);
  var time = context.currentTime + eps;
  tetris.forEach((note) => {
    const freq = Math.pow(2, (note[0] - 69) / 12) * 440;
    console.log(time);
    oscillator.frequency.setTargetAtTime(0, time - eps, 0.001);
    oscillator.frequency.setTargetAtTime(freq, time, 0.001);
    time += lengthNote / note[1];
  });
  // line added ourselves, unsure if it makes perfect sense
  oscillator.stop(tetris.length / lengthNote);
}

// Note: To shift by an octave you just have to add 12.
// Apparenlty supposed to use that: Math.pow(2, (m-69)/12)*440
  