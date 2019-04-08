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
  constructor(assets, x, y, w, h, ctx) {
    this.assets = assets;

    this.img = new Image();
    this.img.src = assets.image.src;
    this.img.onload = () => {
      this.draw();
    };

    this.x = x;
    this.y = y;

    this.w = w;
    this.h = h;

    this.ctx = ctx;

    this.direction = 'front';
    this.status = 'stand';
    this.totalSteps = 0;
    this.step = 5;

    this.interval = null;
    this.changeFootOnWalk();
  }

  changeFootOnWalk() {
    this.interval = setInterval(() => {
      this.totalSteps++;
    }, 500);
  }

  draw() {
    const { assets, img, x, y, w, h, ctx, status, direction, totalSteps } = this;
    const spriteCoordinates = assets.image.sprite[direction][status];
    let sx, sy, sw, sh;

    if (status === 'walk') {
      [sx, sy, sw, sh] = spriteCoordinates[totalSteps % spriteCoordinates.length];
    } else {
      [sx, sy, sw, sh] = spriteCoordinates;
    }

    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
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

  stand() {
    this.status = 'stand';
  }

  move(axis, n, obstacles) {
    this.status = 'walk';

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
    this.direction = 'back';
    this.move('y', -this.step, obstacles);
  }
  moveDown(obstacles) {
    this.direction = 'front';
    this.move('y', this.step, obstacles);
  }
  moveLeft(obstacles) {
    this.direction = 'left';
    this.move('x', -this.step, obstacles);
  }
  moveRight(obstacles) {
    this.direction = 'right';
    this.move('x', this.step, obstacles);
  }
}
