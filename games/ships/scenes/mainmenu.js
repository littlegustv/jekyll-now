// name: 'salvage'


var player;
var other;
var debug;

var onscreen; // hacky! this will be a function shortly!

var score = 0;
var combo = 0;
var comboTimer = 0;
var comboMax = 2;
var comboText;
var scoreText;

Sprite.z = 1, TiledBackground.z = 1;

function addCannon (entity, velocity) {
	var cb = Object.create(Sprite).init(entity.x, entity.y, Resources.cannonball);
	//cb.addBehavior(Velocity);
	cb.setCollision(Polygon);
	cb.addBehavior(Velocity);
	cb.collision.onHandle = function (object, other) {
		if (other.health > 0) {
			var e = Object.create(Explosion).init(other.x, other.y - 1, other.w / 2, 20, 'rgba(240,200,100,0.4)');
			other.layer.add(e);
			combo += 1;
			score += combo * 10;
			comboTimer = 0;

			other.health -= 1;
			gameWorld.playSound(Resources.hit)
		}
		object.alive = false;
	};
	cb.addBehavior(Trail, {
		createParticle: function (x, y) { return Object.create(Entity).init(x, y, 8, 8) },
		duration: 5,
		interval: 0.05
	});
	cb.addBehavior(Crop, {min: {x: -100, y: 0}, max: {x: CONFIG.width + 100, y: CONFIG.height}})

	cb.x = entity.x, cb.y = entity.y + 48;
	cb.offset = {x: 0, y: -48};
	//cb.start = {x: player.x, y: player.y};
	cb.velocity = velocity;
	cb.family = entity.family;
	cb.setVertices([
		{x: 0, y: -10},
		{x: 2, y: -12},
		{x: 0, y: -14},
		{x: -2, y: -12},
	]);
	cb.z = 1;
	entity.layer.add(cb);

}

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

var ExplosionParticle = Object.create(Entity);
ExplosionParticle.init = function (x, y, r, clr) {
	this.x = x, this.y = y, this.radius = r, this.color = clr;
	return this;
}
ExplosionParticle.update = function (dt) {
	this.time += dt;
	if (this.time >= this.duration) this.alive = false;
	this.opacity = Math.sin(PI * this.time / this.duration);
}
ExplosionParticle.draw = function (ctx) {
	ctx.globalAlpha = this.opactiy;
	ctx.beginPath();
	ctx.arc(this.x, this.y, this.radius, 0, PI * 2, true);
	ctx.fillStyle = this.color;
	ctx.fill();
	ctx.globalAlpha = 1;
}

var Shake = Object.create(Behavior);
Shake.update = function (dt) {
	this.time += dt;
	if (!this.time || this.time > this.duration) {
		if (this.original)
		{
			this.entity.x = this.original.x, this.entity.y = this.original.y;
			this.original = undefined;
		}
		return;
	}
	else {
		this.entity.x += Math.random() * this.magnitude - this.magnitude / 2;
		this.entity.y += Math.random() * this.magnitude - this.magnitude / 2;
	}
}
Shake.start = function () {
	this.original = {x: this.entity.x, y: this.entity.y};
	this.time = 0;
}

var Explosion = Object.create(Entity);
Explosion.init = function (x, y, radius, max, color) {
	this.particles = [], this.x = x, this.y = y, this.radius = radius, this.max = max, this.count = 0, this.color = color;
	return this;
}
Explosion.update = function (dt) {
	if (this.count >= this.max) this.alive = false;
	else {
		if (Math.random() < 0.7) {
			var e = Object.create(ExplosionParticle).init(
				this.x + Math.random() * this.radius / 2 - this.radius / 2, 
				this.y + Math.random() * this.radius / 2 - this.radius / 2, 
				Math.random() * this.radius / 2, 
				this.color
			);
			this.particles.push(e);
			this.count++;
		}
		for (var i = 0; i < this.particles.length; i++) {
			this.particles[i].update(dt);
		}
		for (var i = 0; i < this.particles.length; i++) {
			if (!this.particles[i].alive) this.particles.splice(i, 1);
		}
	}
}
Explosion.draw = function (ctx) {
	for (var i = 0; i < this.particles.length; i++) {
		this.particles[i].draw(ctx);
	}
}

var Crop = Object.create(Behavior);
Crop.update = function (dt) {
	if (this.entity.x > this.max.x || this.entity.x < this.min.x) this.entity.alive = false;
	if (this.entity.y > this.max.y || this.entity.y < this.min.y) this.entity.alive = false;
}

var Trail = Object.create(Behavior);
Trail.update = function (dt) {
	if (!this.time) this.start();
	if (this.totalTime > this.duration) return;
	this.time += dt;
	this.totalTime += dt;
	if (this.time > this.interval) {
		this.time = 0;
		var p = this.createParticle(this.entity.x, this.entity.y - 48);
		p.health = 0;
		p.opacity = 0.3;
		p.addBehavior(FadeOut, {duration: 1});
		this.entity.layer.add(p);
	}
}
Trail.createParticle = function (x, y) {
	return Object.create(Entity).init(x,y,32,32);
}
Trail.start = function () {
	this.time = 0;
	this.totalTime = 0;
	this.interval = this.interval || 0.05;
	this.duration = this.duration || 10;
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
		this.entity.opacity = (this.duration - this.time) / this.duration;
		if (this.entity.offset) {
			this.entity.offset.y += Math.sin(this.time) * 5;
		}
		this.entity.angle += dt / 10;
	}
};
Die.start = function () {
	if (this.entity.collision) {
		this.entity.collision.onCheck = function (a, b) { return false };
	}
	this.time = 0;
}

var FadeOut = Object.create(Behavior);
FadeOut.update = function (dt) {
		if (!this.time) this.start();
		this.time += dt;

		if (this.time >= this.duration) this.entity.alive = false;
		this.entity.opacity = this.maxOpacity * (this.duration - this.time) / this.duration;
};
FadeOut.start = function () {
	if (this.entity.collision) {
		this.entity.collision.onCheck = function (a, b) { return false };
	}
	this.maxOpacity = this.entity.opacity;
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

var shake;

var onStart = function () {

	Polygon.onCheck = notFriendly(Polygon.onCheck);

	var fg_camera = Object.create(Camera).init(0, 0);
	fg_camera.addBehavior(Shake, {duration: 0.3, magnitude: 3});
	shake = fg_camera.behaviors[0];

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

	scoreText = Object.create(Text).init(30, 30, "Score: " + score, {align: "left"});
	comboText = Object.create(Text).init(CONFIG.width - 30, 30, "Combo: " + combo, {align: "right"});
	
	fg.add(scoreText);
	fg.add(comboText);

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
		//wave.opacity = 0.1;
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
		var exp = Object.create(Explosion).init(player.x, player.y + 16, 48, 40, "rgba(255,255,255,0.2)");
		fg.add(exp);

		addCannon(player, {x: 0, y: SPEED.ship});
		addCannon(player, {x: SPEED.ship * Math.cos(PI / 2 + PI / 6), y: SPEED.ship * Math.sin(PI / 2 + PI / 6)});
		addCannon(player, {x: SPEED.ship * Math.cos(PI / 2 - PI / 6), y: SPEED.ship * Math.sin(PI / 2 - PI / 6)});

		console.log(Resources.cannon);
		gameWorld.playSound(Resources.cannon);

		shake.start();
	}
	this._gamepad.buttons.rt.onEnd = function () {	
	}
};

var onUpdate = function (dt) {
	this._gamepad.update(dt);

	comboTimer += dt;
	if (comboTimer > comboMax) {
		combo = 0;
		comboTimer = 0;
	}
	scoreText.text = "Score: " + score;
	comboText.text = "Combo: " + combo;

	//console.log(scoreText);


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