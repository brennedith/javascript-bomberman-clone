function loopScene(callback) {
  for (let x = 0; x < SCREEN_TILES_WIDTH; x++) {
    for (let y = 0; y < SCREEN_TILES_HEIGHT; y++) {
      callback(x, y);
    }
  }
}

function render(elements) {
  elements.forEach(element => {
    if (element.length !== undefined) {
      element.forEach(element => element.draw());
    } else {
      element.draw();
    }
  });
}
