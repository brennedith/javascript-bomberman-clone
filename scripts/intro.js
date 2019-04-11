class Intro {
  constructor() {
    this.img = new Image();
    this.img.src = 'assets/images/plane.png';

    this.audio = new Audio();
    this.audio.src = 'assets/sounds/bomberman.wav';

    this.x = -SCREEN_WIDTH;
    this.y = -SCREEN_HEIGHT * 2;

    this.size = 550;
    this.step = SCREEN_WIDTH / 100;

    this.canPlay = true;
  }

  draw() {
    const { img, x, y, size, step, n } = this;

    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    if (y > -200 && this.canPlay) {
      this.canPlay = false;
      this.audio.play();
    }

    if (x <= SCREEN_WIDTH + size && y <= SCREEN_HEIGHT) {
      ctx.drawImage(img, x, y, size, size);
    } else {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '55px Arial bold';
      ctx.fillStyle = 'white';
      ctx.lineWidth = 7;

      ctx.strokeText('Press Enter to start', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
      ctx.fillText('Press Enter to start', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
    }

    this.x += step;
    this.y += step;
  }
}

const intro = new Intro();

game.interval = setInterval(() => {
  intro.draw();
}, FPS);
