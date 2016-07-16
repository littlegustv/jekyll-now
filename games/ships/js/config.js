var PI = Math.PI;
var PI2 = 2 * Math.PI;

function distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function angle(x1, y1, x2, y2) {
  return Math.atan2(y2 - y1, x2 - x1);
}

function modulo(n, p) {
  return (n % p + p) % p;
}

function dot (v1, v2) {
  return v1.x * v2.x + v1.y * v2.y;
}

function cross(v1, v2) {
  return v1.x * v2.y - v1.y * v2.x;
}

function sign (n) {
  return n >= 0 ? 1 : -1;
}

function choose (array) {
  return array[Math.floor(Math.random() * array.length)];
}

function project(axes, vertices) {
  var min = dot(axes, vertices[0]);
  var max = min;
  for (var i = 0; i < vertices.length; i++) {
    var p = dot(axes, vertices[i]);
    if (p < min) min = p;
    else if (p > max) max = p;
  }
  return [min, max];
}

function overlap(p1, p2) {
  if ((p1[0] >= p2[0] && p1[0] < p2[1]) || (p1[1] > p2[0] && p1[1] <= p2[1])) {
      return true;
  }
  if ((p2[0] >= p1[0] && p2[0] < p1[1]) || (p2[1] > p2[0] && p2[1] <= p1[1])) {
      return true;
  }
  else {
      return false;
  }
}

function clamp (n, min, max) {
	return Math.max(Math.min(n, max), min);
}

function distance (x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

var CONFIG = {
	height: 360,
	width: 640,
	title: "My Game",
	startScene: "mainmenu",
	debug: false
};

 var GLOBALS = {
	scale: 2,
	invulnerability: 0.3
};

var STATE = {
	menu: 0,
	play: 1
};

var SPEED = {
	// max speeds
	ship: 160,
    projectile: 330,
    // acceleration multipliers
    acel: 600,
    decel: 0.01,
    gravity: 0.1
};

var TYPE = {
	player: 0,
    enemy: 1,
    neutral: 2,
    obstacle: 3
};

var CLASS = {
	none: 0,
	ship: 1,
    projectile: 2,
    solid: 3,
    item: 4
};

var DIRECTION = {
	right: 0,
	up: 1,
	left: 2,
	down: 3
};

var KEYCODES = {
	37: "left",
    38: "up",
    39: "right",
    40: "down",
    65: "a",
    68: "d",
    83: "s",
    87: "w",
    80: "p"
};

var Resources = [];
var RESOURCES = []; /* = [
  {path: "ship1.png", frames: 2, speed: 0.5},
  {path: "ship2.png", frames: 2, speed: 0.5},
  {path: "wave_tile1.png"},
  {path: "cannonball.png"},
  {path: "soundtrack.ogg"},
  {path: "cannon.ogg"},
  {path: "hit.ogg"}
	/*{path: "saucer.png", frames: 5, speed: 0.2},
	{path: "viper.png", animations: 2, frames: 4, speed: 0.6},
	{path: "a.png"},
	{path: "scope.png"},
	{path: "laser.png"},
  {path: "node.png"},
	{path: "item.png"},
	{path: "itemHeal.png"},
	{path: "asteroid.png"},
	{path: "bg.png"},
	{path: "projectile.png"},
	{path: "shoot.ogg"},
	{path: "hit.ogg"},
	{path: "ground.png"},
  {path: "building1.png"},
  {path: "building2.png"},
  {path: "scaffold.png"},
	{path: "tower.png", frames: 2},
  {path: "beam.png"},
  {path: "cathedral.png"},
  {path: "connecterVertical.png"},
  {path: "box.png"},
	{path: "scenes.js"},
	{path: "bomb.png", frames: 3, speed: 0.3}
];*/


var smoke = function (x, y) {
  var createSmoke = function (x, y) {
    var e = Object.create(Entity).init(x + Math.random() * 32 - 16, y + Math.random() * 32 - 16, 16, 16);
    e.color = 'white';
    e.opacity = 0.9;
    e.addBehavior(Velocity);
    e.velocity = {x: Math.random() * SPEED.ship - SPEED.ship / 2, y: Math.random() * SPEED.ship - SPEED.ship / 2};
    e.addBehavior(FadeOut, {duration: 0.2});
    return e;
  }
  var s = Object.create(Particles).init(x, y, createSmoke, 0.01, 20);
  return s;
}

var defaultShoot = function () {
  this.maxCooldown = 1;
  if (this.cooldown >= 0) return;

  //var exp = Object.create(Explosion).init(this.x, this.y + GLOBALS.scale * 4, 12 * GLOBALS.scale, 40, "rgba(255,255,255,0.2)");
  this.layer.add(smoke(this.x, this.y + GLOBALS.scale * 4));

  var direction = this.family == "player" ? 1 : -1;
  addCannon(this, {x: 0, y: direction * SPEED.ship});
  this.cooldown = this.maxCooldown;

  //console.log(Resources.cannon);
  gameWorld.playSound(Resources.cannon);

  shake.start();
}

var doubleShoot = function () {
  this.maxCooldown = 1.4;
  if (this.cooldown >= 0) return;

  this.layer.add(smoke(this.x, this.y + GLOBALS.scale * 4));

  var direction = this.family == "player" ? 1 : -1;
  addCannon(this, {x: Math.cos(PI / 2 - PI / 6) * SPEED.ship, y: direction * Math.sin(PI / 2 - PI / 6) * SPEED.ship}, {x: 16, y: 0});
  addCannon(this, {x: Math.cos(PI / 2 + PI / 6) * SPEED.ship, y:  direction * Math.sin(PI / 2 + PI / 6) * SPEED.ship}, {x: -16, y: 0});

  this.cooldown = this.maxCooldown;
  //console.log(Resources.cannon);
  gameWorld.playSound(Resources.cannon);

  shake.start();  
}

var scatterShoot = function () {
  this.maxCooldown = 1.8;
  if (this.cooldown >= 0) return;

  this.layer.add(smoke(this.x, this.y + GLOBALS.scale * 4));

  var direction = this.family == "player" ? 1 : -1;
  for (var i = 0; i < 10; i++) {

    var b = Object.create(Bullet).init(this.x + Math.random() * 16 - 8, this.y + Math.random() * direction * 8, 4, 4);
    var theta = Math.PI / 2 + Math.random() * Math.PI / 3 - Math.PI / 6;
    b.velocity = {x: direction * 1.5 * SPEED.ship * Math.cos(theta), y: direction * 1.5 * SPEED.ship * Math.sin(theta)};
    b.family = this.family;
    b.setVertices();
    b.addBehavior(Velocity);
    b.offset = {x: 0, y: -12 * GLOBALS.scale};
    b.addBehavior(Crop, {min: {x: -100, y: 0}, max: {x: CONFIG.width + 100, y: CONFIG.height}})

    this.layer.add(b);
  }

  gameWorld.playSound(Resources.scatter);

  this.cooldown = this.maxCooldown;
}

var currentShoot = defaultShoot;

var debug = {};