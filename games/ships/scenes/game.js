// name: 'salvage'

var fullscreen = false;

function requestFullScreen () {
// we've made the attempt, at least
  fullscreen = true;
  var body = document.documentElement;
  if (body.requestFullscreen) {
    body.requestFullscreen();
  } else if (body.webkitRequestFullscreen) {
    body.webkitRequestFullscreen();
  } else if (body.mozRequestFullscreen) {
    body.mozRequestFullscreen();
  } else if (body.msRequestFullscreen) {
    body.msRequestFullscreen();
  }
}


var player;
var other;
var debug;

var onscreen; // hacky! this will be a function shortly!

var first_game = true;

var score = 0;
var combo = 0;

var highscore = 0;
var highcombo = 0;

var comboTimer = 0;
var comboMax = 4;
var comboText;
var scoreText;

Sprite.z = 1, TiledBackground.z = 1;

function addFlames(ship) {
	var createFlame = function (x, y) {
		if (ship.health / ship.maxHealth < 0.5) {
			var s = Object.create(Sprite).init(x + Math.random() * 32 - 16, y - 6, Resources.flame);
			s.addBehavior(FadeOut, {duration: 0.6});
			s.addBehavior(Velocity);
			s.velocity = {x: 0, y: - SPEED.ship / 10};
			s.velocity.x = ship.velocity.x;
			return s;
		} else if (ship.health / ship.maxHealth < 1) {
			var s = Object.create(Sprite).init(x + Math.random() * 48 - 24, y - 6, Resources.smoke);
			//var s = Object.create(Entity).init(x + Math.random() * 48 - 24, y - 6, Math.random() * 10 + 6, Math.random() * 10 + 6);
			s.opacity = Math.random() / 2 + 0.3;
			s.addBehavior(FadeOut, {duration: 0.6});
			s.addBehavior(Velocity);
			s.velocity = {x: 0, y: - SPEED.ship / 2};
			return s;
		}
	}
	var flames = Object.create(Particles).init(ship.x, ship.y, createFlame, 0.05);
	flames.addBehavior(Follow, {target: ship, offset: {x: 0, y: -2}});
	return flames;
}


var splash = function (ship) {
	var createSplash = function (x, y) {
	  var colors = ["#4d6b89", "#829eab", "white"]
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
	/*cb.addBehavior(Trail, {
		createParticle: function (x, y) { return Object.create(Entity).init(x, y, 8, 8) },
		duration: 5,
		interval: 0.02
	});*/
	var trail = function (x, y) {
		var t = Object.create(Entity).init(x + Math.random() * 8 - 4, y + Math.random() * 16 - 8, 6, 18);
		t.w = cb.w;
		t.h = cb.h * 2;
		t.color = entity.family == "player" ? "white" : "#833D1B";
    t.health = 0;
    t.opacity = 0.5 * (cb.opacity / 2.0);
    t.addBehavior(FadeOut, {duration: 1});
    return t;
	}
	var traileffect = Object.create(Particles).init(cb.x, cb.y - 2, trail, 0.02);
	if (entity.family == "enemy") {
		traileffect.offset = {x: 0, y: -48};
		cb.y = entity.y - 1;
		cb.offset = {x: 0, y: 0};
		cb.setVertices([
	    {x: 0, y: -10 + 6 * GLOBALS.scale},
	    {x: 2, y: -12 + 6 * GLOBALS.scale},

	    {x: 0, y: -14 + 6 * GLOBALS.scale},
	    {x: -2, y: -12 + 6 * GLOBALS.scale},
	  ]);
		cb.addBehavior(Horizon, {horizon: 166});
	} else {
	  cb.offset = {x: 0, y: -12 * GLOBALS.scale};
	}
	traileffect.addBehavior(Follow, {target: cb, offset: {x: 0, y: (entity.family == "player" ? -32 : 56)}});
	entity.layer.add(traileffect);

	cb.addBehavior(Crop, {min: {x: -100, y: 0}, max: {x: CONFIG.width + 100, y: CONFIG.height - cb.offset.y + 100}})
	entity.layer.add(cb);
}

function notFriendly (callback) {
	return function (object, other) {
		if (other.family == object.family) return false;
		else if (!other.family || !object.family) return false;
		else if (other.no_collide || object.no_collide) return false;
		return callback.call(this, object, other);
	}
}

function doDamage (d) { 
	if (this.invulnerable > 0) return;
	else this.health -= d;

	if (this.invulnerable !== undefined) this.invulnerable = 1;
	if (this.health <= 0) this.alive = false;
}

var shipCost = {
	20: function () {
		if (Math.random() < 0.5) return false;
		var right = Math.random() > 0.5;
		var s = Object.create(Sprite).init(right ? CONFIG.width : 0, 116 + 7 * GLOBALS.scale * 16, Resources.monitor);
		s.velocity = {x: right ? - SPEED.ship / 2 : SPEED.ship / 2, y: 0};
		s.health = 20, s.maxHealth = 20;
		s.addBehavior(Submarine);
		return s;
	},
	4: function () {
		if (Math.random() < 0.7) return false;
		var right = Math.random() > 0.5;
		var s = Object.create(Sprite).init(right ? CONFIG.width : 0, 116 + 7 * GLOBALS.scale * 16, Resources.Tender);
		s.velocity = {x: right ? - SPEED.ship * 2 / 3 : SPEED.ship * 2 / 3, y: 0};
		s.health = 10, s.maxHealth = 10;
		s.addBehavior(Tender);
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
	16: function () {
		if (Math.random() < 0.3) return false;
		var right = Math.random() > 0.5;
		var s = Object.create(Sprite).init(right ? CONFIG.width : 0, 116 + 7 * GLOBALS.scale * 16, Resources.ship3);
		s.addBehavior(Battleship);
		s.velocity = {x: right ? - SPEED.ship * 2 / 3 : SPEED.ship * 2 / 3, y: 0};
		s.health = 30, s.maxHealth = 30;
		return s;
	},
	2: function () {
		if (Math.random() < 0.2) return false; // chance to not spawn
		var right = Math.random() > 0.5;
		var s = Object.create(Sprite).init(right ? CONFIG.width : 0, 116 + 7 * GLOBALS.scale * 16, Resources.Cutter);
		s.velocity = {x: right ? - SPEED.ship * 1.5 : SPEED.ship * 1.5, y: 0};
		s.health = 10, s.maxHealth = 10;
		return s;
	},
	1: function () {
		var right = Math.random() > 0.5;
		var s = Object.create(Sprite).init(right ? CONFIG.width : 0, 116 + 7 * GLOBALS.scale * 16, Resources.ship2);
		s.addBehavior(Frigate);
		s.velocity = {x: right ? - SPEED.ship : SPEED.ship, y: 0};
		s.health = 10, s.maxHealth = 10;
		return s;
	}
}
var costs = Object.keys(shipCost).map( function (e) { return Number(e) });
console.log(costs);

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

					s.addBehavior(Cooldown);
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
					var f = addFlames(s);

					this.fg.add(f);
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

	this.started = -1;
	this.layers = [];

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

	var fg_camera = Object.create(Camera).init(0, -216);
	shake = fg_camera.addBehavior(Shake, {duration: 0.3, magnitude: 3});

	var fg = Object.create(Layer).init(fg_camera);
	fg.drawOrder = function () {
		//console.log('ordering');
		return this.entities.sort(function (a, b) { 
			if (a.z && b.z && b.z != a.z) return a.z - b.z;
			else return a.y - b.y 
		});
	}

	var ui_camera = Object.create(Camera).init(0, 0);
	var ui = Object.create(Layer).init(ui_camera);

	scoreText = Object.create(Text).init(12, 30, "Score: " + score, {align: "left", size: 64, color: "rgba(0,0,0,0.4)"});
	comboText = Object.create(Text).init(CONFIG.width - 4, 30, "Combo: " + combo, {align: "right", size: 64, color: "rgba(0,0,0,0.4)"});
	scoreText.opacity = 0, comboText.opacity = 0;

	var titleTexts = [];
	titleTexts.push(Object.create(Text).init(CONFIG.width / 2, CONFIG.height / 2 - 124, "Seven", {size: 96, align: "center", color: "rgba(0,0,0,0.4)"} ));
	titleTexts.push(Object.create(Text).init(CONFIG.width / 2, CONFIG.height / 2 - 68, "Deadly", {size: 96, align: "center", color: "rgba(0,0,0,0.4)"} ));
	titleTexts.push(Object.create(Text).init(CONFIG.width / 2, CONFIG.height / 2 - 12, "Seas", {size: 96, align: "center", color: "rgba(0,0,0,0.4)"} ));

	if (!first_game) {
		var sc = Object.create(Text).init(48, CONFIG.height - 48, "Score: " + score, {size: 48, align: "left", color: "rgba(100,0,0,0.5)"} );
		titleTexts.push(sc);
	} else {
		titleTexts.push(Object.create(Text).init(CONFIG.width / 2, CONFIG.height / 2 + 48, "Press SPACE to start.", {size: 48, align: "center", color: "black"}));
	}

	titleTexts.forEach(function (e) {
		ui.add(e);
	});
	ui.add(scoreText);
	ui.add(comboText);

	

	var Lose = Object.create(Behavior);
	Lose.end = function () {
		first_game = false;
		scene.started = -1;
		t.onStart();
	}

	var HealOverTime = Object.create(Behavior);
	HealOverTime.update = function (dt) {
		if (!this.rate) this.rate = 1;
		if (this.entity.cooldown <= 0 && this.entity.health > 0 && this.entity.health < this.entity.maxHealth) {
			this.entity.health += this.rate * dt;
		}
	}

	player = Object.create(Sprite).init(100, 116, Resources.ship1);
	player.addBehavior(Animate);
	player.addBehavior(Wrap, {min: {x: 0, y: 0}, max: {x: CONFIG.width, y: CONFIG.height}});
	player.addBehavior(Velocity);
	player.addBehavior(Flip);
	player.addBehavior(HealOverTime, {rate: 2});
//	player.addBehavior(Reload);
	player.addBehavior(Cooldown);
	player.addBehavior(DieFanfare, {duration: 4});
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
	player.health = 20, player.maxHealth = 20;
	//player.addBehavior(Mirror);
	player.offset = {x: 0, y: -12 * GLOBALS.scale};
	player.opacity = 0.75;

	var spl = splash(player);
	var f = addFlames(player);

	for (var i = 0; i < Math.random() * 3 + 3; i++ ) {
		var cloud = Object.create(Sprite).init(Math.random() * (CONFIG.width - 96) + 48, Math.random() * (CONFIG.height - 96) - CONFIG.height / 2, Resources.cloud );
		cloud.addBehavior(Wrap, {min: {x: 0, y: -CONFIG.height}, max: {x: CONFIG.width, y: CONFIG.height}});
		cloud.addBehavior(Velocity);
		cloud.velocity = {x: Math.random() * SPEED.ship / 4 - SPEED.ship / 8, y: 0};
		fg.add(cloud);
	}

	fg.add(f);
	fg.add(player);
	fg.add(spl);

	this.layers.push(fg);
	this.layers.push(ui);
	this.fg = fg;
	
	for (var i = 4; i < 13; i++) {
		var wave = Object.create(TiledBackground).init(0, i * GLOBALS.scale * 32 / 2, this.width * 3, GLOBALS.scale * 32, Resources.wave_tile1);
		wave.addBehavior(Shift, {field: 'x', constant: 1, time: Math.random() * Math.PI});
		//wave.opacity = 0.3;
		fg.add(wave);
	}

	/*
	var menuButton = Object.create(Sprite).init(24, 24, Resources.icon_menu);
	menuButton.behaviors = [];
	menuButton.addBehavior(HighLight, {duration: 0.5});
	menuButton.family = 'button';
	menuButton.trigger = function () {
		gameWorld.setScene(2);
	};
	fg.add(menuButton);
	*/

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

	this.do_start = function () {
		var ease = Object.create(Ease);
		ease.end = function () {
			t.started = 1;
		}
		t.started = 0;
		score = 0;
		combo = 0;
		gameWorld.playSound(Resources.swosh);
		fg_camera.addBehavior(ease, {destination: {x: 0, y: 0}});
		scoreText.addBehavior(FadeIn, {duration: 0.5});
		comboText.addBehavior(FadeIn, {duration: 0.5});
		titleTexts.forEach( function (e) {
			e.addBehavior(FadeOut, {duration: 0.5});
		});
	}

	this.onKeyDown = function (e) {
		if (e.keyCode == 32) {
			if (t.started == 1)
				player.shoot();
			else if (t.started == -1)
				t.do_start();
			else {}
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
		this.musicLoop();
	}

	this._gamepad.update(dt);
	scoreText.text = "Score: " + score;
	comboText.text = "Combo: " + combo;

	if (this.started == 1) {

		comboTimer += dt;
		if (comboTimer > comboMax) {
			combo = 0;
			comboTimer = 0;
		}

		//console.log(scoreText);

		this.buyShips(dt);
	}
};

var onEnd = function () {

};

var onDraw = function (ctx) {
};