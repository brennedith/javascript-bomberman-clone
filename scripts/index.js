/* Constants */
const BASE_SPRITE_WIDTH = 40;
const BASE_SPRITE_HEIGHT = 40;
const SCREEN_TILES_WIDTH = 25;
const SCREEN_TILES_HEIGHT = 15;
const SCREEN_WIDTH = BASE_SPRITE_HEIGHT * SCREEN_TILES_WIDTH;
const SCREEN_HEIGHT = BASE_SPRITE_HEIGHT * SCREEN_TILES_HEIGHT;

/* First interaction with Canvas */
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = SCREEN_WIDTH;
canvas.height = SCREEN_HEIGHT;

/* Game Elements */
let interval;

const playersArray = [];
const blocksArray = [];
const bombsArray = [];
const explosionArray = [];

loopTiles((x, y) => {
  if (
    x === 0 || // Top Border
    y === 0 || // Left Border
    x === SCREEN_TILES_WIDTH - 1 || // Bottom Border
    y === SCREEN_TILES_HEIGHT - 1 // Right Border
  ) {
    blocksArray.push(createBorderBlock(x, y, ctx));
  } else if (x % 2 === 0 && y % 2 === 0) {
    // Middle BlocksArray
    blocksArray.push(createSolidBlock(x, y, ctx));
  } else {
    if (
      (x > 2 || y > 2) &&
      (x < SCREEN_TILES_WIDTH - 3 || y < SCREEN_TILES_HEIGHT - 3) &&
      Math.random() > 0.75
    ) {
      const perishableBlock = createRemovableBlock(x, y, ctx);
      const perishableBlockIndex = blocksArray.length;
      blocksArray.push(perishableBlock);

      perishableBlock.whenDead(() => {
        delete blocksArray[perishableBlockIndex];
      });
    }
  }
});

const scene = new Scene('assets/background.png', ctx);

const player1 = createPlayer(hero1Assets, BASE_SPRITE_WIDTH, BASE_SPRITE_HEIGHT, ctx);
const player2 = createPlayer(
  hero2Assets,
  SCREEN_WIDTH - BASE_SPRITE_WIDTH * 2,
  SCREEN_HEIGHT - BASE_SPRITE_HEIGHT * 2,
  ctx
);

interval = setInterval(() => {
  render([scene, explosionArray, bombsArray, blocksArray, player1, player2]);
  const flamesArray = explosionArray.reduce((acc, explosion) => [...acc, ...explosion.flames], []);
  flamesArray.forEach(flame => {
    player1.willIDie(flame);
    player2.willIDie(flame);
    blocksArray.forEach(perishableBlock => {
      perishableBlock.willIDie(flame);
    });
  });
}, 1000 / 60);

document.addEventListener('keydown', e => {
  const obstacles = [...blocksArray].filter(obstacle => obstacle !== undefined);

  switch (e.keyCode) {
    case 69: // Space
      player1.drop(playerDropsBomb);
      break;
    case 87: // W
      player1.moveUp(obstacles);
      break;
    case 83: // Arrow Down
      player1.moveDown(obstacles);
      break;
    case 65: // Arrow Left
      player1.moveLeft(obstacles);
      break;
    case 68: // Arrow Right
      player1.moveRight(obstacles);
      break;

    case 32: // Space
      player2.drop(playerDropsBomb);
      break;
    case 38: // Arrow Up
      player2.moveUp(obstacles);
      break;
    case 40: // Arrow Down
      player2.moveDown(obstacles);
      break;
    case 37: // Arrow Left
      player2.moveLeft(obstacles);
      break;
    case 39: // Arrow Right
      player2.moveRight(obstacles);
      break;
  }
});
document.addEventListener('keyup', e => {
  player1.stand();
  player2.stand();
});

/* TODO
- Add README.md
- Smooth hero movement
- Animate perishable blocks dead
*/
