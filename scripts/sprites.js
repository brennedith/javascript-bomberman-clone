const blockBorderAssets = {
  image: {
    src: 'assets/blocks-sprite.png',
    sprites: [160, 32, 64, 64]
  }
};

const blockSolidAssets = {
  image: {
    src: 'assets/blocks-sprite.png',
    sprites: [288, 32, 64, 64]
  }
};

const blockRemovableAssets = {
  image: {
    src: 'assets/blocks-sprite.png',
    sprites: [416, 32, 64, 64]
  }
};

const bomberManAssets = {
  image: {
    src: 'assets/bomberman-sprite.png',
    sprites: {
      front: {
        stand: [32, 14, 64, 99],
        walk: [[160, 14, 64, 99], [288, 14, 64, 99]]
      },
      back: {
        stand: [32, 140, 64, 99],
        walk: [[160, 140, 64, 99], [288, 140, 64, 99]]
      },
      right: {
        stand: [28, 266, 68, 99],
        walk: [[160, 266, 64, 99], [288, 266, 64, 99]]
      },
      left: {
        stand: [32, 392, 68, 99],
        walk: [[160, 392, 64, 99], [288, 392, 64, 99]]
      },
      won: {
        stand: [[160, 518, 64, 99], [32, 518, 64, 99], [288, 518, 64, 99], [32, 518, 64, 99]]
      },
      died: {
        stand: [
          [32, 644, 64, 99],
          [160, 644, 64, 99],
          [288, 644, 64, 99],
          [22, 770, 83, 99],
          [145, 770, 90, 99],
          [270, 770, 95, 99],
          [15, 896, 95, 99]
        ]
      }
    }
  }
};

const bombAssets = {
  image: {
    src: 'assets/bomb-sprite.png',
    sprites: [[288, 32, 64, 64], [160, 32, 64, 64], [32, 32, 64, 64]]
  }
};

const flamesAssets = {
  image: {
    src: 'assets/flames-sprite.png',
    sprites: {
      center: {
        center: [32, 32, 64, 64]
      },
      vertical: {
        start: [160, 32, 64, 64],
        middle: [416, 32, 64, 64],
        end: [288, 32, 64, 64]
      },
      horizontal: {
        start: [544, 32, 64, 64],
        middle: [800, 32, 64, 64],
        end: [672, 32, 64, 64]
      }
    }
  }
};
