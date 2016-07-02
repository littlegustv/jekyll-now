// name: 'salvage'


var player;
var other;
var debug;

var onscreen; // hacky! this will be a function shortly!

Sprite.z = 1, TiledBackground.z = 1;

function notFriendly (callback) {
	return function (object, other) {
		if (other.family == object.family) return false;
		else if (!other.family || !object.family) return false;
		return callback.call(this, object, other);
	}
}

function doDamage (d) { 
	if (this.invulnerable > 0) return;
	else this.health -= d;

	if (this.invulnerable !== undefined) this.invulnerable = 1;
	if (this.health <= 0) this.alive = false;
}

var Flip = Object.create(Behavior);
Flip.update = function (dt) {
	if (this.entity.velocity.x > 0) {
		this.entity.mirrored = false;
	} else {
		this.entity.mirrored = true;
	}
}

var Die = Object.create(Behavior);
Die.update = function (dt) {
	if (this.entity.health <= 0) {
		if (!this.time) this.start();
		this.time += dt;
		if (this.time >= this.duration) this.entity.alive = false;
		this.entity.opacity = this.time / this.duration;
		this.entity.offset.y += Math.sin(this.time) * 5;
		this.entity.angle += dt / 10;
	}
};
Die.start = function () {
	this.entity.collision.onCheck = function (a, b) { return false };
	this.time = 0;
}

var Climb = Object.create(Behavior);
Climb.update = function (dt) {
	if (this.entity.x > this.max.x) {
		this.entity.velocity.x *= -1;
		this.entity.x = this.max.x;
		this.entity.y = this.entity.y - 32 * GLOBALS.scale / 2;
	}
	if (this.entity.x < this.min.x) {
		this.entity.velocity.x *= -1;
		this.entity.x = this.min.x;
		this.entity.y = this.entity.y - 32 * GLOBALS.scale / 2;
	}
}


var onStart = function () {

	Polygon.onCheck = notFriendly(Polygon.onCheck);

	var fg_camera = Object.create(Camera).init(0, 0);
	var fg = Object.create(Layer).init(fg_camera);
	fg.drawOrder = function () {
		//console.log('ordering');
		return this.entities.sort(function (a, b) { 
			if (a.z && b.z && b.z != a.z) return a.z - b.z;
			else return a.y - b.y 
		});
	}
/*
	var Mirror = Object.create(Behavior);
	Mirror.draw = function (ctx) {
    ctx.scale(-1, 1);
	}*/

	player = Object.create(Sprite).init(100, 168, Resources.ship1);
	player.addBehavior(Animate);
	player.addBehavior(Wrap, {min: {x: 0, y: 0}, max: {x: 1280, y: 720}});
	player.addBehavior(Velocity);
	player.addBehavior(Flip);
	player.setVertices([
		{x: -13, y: -2},
		{x: 13, y: -2},
		{x: 13, y: 4},
		{x: -13, y: 4}
	]);
	player.setCollision(Polygon);
	player.family = "player";
	player.health = 10;
	//player.addBehavior(Mirror);
	player.offset = {x: 0, y: -48};

	fg.add(player);

	this.layers.push(fg);
	this.fg = fg;
	
	var Shift = Object.create(Behavior);
	Shift.update = function (dt) {
		if (!this.time) this.start();
		this.time += dt;
		this.entity.x += 1 * Math.sin(this.time);
	}
	Shift.start = function () {
		this.time = 0;
		this.constant = this.constant || 10;
	}

	for (var i = 3; i < 13; i++) {
		var wave = Object.create(TiledBackground).init(0, i * GLOBALS.scale * 32 / 2, this.width, GLOBALS.scale * 32, Resources.wave_tile1);
		wave.addBehavior(Shift, {constant: 100, time: Math.random() * Math.PI});
		wave.z = 1;
		fg.add(wave);
	}

	this._gamepad = Object.create(Gamepad).init();
	this._gamepad.aleft.onUpdate = function (dt) {
		if (Math.abs(this.x) > 0.3) {
			player.velocity.x = this.x > 0 ? SPEED.ship : -SPEED.ship;
		}
	}

	this._gamepad.buttons.lt.onUpdate = function (dt) {
	}
	this._gamepad.buttons.lt.onStart = function () {
	}
	this._gamepad.buttons.lt.onEnd = function () {
	}
	this._gamepad.buttons.rt.onStart = function () {
		var cb = Object.create(Sprite).init(player.x, player.y, Resources.cannonball);
		//cb.addBehavior(Velocity);
		cb.setCollision(Polygon);
		cb.addBehavior(Velocity);
		cb.collision.onHandle = function (object, other) {
			if (other.health > 0) other.health -= 1;
			object.alive = false;
		};

		cb.x = player.x, cb.y = player.y;
		cb.velocity = {x: 0, y: SPEED.ship};
		cb.family = "player";
		cb.z = 10;
		fg.add(cb);
	}
	this._gamepad.buttons.rt.onEnd = function () {	
	}
};

var onUpdate = function (dt) {
	this._gamepad.update(dt);

	if (Math.random() * 100 < 0.5) {
		var right = Math.random() > 0.5;
		var s = Object.create(Sprite).init(right ? CONFIG.width : 0, 168 + 4 * GLOBALS.scale * 32, Resources.ship2);
		s.velocity = {x: right ? - SPEED.ship : SPEED.ship, y: 0};
		s.addBehavior(Flip);
		s.addBehavior(Animate);
		s.addBehavior(Climb, {min: {x: 0}, max: {x: CONFIG.width}});
		s.addBehavior(Velocity);
		s.addBehavior(Die, {duration: 1});
		s.setVertices([
			{x: -13, y: -6},
			{x: 13, y: -6},
			{x: 13, y: 4},
			{x: -13, y: 4}
		]);
		s.setCollision(Polygon);
		
		s.offset = {x: 0, y: -48};
		s.family = "enemy";
		s.health = 1;

		this.fg.add(s);
	}

};

var onEnd = function () {

};

var onDraw = function (ctx) {
};