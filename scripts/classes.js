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
  }

  animate() {
    this.animateInterval = setInterval(() => {
      this.frame++;
    }, this.updateFrequency);
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

    const anySolid = obstacles.some(obstacle => {
      return this.checkCollision(obstacle, newCoordinates) && obstacle.isSolid;
    });
    const anyLetal = obstacles.some(obstacle => {
      return this.checkCollision(obstacle, newCoordinates) && obstacle.isLetal;
    });

    if (anySolid) return;
    if (anyLetal) {
      this.frames = 0;
      this.direction = 'died';
      this.status = 'stand';
    }

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

  drop(Type, assets, callback) {
    const instance = new Type(assets, this.x, this.y, ctx);
    callback(instance);
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

    this.whenDeadCallback = null;
    this.diesTimeout = null;
    this.preparingToDie();
  }

  draw() {
    this.flames.forEach(flame => flame.draw());
  }

  preparingToDie() {
    this.diesTimeout = setTimeout(() => {
      this.whenDeadCallback();
    }, 750);
  }

  whenDead(callback) {
    this.whenDeadCallback = callback;
  }
}

class Bomb extends Sprite {
  constructor(assets, x, y, ctx, updateFrequency = 2000 / 3) {
    super(assets, x, y, BASE_SPRITE_WIDTH, BASE_SPRITE_HEIGHT, ctx, updateFrequency);

    this.assets = assets;

    this.whenDeadCallback = null;
    this.diesTimeout = null;
    this.preparingToDie();
  }

  preparingToDie() {
    this.diesTimeout = setTimeout(() => {
      this.whenDeadCallback();
    }, 2000);
  }

  whenDead(callback) {
    this.whenDeadCallback = callback;
  }

  draw() {
    const { sprites } = this.assets.image;

    this.drawSprite(sprites);
  }
}
