const Key = {
  _pressed: {},

  E: 69,
  W: 87,
  S: 83,
  A: 65,
  D: 68,
  CTRL: 17,
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
  if (!game.playing && event.keyCode === 13) {
    gameStart(level1);
  }

  if (game.playing) {
    Key.onKeydown(event);
  }
});
document.addEventListener('keyup', event => {
  if (game.playing) {
    Key.onKeyup(event);
  }

  getDefined(playersArray).forEach(player => player.stand());
});
