// Level 1

function level1() {
  /* Prepares the elements for the current level */

  playersArray = [];
  blocksArray = [];
  bombsArray = [];
  explosionArray = [];
  scene = new Scene(sceneAssets, ctx);

  /* Creates and assigns all types of blocks in the scene */
  loopTiles((x, y) => {
    if (x === 0 || y === 0 || x === SCREEN_TILES_WIDTH - 1 || y === SCREEN_TILES_HEIGHT - 1) {
      // Border Blocks
      blocksArray.push(createBorderBlock(x, y, ctx));
    } else if (x % 2 === 0 && y % 2 === 0) {
      //Middle Blocks
      blocksArray.push(createSolidBlock(x, y, ctx));
    } else {
      // Random "Perishable" Blocks
      if (
        (x > 3 || y > 3) &&
        (x < SCREEN_TILES_WIDTH - 4 || y < SCREEN_TILES_HEIGHT - 4) &&
        Math.random() > 0.75
      ) {
        const block = createRemovableBlock(x, y, ctx);
        const blockIndex = blocksArray.length;
        blocksArray.push(block);

        block.whenDead(() => {
          // When dead, removes its object reference from the array
          delete blocksArray[blockIndex];
        });
      }
    }
  });

  // Creates and assigns two players on opposite sides of the scene
  [
    [hero1Assets, BASE_SPRITE_SIZE, BASE_SPRITE_SIZE],
    [hero2Assets, SCREEN_WIDTH - BASE_SPRITE_SIZE * 2, SCREEN_HEIGHT - BASE_SPRITE_SIZE * 2]
  ].forEach(playerConfig => {
    const [assets, x, y] = playerConfig;

    const player = createPlayer(assets, x, y, ctx);
    const playerIndex = playersArray.length;
    player.whenDead(() => {
      // When dead, removes its object reference from the array and calls gameOver function
      delete playersArray[playerIndex];

      gameOver(playersArray, n => {
        playersArray[n].won();
        scene.endScene();
      });
    });

    playersArray.push(player);
  });

  // Updates the scene and elements
  game.interval = setInterval(() => {
    // Renders scene and all elements
    render([scene, explosionArray, bombsArray, blocksArray, playersArray]);

    // Creates an array of flame objects and checks if they should destroy something
    const flamesArray = explosionArray.reduce(
      (acc, explosion) => [...acc, ...explosion.getFlames()],
      []
    );
    flamesArray.forEach(flame => {
      getDefined(playersArray).forEach(player => player.willIDie(flame));
      getDefined(blocksArray).forEach(block => block.willIDie(flame));
    });

    // Handles the players interaction with the scene
    const [player1, player2] = playersArray;
    const obstacles = getDefined(blocksArray);

    if (player1) {
      if (Key.isDown(Key.E)) player1.drop(playerDropsBomb);
      if (Key.isDown(Key.W)) player1.moveUp(obstacles);
      if (Key.isDown(Key.S)) player1.moveDown(obstacles);
      if (Key.isDown(Key.A)) player1.moveLeft(obstacles);
      if (Key.isDown(Key.D)) player1.moveRight(obstacles);
    }

    if (player2) {
      if (Key.isDown(Key.CTRL)) player2.drop(playerDropsBomb);
      if (Key.isDown(Key.UP)) player2.moveUp(obstacles);
      if (Key.isDown(Key.DOWN)) player2.moveDown(obstacles);
      if (Key.isDown(Key.LEFT)) player2.moveLeft(obstacles);
      if (Key.isDown(Key.RIGHT)) player2.moveRight(obstacles);
    }
  }, FPS);
}
