var FLOORSIZE = 16, FLOORS = 16, CAPACITY = 4;
var DIR = {up: -1, at: 0, down: 1};

function tofloor (y) {
  return clamp(Math.floor((game.h - y) / FLOORSIZE), 0, FLOORS);
}

var game = Object.create(World).init(180, 320, "index.json");