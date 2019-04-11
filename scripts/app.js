/* Constants */
const BASE_SPRITE_SIZE = 40;
const SCREEN_TILES_WIDTH = 25;
const SCREEN_TILES_HEIGHT = 15;
const SCREEN_WIDTH = BASE_SPRITE_SIZE * SCREEN_TILES_WIDTH;
const SCREEN_HEIGHT = BASE_SPRITE_SIZE * SCREEN_TILES_HEIGHT;
const FPS = 1000 / 60;

/* First interaction with Canvas */
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = SCREEN_WIDTH;
canvas.height = SCREEN_HEIGHT;

/* Game elements */

let scene, playersArray, blocksArray, bombsArray, explosionArray;

/* TODO
- Add README.md
*/
