const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 50 * 19;
canvas.height = 50 * 15;

/* Constants */
const BASE_SPRITE_WIDTH = 50;
const BASE_SPRITE_HEIGHT = 50;
const SCREEN_WIDTH = canvas.width;
const SCREEN_HEIGHT = canvas.height;
const SCREEN_TILES_WIDTH = SCREEN_WIDTH / BASE_SPRITE_WIDTH;
const SCREEN_TILES_HEIGHT = SCREEN_HEIGHT / BASE_SPRITE_HEIGHT;

// Staging Area

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
    if ((x > 2 || y > 2) && Math.random() > 0.5) {
      blocksArray.push(createRemovableBlock(x, y, ctx));
    }
  }
});

const scene = new Scene('assets/background.png', ctx);

const hero = new BomberMan(
  bomberManAssets,
  BASE_SPRITE_WIDTH,
  BASE_SPRITE_HEIGHT,
  BASE_SPRITE_WIDTH,
  BASE_SPRITE_HEIGHT,
  ctx
);

setInterval(() => {
  render([scene, explosionArray, bombsArray, blocksArray, hero]);

  const flamesArray = explosionArray.reduce((acc, explosion) => [...acc, ...explosion.flames], []);
  flamesArray.forEach(flame => {
    hero.willIDie(flame);
    blocksArray.forEach((perishable, i) => {
      if (perishable.willIDie(flame)) {
        delete blocksArray[i];
      }
    });
  });
}, 1000 / 60);

document.addEventListener('keydown', e => {
  const obstacles = [...blocksArray].filter(obstacle => obstacle !== undefined);

  switch (e.keyCode) {
    case 32:
      hero.drop((x, y) => {
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
