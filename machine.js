/* Two small toys for machine.html.
   Kept in one file because they both belong to this page only, and both are
   short enough to read in one sitting. */

/* ---------------------------------------------------------------- machine -- */

const theSwitch = document.getElementById('the-switch');
const theHand = document.getElementById('the-hand');
const machineLog = document.getElementById('machine-log');

let handTimer = null;

function setMachineOn(isOn) {
  theSwitch.setAttribute('aria-pressed', String(isOn));
  theSwitch.classList.toggle('is-on', isOn);
  machineLog.textContent = isOn
    ? 'You switched it on. Something is coming…'
    : 'The machine is off. It is waiting.';
}

function pushSwitchBack() {
  // The hand slides in, the switch goes down, the hand leaves.
  theHand.classList.add('is-pushing');
  machineLog.textContent = 'The hand arrives and pushes it back down.';

  window.clearTimeout(handTimer);
  handTimer = window.setTimeout(() => {
    setMachineOn(false);
    theHand.classList.remove('is-pushing');
    theHand.classList.add('is-leaving');
    window.setTimeout(() => theHand.classList.remove('is-leaving'), 420);
  }, 520);
}

theSwitch.addEventListener('click', () => {
  const isOn = theSwitch.getAttribute('aria-pressed') === 'true';
  if (isOn) {
    // Turning it off by hand is allowed; the machine only objects to being on.
    setMachineOn(false);
    return;
  }
  setMachineOn(true);
  pushSwitchBack();
});

/* ------------------------------------------------------------------- game -- */

const board = document.getElementById('game-board');
const startButton = document.getElementById('game-start');
const scoreOut = document.getElementById('game-score');
const timeOut = document.getElementById('game-time');
const hint = document.getElementById('game-hint');

const GAME_SECONDS = 30;

let dot = null;
let score = 0;
let secondsLeft = GAME_SECONDS;
let tickTimer = null;
let playing = false;

function randomSpot() {
  // Keep the dot fully inside the board, whatever the board size is.
  const size = Math.min(64, board.clientWidth / 4);
  const maxX = Math.max(0, board.clientWidth - size);
  const maxY = Math.max(0, board.clientHeight - size);
  return {
    x: Math.random() * maxX,
    y: Math.random() * maxY,
    size,
  };
}

function moveDot() {
  if (!dot) return;
  const { x, y, size } = randomSpot();
  dot.style.width = `${size}px`;
  dot.style.height = `${size}px`;
  dot.style.transform = `translate(${x}px, ${y}px)`;
}

function catchDot() {
  if (!playing) return;
  score += 1;
  scoreOut.textContent = String(score);
  hint.textContent = score === 1 ? 'One. Keep going.' : `${score} and counting.`;
  moveDot();
}

function endGame() {
  playing = false;
  window.clearInterval(tickTimer);
  tickTimer = null;
  startButton.textContent = 'Play again';
  startButton.disabled = false;
  if (dot) dot.remove();
  dot = null;
  hint.textContent =
    score === 0
      ? 'Time. The dot survived untouched.'
      : `Time. You caught ${score} ${score === 1 ? 'dot' : 'dots'}.`;
}

function tick() {
  secondsLeft -= 1;
  timeOut.textContent = String(Math.max(0, secondsLeft));
  if (secondsLeft <= 0) endGame();
}

function startGame() {
  window.clearInterval(tickTimer);
  score = 0;
  secondsLeft = GAME_SECONDS;
  playing = true;
  scoreOut.textContent = '0';
  timeOut.textContent = String(GAME_SECONDS);
  startButton.textContent = 'Playing…';
  startButton.disabled = true;
  hint.textContent = 'Go — tap the dot.';

  if (dot) dot.remove();
  dot = document.createElement('button');
  dot.type = 'button';
  dot.className = 'dot';
  dot.setAttribute('aria-label', 'Catch the dot');
  dot.addEventListener('click', catchDot);
  board.appendChild(dot);
  moveDot();

  tickTimer = window.setInterval(tick, 1000);
}

startButton.addEventListener('click', startGame);

// Moving the dot on resize keeps it reachable instead of leaving it outside the box.
window.addEventListener('resize', () => {
  if (playing) moveDot();
});
