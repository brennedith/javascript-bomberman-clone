class GameOver {
  constructor(n, ctx) {
    this.winner = n + 1;

    this.ctx = ctx;
  }

  draw() {
    const { winner, ctx } = this;

    const ctxText = `Congratulations player ${winner}!`;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '55px Arial bold';
    ctx.fillStyle = 'white';
    ctx.lineWidth = 7;

    ctx.strokeText(ctxText, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
    ctx.fillText(ctxText, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
  }
}
