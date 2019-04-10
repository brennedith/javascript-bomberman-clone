function render(elements) {
  elements.forEach(element => {
    if (element.length !== undefined) {
      element.forEach(element => element.draw());
    } else if (element !== undefined) {
      element.draw();
    }
  });
}

function loopTiles(callback) {
  for (let x = 0; x < SCREEN_TILES_WIDTH; x++) {
    for (let y = 0; y < SCREEN_TILES_HEIGHT; y++) {
      callback(x, y);
    }
  }
}

function createBorderBlock(x, y, ctx) {
  return new ObstacleBlock(blockBorderAssets, x * BASE_SPRITE_WIDTH, y * BASE_SPRITE_HEIGHT, ctx);
}

function createSolidBlock(x, y, ctx) {
  return new ObstacleBlock(blockSolidAssets, x * BASE_SPRITE_WIDTH, y * BASE_SPRITE_HEIGHT, ctx);
}

function createRemovableBlock(x, y, ctx) {
  return new PerishableBlock(
    blockRemovableAssets,
    x * BASE_SPRITE_WIDTH,
    y * BASE_SPRITE_HEIGHT,
    ctx
  );
}

function createPlayer(assets, x, y, ctx) {
  return new Hero(assets, x, y, BASE_SPRITE_WIDTH, BASE_SPRITE_HEIGHT, ctx);
}

function playerDropsBomb(x, y) {
  const bomb = new Bomb(bombAssets, x, y, ctx);
  const bombIndex = bombsArray.length;
  bombsArray.push(bomb);

  bomb.whenDead(() => {
    delete bombsArray[bombIndex];

    const explosion = new Explosion(flamesAssets, bomb.x, bomb.y, ctx);
    const explosionIndex = explosionArray.length;
    explosionArray.push(explosion);

    explosion.whenDead(() => {
      delete explosionArray[explosionIndex];
    });
  });
}
