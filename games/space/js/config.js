function clamp (n, min, max) {
	return Math.max(Math.min(n, max), min);
}

function distance (x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

var CONFIG = {
	height: 400,
	width: 600,
	title: "My Game",
	startScene: "mainmenu",
	debug: false
};

 var GLOBALS = {
	scale: 3,
	invulnerability: 0.3
};

var STATE = {
	menu: 0,
	play: 1
};

var SPEED = {
	// max speeds
	ship: 200,
    projectile: 330,
    // acceleration multipliers
    acel: 0.1,
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
var RESOURCES = [
	{path: "ship.png", frames: 5, speed: 0.2},
	{path: "a.png"},
	{path: "laser.png"},
	{path: "item.png"},
	{path: "itemHeal.png"},
	{path: "asteroid.png"},
	{path: "bg.png"},
	{path: "projectile.png"},
	{path: "shoot.ogg"},
	{path: "hit.ogg"},
	{path: "ground.png"},
	{path: "tower.png"},
	{path: "scenes.js"},
	{path: "bomb.png", frames: 3, speed: 0.3}
];

var debug = {};