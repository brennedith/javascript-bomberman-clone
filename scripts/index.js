const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 64 * 13;
canvas.height = 54 * 13;

/* Constants */
const BASE_SPRITE_WIDTH = 64;
const BASE_SPRITE_HEIGHT = 54;
const SCREEN_WIDTH = canvas.width;
const SCREEN_HEIGHT = canvas.height;
const SCREEN_TILES_WIDTH = SCREEN_WIDTH / BASE_SPRITE_WIDTH;
const SCREEN_TILES_HEIGHT = SCREEN_HEIGHT / BASE_SPRITE_HEIGHT;

// Staging Area

const blocksArray = [];
const bombsArray = [];
const explosionArray = [];

loopScene((x, y) => {
  if (
    x === 0 || // Top Border
    y === 0 || // Left Border
    x === SCREEN_TILES_WIDTH - 1 || // Bottom Border
    y === SCREEN_TILES_HEIGHT - 1 // Right Border
  ) {
    blocksArray.push(
      new ObstacleBlock(blockBorderAssets, x * BASE_SPRITE_WIDTH, y * BASE_SPRITE_HEIGHT, ctx)
    );
  } else if (x % 3 === 0 && y % 3 === 0) {
    // Middle BlocksArray
    blocksArray.push(
      new ObstacleBlock(blockSolidAssets, x * BASE_SPRITE_WIDTH, y * BASE_SPRITE_HEIGHT, ctx)
    );
  }
});

const scene = new Scene('assets/background.png', ctx);

const hero = new BomberMan(
  bomberManAssets,
  BASE_SPRITE_WIDTH + 1,
  BASE_SPRITE_HEIGHT + 1,
  BASE_SPRITE_WIDTH - 10,
  BASE_SPRITE_HEIGHT - 10,
  ctx
);

setInterval(() => {
  render([scene, explosionArray, blocksArray, bombsArray, hero]);
}, 1000 / 60);

document.addEventListener('keydown', e => {
  const flamesArray = explosionArray.reduce((acc, { flames }) => [...acc, ...flames], []);
  const obstacles = [...blocksArray, ...bombsArray, ...flamesArray];

  switch (e.keyCode) {
    case 32:
      hero.drop(Bomb, bombAssets, bomb => {
        bombsArray.push(bomb);
        bomb.whenDead(() => {
          bombsArray.shift();

          const explosion = new Explosion(flamesAssets, bomb.x, bomb.y, ctx);
          explosionArray.push(explosion);

          explosion.whenDead(() => {
            explosionArray.shift();
          });
        });
      });
      break;
    case 38:
      hero.moveUp(obstacles);
      break;
    case 40:
      hero.moveDown(obstacles);
      break;
    case 37:
      hero.moveLeft(obstacles);
      break;
    case 39:
      hero.moveRight(obstacles);
      break;
  }
});
document.addEventListener('keyup', e => {
  hero.stand();
});

/* TODO
- Add README.md
- Create a destroy -perish(?)- method for PerishableBlock
- Create a destroy -perish(?)- method for BomberMan
*/
