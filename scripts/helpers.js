// Calls all elements draw method.
function render(elements) {
  elements.forEach(element => {
    if (element.length !== undefined) {
      element.forEach(element => element.draw());
    } else if (element !== undefined) {
      element.draw();
    }
  });
}

// Loops through the scene, base on tiles
function loopTiles(callback) {
  for (let x = 0; x < SCREEN_TILES_WIDTH; x++) {
    for (let y = 0; y < SCREEN_TILES_HEIGHT; y++) {
      callback(x, y);
    }
  }
}

// Returns and array with defined elements
function getDefined(array) {
  if (array === undefined) return [];
  return array.filter(el => el !== undefined);
}

function createBorderBlock(x, y, ctx) {
  return new ObstacleBlock(blockBorderAssets, x * BASE_SPRITE_SIZE, y * BASE_SPRITE_SIZE, ctx);
}

function createSolidBlock(x, y, ctx) {
  return new ObstacleBlock(blockSolidAssets, x * BASE_SPRITE_SIZE, y * BASE_SPRITE_SIZE, ctx);
}

function createRemovableBlock(x, y, ctx) {
  return new PerishableBlock(blockRemovableAssets, x * BASE_SPRITE_SIZE, y * BASE_SPRITE_SIZE, ctx);
}

function createPlayer(assets, x, y, ctx) {
  return new Hero(assets, x, y, BASE_SPRITE_SIZE, BASE_SPRITE_SIZE, ctx);
}

// Callback function for the Hero.drop method.
function playerDropsBomb(x, y, player) {
  player.decreaseAmmo();

  const bomb = new Bomb(bombAssets, x, y, ctx);
  const bombIndex = bombsArray.length;
  bombsArray.push(bomb);

  bomb.whenDead(() => {
    // When dead, removes its object reference from the array
    delete bombsArray[bombIndex];

    const explosion = new Explosion(flamesAssets, bomb.x, bomb.y, ctx);
    const explosionIndex = explosionArray.length;
    explosionArray.push(explosion);

    explosion.whenDead(() => {
      // When dead, removes its object reference from the array
      delete explosionArray[explosionIndex];
    });

    player.increaseAmmo();
  });
}

function gameStart(callback) {
  if (!game.playing) {
    clearInterval(game.interval);
    game.interval = null;

    game.playing = true;

    callback();
  }
}

function gameOver(playersArray, callback) {
  if (game.playing) {
    game.playing = false;

    // Invoques the callback function with the index of the winner
    playersArray.some((player, n) => {
      if (player !== undefined) {
        callback(n);

        return true;
      }
    });
  }
}
