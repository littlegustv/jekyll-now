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

function addCannon (entity, velocity, offset) {
	offset = offset || {x: 0, y: 0};
	var cb = Object.create(Cannon).init(0,0,Resources.cannonball);
  cb.x = entity.x + offset.x, cb.y = entity.y  + offset.y + 12 * GLOBALS.scale;
  cb.velocity = velocity;
  cb.family = entity.family;
	cb.addBehavior(Velocity);
	cb.addBehavior(Trail, {
		createParticle: function (x, y) { return Object.create(Entity).init(x, y, 8, 8) },
		duration: 5,
		interval: 0.02
	});
  cb.offset = {x: 0, y: -12 * GLOBALS.scale};
	cb.addBehavior(Crop, {min: {x: -100, y: 0}, max: {x: CONFIG.width + 100, y: CONFIG.height}})
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
	this.x = x, this.y = y, this.radius = r, this.duration = 1, this.time = 0, this.color = clr;
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

var SprayParticle = Object.create(ExplosionParticle);
SprayParticle.init = function (x, y, radius, velocity, color) {
	this.x = x, this.alive = true, this.y = y - Math.random(), this.radius = radius, this.duration = 0.5, this.time = 0, this.velocity = velocity, this.color = color, this.opacity = 0.5;
	return this;
}
SprayParticle.draw = function (ctx) {
	ctx.globalAlpha = this.opacity;
	ctx.beginPath();
	ctx.arc(this.x, this.y, this.radius, 0, 2 * PI, true);
	ctx.closePath();
	ctx.fillStyle = this.color;
	ctx.fill();
	ctx.globalAlpha = 1;
}
SprayParticle.oldUpdate = SprayParticle.update;
SprayParticle.update = function (dt) {
	this.oldUpdate(dt);
	this.x += dt * this.velocity.x;
	this.y += dt * this.velocity.y;
	this.velocity.y += dt * 200;
}
// /SprayParticle.addBehavior(Velocity);

var Spray = Object.create(Explosion);
Spray.update = function (dt) {
  var colors = ["#1d66bc", "#4a97d6", "white"]
	if (this.max === false);
	else if (this.count >= this.max && this.particles.length <= 0) this.alive = false;
	
	if (this.max === false || this.count < this.max) {
		if (Math.random() < 0.7) {
			var theta = 3 * PI / 2 + Math.random() * PI / 3 - PI / 6;
			var e = Object.create(SprayParticle).init(
				this.x + Math.random() * this.radius - this.radius / 2, 
				this.y + Math.random() * this.radius - this.radius / 2, 
				Math.random() * this.radius / 3, 
				{x: SPEED.ship * Math.cos(theta), y: SPEED.ship * Math.sin(theta)},
				choose(colors)
			);
			this.particles.push(e);
			this.count++;
		}
	}
	for (var i = 0; i < this.particles.length; i++) {
		this.particles[i].update(dt);
	}
	for (var i = 0; i < this.particles.length; i++) {
		if (!this.particles[i].alive) this.particles.splice(i, 1);
	}
	for (var i = 0; i < this.behaviors.length; i++) {
		this.behaviors[i].update(dt);
	}
}

var costs = [1.4, 5, 10, 15, 40];
var shipCost = {
	40: function () {
		if (Math.random() < 0.5) return false;
		var right = Math.random() > 0.5;
		var s = Object.create(Sprite).init(right ? CONFIG.width : 0, 116 + 7 * GLOBALS.scale * 16, Resources.monitor);
		s.velocity = {x: right ? - SPEED.ship / 2 : SPEED.ship / 2, y: 0};
		s.health = 20;
		return s;
	},
	15: function () {
		if (Math.random() < 0.7) return false;
		var right = Math.random() > 0.5;
		var s = Object.create(Sprite).init(right ? CONFIG.width : 0, 116 + 7 * GLOBALS.scale * 16, Resources.Tender);
		s.velocity = {x: right ? - SPEED.ship * 2 / 3 : SPEED.ship * 2 / 3, y: 0};
		s.health = 10;
		return s;
	},
	10: function () {
		if (Math.random() < 0.3) return false;
		var right = Math.random() > 0.5;
		var s = Object.create(Sprite).init(right ? CONFIG.width : 0, 116 + 7 * GLOBALS.scale * 16, Resources.ship3);
		s.addBehavior(Battleship);
		s.velocity = {x: right ? - SPEED.ship * 2 / 3 : SPEED.ship * 2 / 3, y: 0};
		s.health = 30;
		return s;
	},
	5: function () {
		if (Math.random() < 0.2) return false; // chance to not spawn
		var right = Math.random() > 0.5;
		var s = Object.create(Sprite).init(right ? CONFIG.width : 0, 116 + 7 * GLOBALS.scale * 16, Resources.Cutter);
		s.velocity = {x: right ? - SPEED.ship * 1.5 : SPEED.ship * 1.5, y: 0};
		s.health = 10;
		return s;
	},
	1.4: function () {
		var right = Math.random() > 0.5;
		var s = Object.create(Sprite).init(right ? CONFIG.width : 0, 116 + 7 * GLOBALS.scale * 16, Resources.ship2);
		s.addBehavior(Frigate);
		s.velocity = {x: right ? - SPEED.ship : SPEED.ship, y: 0};
		s.health = 10;
		return s;
	}
}

function buyShips (dt) {

		this.DOMAIN = 10 + (Math.min(1, score / 1000) * 54);
		if (this.interval === undefined) this.interval = 0;

		this.interval += dt;
		if (this.interval <= 2 + Math.random()) return;

	//if (Math.random() * 100 < 0.5 && this.fg.entities.filter( function (r) { r.family == "enemy" && r.h > 40}).length < 10 ) {
		var x = Math.random() * this.DOMAIN;
		var y = Math.pow(2, x / 10);
		this.interval = 0;

		for (var i = costs.length - 1; i >= 0; i--) {
			var cost = costs[i];
			if (y > cost) {
				var s = shipCost[cost]();

				if (s) {
				//this.money -= cost;
					console.log(y, this.DOMAIN);


	//				var ships = [Resources.ship2, Resources.ship3, Resources.monitor];
					s.addBehavior(Flip);
					s.addBehavior(SeaSpray);
					s.addBehavior(Animate);
					s.addBehavior(Climb, {min: {x: 0}, max: {x: CONFIG.width}});
					s.addBehavior(Velocity);
					//s.addBehavior(PeriodicCannon, {interval: 2});
					s.addBehavior(Die, {duration: 1});
					s.setVertices([
						{x: -13, y: -6},
						{x: 13, y: -6},
						{x: 13, y: 4},
						{x: -13, y: 4}
					]);
					s.setCollision(Polygon);
					s.collision.onHandle = function(object, other) {
						if (other == player && object.health > 0) {
							other.health -= 1;
							object.health = 0;
							gameWorld.playSound(Resources.hit);
						}
					}
					
					var offsetY = s.h > 64 ?  16 * GLOBALS.scale : 12 * GLOBALS.scale;
					s.offset = {x: 0, y: - offsetY};
					s.family = "enemy";

					this.fg.add(s);
					return;
				}
			}
		}

}

var shake;

var onStart = function () {

	var scene = this;

	this.money = 0;
	this.buyShips = buyShips;

	scene.musicLoop = function () {
		scene.soundtrack = gameWorld.playSound(Resources.soundtrack);
		scene.soundtrack.onended = scene.musicLoop;
	}

	this.onClick = function (e) {
		console.log(e.offsetX, e.offsetY);
	}

	Polygon.onCheck = notFriendly(Polygon.onCheck);

	var fg_camera = Object.create(Camera).init(0, 0);
	shake = fg_camera.addBehavior(Shake, {duration: 0.3, magnitude: 3});

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

	var Lose = Object.create(Behavior);
	Lose.end = function () {
		console.log('ending');
		gameWorld.setScene(2);
	}

	player = Object.create(Sprite).init(100, 116, Resources.ship1);
	player.addBehavior(Animate);
	player.addBehavior(Wrap, {min: {x: 0, y: 0}, max: {x: CONFIG.width, y: CONFIG.height}});
	player.addBehavior(Velocity);
	player.addBehavior(Flip);
	player.addBehavior(Cooldown);
	player.addBehavior(Die, {duration: 1});
	player.addBehavior(SeaSpray);
	player.addBehavior(Lose);
	player.setVertices([
		{x: -13, y: -2},
		{x: 13, y: -2},
		{x: 13, y: 4},
		{x: -13, y: 4}
	]);
	player.shoot = currentShoot;
	player.setCollision(Polygon);
	player.family = "player";
	player.health = 20;
	//player.addBehavior(Mirror);
	player.offset = {x: 0, y: -12 * GLOBALS.scale};

	fg.add(player);

	this.layers.push(fg);
	this.fg = fg;
	
	for (var i = 4; i < 13; i++) {
		var wave = Object.create(TiledBackground).init(0, i * GLOBALS.scale * 32 / 2, this.width * 3, GLOBALS.scale * 32, Resources.wave_tile1);
		wave.addBehavior(Shift, {field: 'x', constant: 1, time: Math.random() * Math.PI}); 			
		//wave.opacity = 0.9;
		fg.add(wave);
	}

	var menuButton = Object.create(Sprite).init(24, 24, Resources.icon_menu);
	menuButton.behaviors = [];
	menuButton.addBehavior(HighLight, {duration: 0.5});
	menuButton.family = 'button';
	menuButton.trigger = function () {
		gameWorld.setScene(2);
	};
	fg.add(menuButton);

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
	this._gamepad.buttons.a.onStart = function () {
		if (player.cooldown >= 0) return;

		var exp = Object.create(Explosion).init(player.x, player.y + GLOBALS.scale * 4, 12 * GLOBALS.scale, 40, "rgba(255,255,255,0.2)");
		fg.add(exp);

		addCannon(player, {x: 0, y: SPEED.ship});
		player.cooldown = 1;
	
		//console.log(Resources.cannon);
		gameWorld.playSound(Resources.cannon);

		shake.start();
	}
	this._gamepad.buttons.rt.onEnd = function () {	
	}

	this.touch = {x: undefined, y: undefined, timestamp: undefined};
	var t = this;

	this.onClick = function (e) {
		var b = fg.onButton(e.offsetX, e.offsetY);
		if (b) {
			if (b.trigger) b.trigger();
			return;
		}
	}
	this.onMouseMove = function (e) {
		var b = fg.onButton(e.offsetX, e.offsetY);
		if (b) {
			if (b.trigger) {
				b.frame = 1;
			}
			return;
		}
	}

	this.onKeyDown = function (e) {
		if (e.keyCode == 32) {
			player.shoot();
		} else if (e.keyCode == 37 ) {
			player.velocity.x = -SPEED.ship;
		} else if (e.keyCode == 39) {
			player.velocity.x = SPEED.ship;
		}
	}	
	this.onTouchStart = function (e) {

		if (!fullscreen) requestFullScreen();

		t.touch.timestamp = new Date();
		t.touch.x = e.changedTouches[0].pageX, this.touch.y = e.changedTouches[0].pageY;

	}
	this.onTouchEnd = function (e) {
		var b = fg.onButton(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
		if (b) {
			if (b.trigger) b.trigger();
			return;
		}

		var currentTimeStamp = new Date();
		var duration = (currentTimeStamp - t.touch.timestamp) / 1000;
		var x = e.changedTouches[0].pageX, y = e.changedTouches[0].pageY;
		var dx = x - t.touch.x;
		if (Math.abs(dx) < 100) {
			if (player.cooldown >= 0) return;

			var exp = Object.create(Explosion).init(player.x, player.y + GLOBALS.scale * 4, 12 * GLOBALS.scale, 40, "rgba(255,255,255,0.2)");
			fg.add(exp);

			addCannon(player, {x: 0, y: SPEED.ship});
			player.cooldown = 1;
		
			//console.log(Resources.cannon);
			gameWorld.playSound(Resources.cannon);

			shake.start();
		} else {
			if (dx > 0) {
				player.velocity.x = SPEED.ship;
			} else {
				player.velocity.x = -SPEED.ship;
			}
		}
	}

	this.onTouchMove = function (e) {
		e.preventDefault();
	}
};

var onUpdate = function (dt) {
	if (Resources.soundtrack && !this.soundtrack) {
		//this.musicLoop();
	}

	this._gamepad.update(dt);

	comboTimer += dt;
	if (comboTimer > comboMax) {
		combo = 0;
		comboTimer = 0;
	}
	scoreText.text = "Score: " + score;
	comboText.text = "Combo: " + combo;

	//console.log(scoreText);

	this.buyShips(dt);
};

var onEnd = function () {

};

var onDraw = function (ctx) {
};