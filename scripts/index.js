/* Constants */
const BASE_SPRITE_SIZE = 40;
const SCREEN_TILES_WIDTH = 25;
const SCREEN_TILES_HEIGHT = 15;
const SCREEN_WIDTH = BASE_SPRITE_SIZE * SCREEN_TILES_WIDTH;
const SCREEN_HEIGHT = BASE_SPRITE_SIZE * SCREEN_TILES_HEIGHT;

/* First interaction with Canvas */
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = SCREEN_WIDTH;
canvas.height = SCREEN_HEIGHT;

/* Game Elements */
let interval;

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

const scene = new Scene('assets/images/background.png', ctx);

const player1 = createPlayer(hero1Assets, BASE_SPRITE_SIZE, BASE_SPRITE_SIZE, ctx);
const player2 = createPlayer(
  hero2Assets,
  SCREEN_WIDTH - BASE_SPRITE_SIZE * 2,
  SCREEN_HEIGHT - BASE_SPRITE_SIZE * 2,
  ctx
);

interval = setInterval(() => {
  render([scene, explosionArray, bombsArray, blocksArray, player1, player2]);

  const flamesArray = explosionArray.reduce(
    (acc, explosion) => [...acc, ...explosion.getFlames()],
    []
  );
  flamesArray.forEach(flame => {
    player1.willIDie(flame);
    player2.willIDie(flame);
    blocksArray.forEach(perishableBlock => {
      perishableBlock.willIDie(flame);
    });
  });

  const obstacles = [...blocksArray].filter(obstacle => obstacle !== undefined);

  if (Key.isDown(Key.E)) player1.drop(playerDropsBomb);
  if (Key.isDown(Key.W)) player1.moveUp(obstacles);
  if (Key.isDown(Key.S)) player1.moveDown(obstacles);
  if (Key.isDown(Key.A)) player1.moveLeft(obstacles);
  if (Key.isDown(Key.D)) player1.moveRight(obstacles);
  if (Key.isDown(Key.SPACE)) player2.drop(playerDropsBomb);
  if (Key.isDown(Key.UP)) player2.moveUp(obstacles);
  if (Key.isDown(Key.DOWN)) player2.moveDown(obstacles);
  if (Key.isDown(Key.LEFT)) player2.moveLeft(obstacles);
  if (Key.isDown(Key.RIGHT)) player2.moveRight(obstacles);
}, 1000 / 60);

/* TODO
- Add README.md
*/
