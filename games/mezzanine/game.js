var FLOORSIZE = 16, FLOORS = 16, CAPACITY = 4;
var DIR = {up: -1, at: 0, down: 1};

var seed = 1000;

// raindrop 1.18.18
function sign (n) {
  return n > 0 ? 1 : (n < 0 ? -1 : 0);
}

function tofloor (y) {
  return clamp(Math.floor((game.h - y) / FLOORSIZE), 0, FLOORS);
}

var game = Object.create(World).init(180, 320, "index.json");