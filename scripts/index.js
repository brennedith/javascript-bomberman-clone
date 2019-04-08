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

/* Classes */
class Scene {
  constructor(img, ctx) {
    this.img = new Image();
    this.img.src = img;
    this.img.onload = () => {
      this.draw();
    };

    this.ctx = ctx;
  }

  draw() {
    const { img, ctx } = this;

    // Draws the background image over the x and y axis
    loopScene((x, y) => {
      ctx.drawImage(
        img,
        x * BASE_SPRITE_WIDTH,
        y * BASE_SPRITE_HEIGHT,
        BASE_SPRITE_WIDTH,
        BASE_SPRITE_HEIGHT
      );
    });
  }
}

class BaseBlock {
  constructor(img, x, y, ctx) {
    this.img = new Image();
    this.img.src = img;
    this.img.onload = () => {
      this.draw();
    };

    this.x = x;
    this.y = y;

    this.w = BASE_SPRITE_WIDTH;
    this.h = BASE_SPRITE_HEIGHT;

    this.ctx = ctx;

    this.canCollision = false;
    this.canPerish = false;
  }
  draw() {
    const { img, x, y, w, h, ctx } = this;

    ctx.drawImage(img, x, y, w, h);
  }
}

class ObstacleBlock extends BaseBlock {
  constructor(img, x, y, ctx) {
    super(img, x, y, ctx);

    this.canCollision = true;
  }
}

class PerishableBlock extends BaseBlock {
  constructor(x, y, ctx) {
    super('assets/block-soft.png', x, y, ctx);

    this.canCollision = true;
    this.canPerish = true;
  }
}

class BomberMan {
  constructor(img, x, y, w, h, ctx) {
    this.img = new Image();
    this.img.src = img;
    this.img.onload = () => {
      this.draw();
    };

    this.x = x;
    this.y = y;

    this.w = w;
    this.h = h;

    this.ctx = ctx;

    this.steps = 5;
  }

  draw() {
    const { img, x, y, w, h, ctx } = this;

    ctx.drawImage(img, x, y, w, h);
  }

  checkCollision(obstacle, coordinates) {
    const { x, y } = coordinates;

    // Checks collision
    return (
      x <= obstacle.x + obstacle.w &&
      x + this.w >= obstacle.x &&
      y <= obstacle.y + obstacle.h &&
      y + this.h >= obstacle.y
    );
  }

  move(axis, n, obstacles) {
    const opositeAxis = axis === 'x' ? 'y' : 'x';
    const newPosition = this[axis] + n;
    const oldOpositePosition = this[opositeAxis];
    const newCoordinates = {
      [axis]: newPosition,
      [opositeAxis]: oldOpositePosition
    };

    // Won't move is collides with other object
    if (obstacles.some(obstacle => this.checkCollision(obstacle, newCoordinates))) return;

    this[axis] = newPosition;
  }
  moveUp(obstacles) {
    this.move('y', -this.steps, obstacles);
  }
  moveDown(obstacles) {
    this.move('y', this.steps, obstacles);
  }
  moveLeft(obstacles) {
    this.move('x', -this.steps, obstacles);
  }
  moveRight(obstacles) {
    this.move('x', this.steps, obstacles);
  }
}

// Helper functions
function loopScene(callback) {
  for (let x = 0; x < SCREEN_TILES_WIDTH; x++) {
    for (let y = 0; y < SCREEN_TILES_HEIGHT; y++) {
      callback(x, y);
    }
  }
}

function render(elements) {
  elements.forEach(element => {
    if (element.length > 0) {
      element.forEach(element => element.draw());
    } else {
      element.draw();
    }
  });
}

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
    } else if (x % 3 === 0 && y % 3 === 0) {
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
    'assets/front0.png',
    BASE_SPRITE_WIDTH + 1,
    BASE_SPRITE_HEIGHT + 1,
    BASE_SPRITE_WIDTH,
    BASE_SPRITE_HEIGHT,
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
})();

/* TODO
- Add README.md
- Create a destroy -perish(?)- method for PerishableBlock
- Create sprite animation for BomberMan
- Create Bomb Object
*/
