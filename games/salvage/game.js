CONFIG.height = 360, CONFIG.width = 640;

GLOBALS.width = 32, GLOBALS.height = 24, GLOBALS.scale = 1;
function toGrid (x, y) {
			var gridY = Math.round(y / GLOBALS.height );
			return {
				x: Math.round((x - gridY * GLOBALS.width / 2) / (GLOBALS.width)),
				y: gridY
			}
		}

var Hex = Object.create(Entity);
Hex.init = function (x, y, radius) {
	this.behaviors = [];
	this.x = x, this.y = y, this.radius = radius;
  this.drawvertices = [
    {x: -this.radius, y: -this.radius / 2},
    {x: 0, y: -this.radius},
    {x: this.radius, y: -this.radius / 2},
    {x: this.radius, y: this.radius / 2},
    {x: 0, y: this.radius},
    {x: -this.radius, y: this.radius / 2}
  ];
  this.setVertices(this.drawvertices);
  return this;
}
Hex.onDraw = function (ctx) {
	ctx.fillStyle = this.color;
  ctx.beginPath();
  for (var i = 0; i < this.drawvertices.length; i++) {
  	var x = this.drawvertices[i].x,
      y = this.drawvertices[i].y;
  	if (i == 0)
    	ctx.moveTo(this.x + x, this.y + y);
    else
      ctx.lineTo(this.x + x, this.y + y);
  }
  ctx.closePath();
  ctx.fill();
}

var gameWorld = Object.create(World).init("game.json");
gameWorld.height = 360, gameWorld.width = 640;
var s = Object.create(Scene).init("grid");
s.ready = true;
s.onStart = function () {
  var bg = this.addLayer(Object.create(Layer).init());
  var fg = this.addLayer(Object.create(Layer).init())

  for (var i = 0; i < 30; i++) {
    //var obstacle = fg.add(Object.create(Hex).init(Math.floor(Math.random() * 16) * 32,Math.floor(Math.random() * 14) * 24,12));
    
    var obstacle = fg.add(Object.create(Sprite).init(Math.floor(Math.random() * 16) * 32,Math.floor(Math.random() * 14) * 24,Resources.asteroid));
    obstacle.x += Math.floor(obstacle.y / 24) * 16;
    obstacle.scale = 2;
    obstacle.setVertices([
      {x: -16, y: -16 / 2},
      {x: 0, y: -16},
      {x: 16, y: -16 / 2},
      {x: 16, y: 16 / 2},
      {x: 0, y: 16},
      {x: -16, y: 16 / 2}
    ]);
    obstacle.obstacle = true;
    obstacle.setCollision(Polygon);
    if (obstacle.x == 96 && obstacle.y == 96)
      fg.remove(obstacle);
  }
  
  var player = fg.add(Object.create(Sprite).init(96,96,Resources.viper));
  player.scale = 2;
  this.player = player;
  player.setVertices([
    {x: -16, y: -16 / 2},
    {x: 0, y: -16},
    {x: 16, y: -16 / 2},
    {x: 16, y: 16 / 2},
    {x: 0, y: 16},
    {x: -16, y: 16 / 2}
  ]);
  //player.movement = player.addBehavior(HexMovement, {direction: undefined, gridX: 1, gridY: 5, gridSize: 32, rate: 4});
  player.pathfind = player.addBehavior(HexPathfind, {
		layer: fg,
		bound: {min: {x: 0, y: 0}, max: {x: 640, y: 360}},
		cell_size: 32,
		target: undefined
	});
  // doesn't 'start' until we have a target
  player.pathfind.start();
}
s.onUpdate = function (dt) {
	
}
s.onKeyDown = function (e) {
	if (e.keyCode == 39) {
  	s.player.movement.direction = {x: 1, y: 0};
  } else if (e.keyCode == 37) {
  	s.player.movement.direction = {x: -1, y: 0};
  } else if (e.keyCode == 40) {
  	s.player.movement.direction = {x: 0, y: 1};
  } else if (e.keyCode == 38) {
  	s.player.movement.direction = {x: 0, y: -1};
  }
}
s.onClick = function (e) {
	var t = toGrid(e.offsetX, e.offsetY);
  s.player.pathfind.target = {x: GLOBALS.width * t.x + t.y * GLOBALS.width / 2, y: GLOBALS.height * t.y};
  s.player.pathfind.route = null;
}

//CONFIG.debug = true;
gameWorld.scenes.push(s);
