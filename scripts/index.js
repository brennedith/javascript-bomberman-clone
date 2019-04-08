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

(() => {
  const scene = new Scene('assets/background.png', ctx);

  const blocks = [];
  loopScene((x, y) => {
    if (
      x === 0 || // Top Border
      y === 0 || // Left Border
      x === SCREEN_TILES_WIDTH - 1 || // Bottom Border
      y === SCREEN_TILES_HEIGHT - 1 // Right Border
    ) {
      blocks.push(
        new ObstacleBlock(
          'assets/block-hard.png',
          x * BASE_SPRITE_WIDTH,
          y * BASE_SPRITE_HEIGHT,
          ctx
        )
      );
    } else if (x % 2 === 0 && y % 2 === 0) {
      // Middle Blocks
      blocks.push(
        new ObstacleBlock(
          'assets/block-obstacle.png',
          x * BASE_SPRITE_WIDTH,
          y * BASE_SPRITE_HEIGHT,
          ctx
        )
      );
    }
  });

  const hero = new BomberMan(
    bomberManAssets,
    BASE_SPRITE_WIDTH + 1,
    BASE_SPRITE_HEIGHT + 1,
    BASE_SPRITE_WIDTH - 10,
    BASE_SPRITE_HEIGHT - 10,
    ctx
  );

  setInterval(() => {
    render([scene, blocks, hero]);
  }, 1000 / 60);

  document.addEventListener('keydown', e => {
    switch (e.keyCode) {
      case 38:
        hero.moveUp(blocks);
        break;
      case 40:
        hero.moveDown(blocks);
        break;
      case 37:
        hero.moveLeft(blocks);
        break;
      case 39:
        hero.moveRight(blocks);
        break;
    }
  });
  document.addEventListener('keyup', e => {
    hero.stand();
  });
})();

/* TODO
- Add README.md
- Create a destroy -perish(?)- method for PerishableBlock
- Create a destroy -perish(?)- method for BomberMan
- Create Bomb Object
*/
