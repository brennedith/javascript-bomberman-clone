// Pressed keys log
const Key = {
  _pressed: {},

  F: 70,
  W: 87,
  S: 83,
  A: 65,
  D: 68,
  SHIFT: 16,
  UP: 38,
  DOWN: 40,
  LEFT: 37,
  RIGHT: 39,

  isDown(keyCode) {
    return this._pressed[keyCode];
  },
  onKeydown(event) {
    this._pressed[event.keyCode] = true;
  },
  onKeyup(event) {
    delete this._pressed[event.keyCode];
  }
};

window.addEventListener('keydown', event => {
  if (game.playing) {
    // While the game is playing, add to pressed keys log
    Key.onKeydown(event);
  } else {
    if (event.keyCode === 13) {
      // If the game is no playing, run gameStart with Enter
      gameStart(level1);
    }
  }
});

document.addEventListener('keyup', event => {
  if (game.playing) {
    // While the game is playing, remove from pressed keys log
    Key.onKeyup(event);
  }

  // TODO: Make it part of the Hero class
  getDefined(playersArray).forEach(player => player.stand()); // Reset player animation
});
