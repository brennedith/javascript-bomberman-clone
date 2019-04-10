class Scene {
  constructor(assets, ctx) {
    this.assets = assets;

    this.img = new Image();
    this.img.src = assets.image.src;

    this.audio = new Audio();
    this.audio.src = assets.audio.src;
    this.audio.addEventListener('ended', () => {
      this.audio.currentTime = 0;
      this.audio.play();
    });
    this.audio.play();

    this.ctx = ctx;
  }

  draw() {
    const { assets, img, ctx } = this;
    const [sx, sy, sw, sh] = assets.image.sprites;

    // Draws the background image over the x and y axis
    for (let x = 0; x < SCREEN_TILES_WIDTH; x++) {
      for (let y = 0; y < SCREEN_TILES_HEIGHT; y++) {
        ctx.drawImage(
          img,
          sx,
          sy,
          sw,
          sh,
          x * BASE_SPRITE_SIZE,
          y * BASE_SPRITE_SIZE,
          BASE_SPRITE_SIZE,
          BASE_SPRITE_SIZE
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
    super(assets, x, y, BASE_SPRITE_SIZE, BASE_SPRITE_SIZE, ctx, 0);

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

    this.status = 'alive';
  }

  draw() {
    const { assets, status } = this;
    const sprites = assets.image.sprites[status];

    this.drawSprite(sprites);
  }

  checkCollision(obstacle) {
    const { x, y } = this;

    // Checks collision
    return (
      x <= obstacle.x + obstacle.w / 2 &&
      x + this.w / 2 >= obstacle.x &&
      y <= obstacle.y + obstacle.h / 2 &&
      y + this.h / 2 >= obstacle.y
    );
  }

  preparingToDie() {
    setTimeout(() => {
      this.whenDeadCallback();
    }, 500);
  }

  willIDie(obstacle) {
    if (this.checkCollision(obstacle) && obstacle.isLetal) {
      this.status = 'dead';

      this.preparingToDie();
    }
  }
}

class Hero extends Sprite {
  constructor(assets, x, y, w, h, ctx, updateFrequency = 300) {
    super(assets, x, y, w, h, ctx, updateFrequency);

    this.assets = assets;

    this.directionAxis = 'x';
    this.direction = 'front';
    this.status = 'stand';
    this.step = 3;

    this.diesAudio = new Audio();
    this.diesAudio.src = assets.audio.died;

    this.ammo = 1;
  }

  draw() {
    const { assets, direction, status } = this;
    const sprites = assets.image.sprites[direction][status];

    this.drawSprite(sprites);
  }

  preparingToDie() {
    setTimeout(() => {
      this.whenDeadCallback();
    }, 850);
  }

  whenDead(callback) {
    this.whenDeadCallback = callback;
  }

  willIDie(obstacle) {
    if (this.checkCollision(obstacle) && obstacle.isLetal) {
      this.direction = 'died';
      this.status = 'stand';
      this.frames = 0;

      this.diesAudio.play();

      this.preparingToDie();

      return true;
    }
    return false;
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

  stand() {
    this.status = 'stand';
  }
  move(axis, n, obstacles) {
    const { directionAxis } = this;

    const opositeAxis = axis === 'x' ? 'y' : 'x';
    const newPosition = this[axis] + n;
    const oldOpositePosition = this[opositeAxis];
    let newOpositePosition = oldOpositePosition;

    if (directionAxis !== axis) {
      let overlap = (this[directionAxis] % BASE_SPRITE_SIZE) / BASE_SPRITE_SIZE;
      overlap = overlap <= 0.25 ? 0 : overlap >= 0.75 ? 1 : overlap;

      newOpositePosition =
        Math.floor(oldOpositePosition / BASE_SPRITE_SIZE) * BASE_SPRITE_SIZE +
        overlap * BASE_SPRITE_SIZE;
    }

    const newCoordinates = {
      [axis]: newPosition,
      [opositeAxis]: newOpositePosition
    };

    const anySolid = obstacles.some(obstacle => {
      return this.checkCollision(obstacle, newCoordinates) && obstacle.isSolid;
    });

    if (anySolid) return;

    this[axis] = newPosition;
    this[opositeAxis] = newOpositePosition;

    this.status = 'walk';
  }
  moveUp(obstacles) {
    this.direction = 'back';
    this.move('y', -this.step, obstacles);
    this.directionAxis = 'y';
  }
  moveDown(obstacles) {
    this.direction = 'front';
    this.move('y', this.step, obstacles);
    this.directionAxis = 'y';
  }
  moveLeft(obstacles) {
    this.direction = 'left';
    this.move('x', -this.step, obstacles);
    this.directionAxis = 'x';
  }
  moveRight(obstacles) {
    this.direction = 'right';
    this.move('x', this.step, obstacles);
    this.directionAxis = 'x';
  }

  drop(callback) {
    if (this.ammo > 0) {
      callback(this.x, this.y, this);
    }
  }
  decreaseAmmo() {
    this.ammo--;
  }
  increaseAmmo() {
    this.ammo++;
  }
}

class Bomb extends Sprite {
  constructor(assets, x, y, ctx, updateFrequency = 2000 / 3) {
    super(assets, x, y, BASE_SPRITE_SIZE, BASE_SPRITE_SIZE, ctx, updateFrequency);

    this.assets = assets;

    this.audio = new Audio();
    this.audio.src = assets.audio.src;

    this.diesTimeout = null;
    this.preparingToDie();
  }

  draw() {
    const { sprites } = this.assets.image;

    this.drawSprite(sprites);
  }

  preparingToDie() {
    this.diesTimeout = setTimeout(() => {
      this.audio.play();
      this.whenDeadCallback();
    }, 2000);
  }
}

class Flame extends Sprite {
  constructor(assets, x, y, direction, type, ctx) {
    super(assets, x, y, BASE_SPRITE_SIZE, BASE_SPRITE_SIZE, ctx);

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
    this.flamesArray = [
      new Flame(assets, x - BASE_SPRITE_SIZE * 2, y, 'vertical', 'start', ctx),
      new Flame(assets, x - BASE_SPRITE_SIZE, y, 'vertical', 'middle', ctx),
      new Flame(assets, x + BASE_SPRITE_SIZE, y, 'vertical', 'middle', ctx),
      new Flame(assets, x + BASE_SPRITE_SIZE * 2, y, 'vertical', 'end', ctx),
      new Flame(assets, x, y, 'center', 'center', ctx),
      new Flame(assets, x, y - BASE_SPRITE_SIZE * 2, 'horizontal', 'start', ctx),
      new Flame(assets, x, y - BASE_SPRITE_SIZE, 'horizontal', 'middle', ctx),
      new Flame(assets, x, y + BASE_SPRITE_SIZE, 'horizontal', 'middle', ctx),
      new Flame(assets, x, y + BASE_SPRITE_SIZE * 2, 'horizontal', 'end', ctx)
    ];

    this.diesTimeout = null;
    this.whenDeadCallback = null;
    this.preparingToDie();
  }

  draw() {
    this.flamesArray.forEach(flame => flame.draw());
  }

  getFlames() {
    return this.flamesArray;
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
