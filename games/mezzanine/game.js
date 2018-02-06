var FLOORSIZE = 16, FLOORS = 16, CAPACITY = 4;

function tofloor (y) {
  return clamp(Math.floor((game.h - y) / FLOORSIZE), 0, FLOORS);
}

var game = Object.create(World).init(180, 320, "index.json");