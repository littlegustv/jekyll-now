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

var splash = function (ship) {
	var createSplash = function (x, y) {
	  var colors = ["#1d66bc", "#4a97d6", "white"]
		var s = Object.create(Entity).init(x, y, 12 * GLOBALS.scale, 6 * GLOBALS.scale);
		s.color = choose(colors);
		s.angle = Math.random() * Math.PI / 3 - Math.PI / 6;
		s.addBehavior(FadeOut, {duration: 1.3});
		s.addBehavior(Velocity);
		s.velocity = {x: 0, y: SPEED.ship / 10};
		return s;
	}
	var spl = Object.create(Particles).init(ship.x, ship.y - 1, createSplash, 0.1);
	spl.addBehavior(Follow, {target: ship, offset: {x: 0, y: 0}});
	return spl;
}

function addCannon (entity, velocity, offset) {
	offset = offset || {x: 0, y: 0};
	var cb = Object.create(Cannon).init(0,0,Resources.cannonball);
  cb.x = entity.x + offset.x, cb.y = entity.y  + offset.y + 12 * GLOBALS.scale;
  cb.velocity = velocity;
  cb.family = entity.family;
	cb.addBehavior(Velocity);
	cb.z = 1;
	/*cb.addBehavior(Trail, {
		createParticle: function (x, y) { return Object.create(Entity).init(x, y, 8, 8) },
		duration: 5,
		interval: 0.02
	});*/
	var trail = function (x, y) {
		var t = Object.create(Entity).init(x + Math.random() * 8 - 4, y + Math.random() * 16 - 8, 6, 18);
		t.z = 10;
		t.color = "white";
    t.health = 0;
    t.opacity = 0.3;
    t.addBehavior(FadeOut, {duration: 1});
    return t;
	}
	var traileffect = Object.create(Particles).init(cb.x, cb.y, trail, 0.02);
	traileffect.addBehavior(Follow, {target: cb, offset: {x: 0, y: (entity.family == "player" ? -32 : -8)}});
	entity.layer.add(traileffect);

  cb.offset = {x: 0, y: -12 * GLOBALS.scale};
	cb.addBehavior(Crop, {min: {x: -100, y: 0}, max: {x: CONFIG.width + 100, y: CONFIG.height - cb.offset.y + 100}})
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
		var healEffect = function (x, y) {
			var t = Object.create(Text).init(
				x + Math.random() * GLOBALS.scale * 12 - GLOBALS.scale * 6,
				y + Math.random() * GLOBALS.scale * 12 - GLOBALS.scale * 6,
				"+",
				{color: "#00FF00", size: 14});
			t.addBehavior(FadeOut, {duration: 0.5});
			t.addBehavior(Velocity);
			t.velocity = {x: 0, y: -SPEED.ship / 4};
			return t;
		}
		var healing = Object.create(Particles).init(s.x, s.y, healEffect, 0.05);
		healing.z = 20;
		healing.addBehavior(Follow, {target: s, offset: {x: 0, y: -24}});
		// really awkward here!!
		setTimeout(function () {
			s.layer.add(healing);
		}, 200);
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
					//console.log(y, this.DOMAIN);


	//				var ships = [Resources.ship2, Resources.ship3, Resources.monitor];
					s.addBehavior(Flip);
					//s.addBehavior(SeaSpray);
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

					var spl = splash(s);

					this.fg.add(s);
					this.fg.add(spl);
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
	player.addBehavior(Reload);
	player.addBehavior(Cooldown);
	player.addBehavior(Die, {duration: 1});
	//player.addBehavior(SeaSpray);
	player.velocity = {x: SPEED.ship, y: 0};
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

	var spl = splash(player);

	fg.add(player);
	fg.add(spl);

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