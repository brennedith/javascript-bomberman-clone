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
    for (let x = 0; x < SCREEN_TILES_WIDTH; x++) {
      for (let y = 0; y < SCREEN_TILES_HEIGHT; y++) {
        ctx.drawImage(
          img,
          x * BASE_SPRITE_WIDTH,
          y * BASE_SPRITE_HEIGHT,
          BASE_SPRITE_WIDTH,
          BASE_SPRITE_HEIGHT
        );
      }
    }
  }
}

class Sprite {
  constructor(assets, x, y, w, h, ctx, updateFrequency = 1000) {
    this.img = new Image();
    this.img.src = assets.image.src;

    this.x = x;
    this.y = y;

    this.w = w;
    this.h = h;

    this.ctx = ctx;

    this.frame = 0;

    this.updateFrequency = updateFrequency;
    this.animateInterval = null;

    if (updateFrequency > 0) {
      this.animate();
    }

    this.whenDeadCallback = null;
  }

  drawSprite(sprites) {
    const { img, x, y, w, h, frame, ctx } = this;
    let sx, sy, sw, sh;

    if (sprites[0].length !== undefined) {
      [sx, sy, sw, sh] = sprites[frame % sprites.length];
    } else {
      [sx, sy, sw, sh] = sprites;
    }

    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  }

  animate() {
    this.animateInterval = setInterval(() => {
      this.frame++;
    }, this.updateFrequency);
  }

  whenDead(callback) {
    this.whenDeadCallback = callback;
  }

  willIDie() {}
}

class Block extends Sprite {
  constructor(assets, x, y, ctx) {
    super(assets, x, y, BASE_SPRITE_WIDTH, BASE_SPRITE_HEIGHT, ctx, 0);

    this.assets = assets;

    this.isSolid = true;
  }

  draw() {
    const { sprites } = this.assets.image;

    this.drawSprite(sprites);
  }
}

class ObstacleBlock extends Block {
  constructor(assets, x, y, ctx) {
    super(assets, x, y, ctx);
  }
}

class PerishableBlock extends Block {
  constructor(assets, x, y, ctx) {
    super(assets, x, y, ctx);

    this.isSolid = true;
  }

  checkCollision(obstacle) {
    const { x, y } = this;

    // Checks collision
    return (
      x <= obstacle.x + obstacle.w &&
      x + this.w >= obstacle.x &&
      y <= obstacle.y + obstacle.h &&
      y + this.h >= obstacle.y
    );
  }

  willIDie(obstacle) {
    if (this.checkCollision(obstacle) && obstacle.isLetal) {
      return true;
    }
    return false;
  }
}

class BomberMan extends Sprite {
  constructor(assets, x, y, w, h, ctx, updateFrequency = 300) {
    super(assets, x, y, w, h, ctx, updateFrequency);

    this.assets = assets;

    this.direction = 'front';
    this.status = 'stand';
    this.step = 5;
  }

  draw() {
    const { assets, direction, status } = this;
    const sprites = assets.image.sprites[direction][status];

    this.drawSprite(sprites);
  }

  checkCollision(obstacle, coordinates = this) {
    const { x, y } = coordinates;

    // Checks collision
    return (
      x + 1 <= obstacle.x + obstacle.w &&
      x + this.w - 1 >= obstacle.x &&
      y + 1 <= obstacle.y + obstacle.h &&
      y + this.h - 1 >= obstacle.y
    );
  }

  willIDie(obstacle) {
    if (this.checkCollision(obstacle) && obstacle.isLetal) {
      this.direction = 'died';
      this.status = 'stand';
      this.frames = 0;

      return true;
    }
    return false;
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

    const anySolid = obstacles.some(obstacle => {
      return this.checkCollision(obstacle, newCoordinates) && obstacle.isSolid;
    });

    if (anySolid) return;

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

  drop(callback) {
    callback(this.x, this.y);
  }
}

class Bomb extends Sprite {
  constructor(assets, x, y, ctx, updateFrequency = 2000 / 3) {
    super(assets, x, y, BASE_SPRITE_WIDTH, BASE_SPRITE_HEIGHT, ctx, updateFrequency);

    this.assets = assets;

    this.diesTimeout = null;
    this.preparingToDie();
  }

  draw() {
    const { sprites } = this.assets.image;

    this.drawSprite(sprites);
  }

  preparingToDie() {
    this.diesTimeout = setTimeout(() => {
      this.whenDeadCallback();
    }, 2000);
  }
}

class Flame extends Sprite {
  constructor(assets, x, y, direction, type, ctx) {
    super(assets, x, y, BASE_SPRITE_WIDTH, BASE_SPRITE_HEIGHT, ctx);

    this.assets = assets;

    this.direction = direction;
    this.type = type;

    this.isLetal = true;
  }

  draw() {
    const { assets, direction, type } = this;

    const sprites = assets.image.sprites[direction][type];

    this.drawSprite(sprites);
  }
}

class Explosion {
  constructor(assets, x, y, ctx) {
    this.flames = [
      new Flame(assets, x - BASE_SPRITE_WIDTH * 2, y, 'vertical', 'start', ctx),
      new Flame(assets, x - BASE_SPRITE_WIDTH, y, 'vertical', 'middle', ctx),
      new Flame(assets, x + BASE_SPRITE_WIDTH, y, 'vertical', 'middle', ctx),
      new Flame(assets, x + BASE_SPRITE_WIDTH * 2, y, 'vertical', 'end', ctx),
      new Flame(assets, x, y, 'center', 'center', ctx),
      new Flame(assets, x, y - BASE_SPRITE_HEIGHT * 2, 'horizontal', 'start', ctx),
      new Flame(assets, x, y - BASE_SPRITE_HEIGHT, 'horizontal', 'middle', ctx),
      new Flame(assets, x, y + BASE_SPRITE_HEIGHT, 'horizontal', 'middle', ctx),
      new Flame(assets, x, y + BASE_SPRITE_HEIGHT * 2, 'horizontal', 'end', ctx)
    ];

    this.diesTimeout = null;
    this.whenDeadCallback = null;
    this.preparingToDie();
  }

  draw() {
    this.flames.forEach(flame => flame.draw());
  }

  whenDead(callback) {
    this.whenDeadCallback = callback;
  }

  preparingToDie() {
    this.diesTimeout = setTimeout(() => {
      this.whenDeadCallback();
    }, 750);
  }
}
