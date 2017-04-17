var fullscreen = false;
var muted = false, paused = false;

var controls = "";

// mobile needs to be able to be fullscreened

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

// DEBUG VARIABLES (global so accessible in console)
var player;
var other;
var debug;

var pause_button, mute_button;

// score variables
// FIX ME: add localstorage memory

var first_game = true;

var enemies = [];

var score = 0;
var combo = 0;
var timer = 0;
var lastimer = 0;

var highscore = 0;
var highcombo = 0;

var comboTimer = 0;
var comboMax = 4;
//var comboText;
var scoreText;
var ui; // ui layer

// functions to add particle effects to ship objects

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


function addSplashes (ship) {
	var createSplash = function (x, y) {
//	  var colors = ["#4d6b89", "#829eab", "white"]
		var s = Object.create(Sprite).init(x, y, Resources.splash);
	//	s.color = choose(colors);
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

// adds a single cannonball, or does it?

function addCannon (entity, velocity, offset) {
	offset = offset || {x: 0, y: 0};
	var cb = Object.create(Cannon).init(entity.x, entity.family == "enemy" ? entity.y - 1 : entity.y + 1, Resources.cannonball);
  cb.z = 10;
  cb.velocity = velocity;
  cb.family = entity.family;
	cb.addBehavior(Velocity);
	
	if (entity.family == "enemy") cb.addBehavior(Horizon, {horizon: 116});

	var addTrails = function (x, y) {
		var t = Object.create(Entity).init(x + Math.random() * 8 - 4, y + Math.random() * 16 - 8, 6, 18);
		t.w = cb.w;
		t.h = cb.h * 2;
		t.color = entity.family == "player" ? "white" : "#833D1B";
    t.health = 0;
    t.opacity = 0.5 * (cb.opacity / 2.0);
    t.addBehavior(FadeOut, {duration: 1});
    return t;
	}

	var traileffect = Object.create(Particles).init(cb.x, cb.y - 2, addTrails, 0.02);
	traileffect.z = 9;
	traileffect.addBehavior(Follow, {target: cb, offset: {x: 0, y: 0 }});
	entity.layer.add(traileffect);

	traileffect.addBehavior(Crop, {min: {x: -100, y: 0}, max: {x: CONFIG.width + 100, y: CONFIG.height - cb.offset.y + 100}})
	var cr = cb.addBehavior(Crop, {min: {x: -100, y: 0}, max: {x: CONFIG.width + 100, y: CONFIG.height - cb.offset.y + 100}})
	//console.log(cr);
	entity.layer.add(cb);

	var f = Object.create(Sprite).init(cb.x, cb.y, Resources.flame);
	f.addBehavior(Follow, {target: cb, offset: {x: 0, y: 0, z: -1}});
	f.addBehavior(Crop, {min: {x: -100, y: 0}, max: {x: CONFIG.width + 100, y: CONFIG.height - cb.offset.y + 100}})
	if (entity.family == "enemy") {
		f.angle = PI;
		f.addBehavior(Horizon, {horizon: 116});
	}
	entity.layer.add(f);

	var bang = Object.create(Sprite).init(cb.x, cb.y, Resources[choose(["bang", "boom", "pow"])]);
	bang.z = 9;
	bang.addBehavior(FadeOut, {duration: 1});
	entity.layer.add(bang);
	return cb;
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
	13: function () {
		//console.log('submarine');
		var right = Math.random() > 0.5;
		var s = Object.create(Sprite).init(right ? CONFIG.width : 0, 116 + 7 * GLOBALS.scale * 16, Resources.monitor);
		s.velocity = {x: right ? - SPEED.ship / 2 : SPEED.ship / 2, y: 0};
		s.health = 20, s.maxHealth = 20;
		s.addBehavior(Submarine);
		return s;
	},
	3: function () {
		//console.log('tender');
		var right = Math.random() > 0.5;
		var s = Object.create(Sprite).init(right ? CONFIG.width : 0, 116 + 7 * GLOBALS.scale * 16, Resources.Tender);
		s.velocity = {x: right ? - SPEED.ship * 2 / 3 : SPEED.ship * 2 / 3, y: 0};
		s.health = 10, s.maxHealth = 10;
		s.addHeal = true;
		s.addBehavior(Tender);
		return s;
	},
	6: function () {
		//console.log('battleship');
		var right = Math.random() > 0.5;
		var s = Object.create(Sprite).init(right ? CONFIG.width : 0, 116 + 7 * GLOBALS.scale * 16, Resources.ship3);
		s.addBehavior(Battleship);
		s.velocity = {x: right ? - SPEED.ship * 2 / 3 : SPEED.ship * 2 / 3, y: 0};
		s.health = 30, s.maxHealth = 30;
		return s;
	},
	2: function () {
		//console.log('cutter');
		var right = Math.random() > 0.5;
		var s = Object.create(Sprite).init(right ? CONFIG.width : 0, 116 + 7 * GLOBALS.scale * 16, Resources.Cutter);
		s.velocity = {x: right ? - SPEED.ship * 1.5 : SPEED.ship * 1.5, y: 0};
		s.health = 10, s.maxHealth = 10;
		return s;
	},
	1: function () {
		//console.log('frigate');
		var right = Math.random() > 0.5;
		var s = Object.create(Sprite).init(right ? CONFIG.width : 0, 116 + 7 * GLOBALS.scale * 16, Resources.ship2);
		s.addBehavior(Frigate);
		s.velocity = {x: right ? - SPEED.ship : SPEED.ship, y: 0};
		s.health = 10, s.maxHealth = 10;
		return s;
	},
	14: function () {
		//console.log('adding monster');
		var r = 48;
		var last = undefined, first = undefined;
		var monster = [];
		for (var i = 0; i < 12; i++) {
			var theta = Math.PI * 2 / 10;
			var e = Object.create(Sprite).init(CONFIG.width + i* r, 116 + 7 * GLOBALS.scale * 16, Resources.monster);
			e.animation = i == 0 ? 0 : (i == 11 ? 2 : 1);
			e.offset = {x: 0, y: Math.cos(i * theta) * r};
			e.addBehavior(Oscillate, {field: "y", constant: 32, time: theta * i, rate: 1, initial: 0, object: e.offset});
			e.addBehavior(Monster);
			/**
				ANGLE doesn't work so well with offset!
			**/
			e.setCollision(Polygon);
			e.collision.onHandle = function(object, other) {
				if (other == player && object.health > 0) {
					other.health = 0;
					object.health = 0;
					gameWorld.playSound(Resources.hit);
				}
			}
			e.addBehavior(MonsterDie, {duration: 1});

			e.name = "monster";
			e.family = "enemy";
			e.health = 11;
			e.maxHealth = 11;
			if (last) {
				e.addBehavior(Face, {target: last, offsetAngle: 0});
			} else {
				e.addBehavior(Flip);
			}


			e.addBehavior(Velocity);
			e.velocity = {x: - SPEED.ship / 3, y: 0};
			e.climb = e.addBehavior(Climb, {min: {x: -40}, max: {x: CONFIG.width + 40}});
			e.weight = 1;
			
			last = e;
			e.monster = monster;
			monster.push(e);
		}
		return monster;
	}
}
var costs = Object.keys(shipCost).map( function (e) { return Number(e) });
var K = 20;

var queue = [];

function buyShips (dt) {

	if (CONFIG.no_buy) return;
	var weight = 0;
	for (var i = 0; i < enemies.length; i++) {
		if (enemies[i].alive && enemies[i].weight && enemies[i].health > 0) {
			weight += enemies[i].weight;
		}
	}
	if (weight < Math.log(score / 10 + 1) + K) {
		this.addShips(dt);
		if (queue.length > 3) return;
		if (player.health <= 0) return;
		var cost = costs[Math.min(Math.floor(Math.random() * Math.log(score / 10 + 1)), Math.floor(Math.random() * costs.length))];
		var s = shipCost[cost]();
		s.weight = 1//;ost / 2;
		s.points = cost;
		queue.push(s);
		//enemies.push(s);
	}
}
function addShips (dt) {

	this.cooldown -= dt;
	if (this.cooldown > 0) return;
	
	this.cooldown = 2;
	var ship = queue.shift(0);

	if (Array.isArray(ship)) {
		for (var i = 0; i < ship.length; i++) {
			this.fg.add(ship[i]);
			enemies.push(ship[i]);
		}
	}

	else if (ship) {
			var s = ship;
			enemies.push(s);
			s.addBehavior(Flip);
			s.addBehavior(Animate);
			s.climb = s.addBehavior(Climb, {min: {x: 0}, max: {x: CONFIG.width}});
			s.addBehavior(Velocity);
			s.addBehavior(Cooldown);
			s.die = s.addBehavior(Die, {duration: 1});
			s.setVertices([
				{x: -13, y: -6},
				{x: 13, y: -6},
				{x: 13, y: 4},
				{x: -13, y: 4}
			]);
			s.setCollision(Polygon);
			s.collision.onHandle = function(object, other) {
				if (other == player && object.health > 0) {
					other.health = 0;
					object.health = 0;
					gameWorld.playSound(Resources.hit);
				}
			}

			if (s.addHeal) {
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
				s.healing = healing;
				this.fg.add(healing);
			}
			
			var offsetY = s.h > 64 ?  16 * GLOBALS.scale : 12 * GLOBALS.scale;
			s.offset = {x: 0, y: - offsetY};
			s.family = "enemy";

			var spl = addSplashes(s);
			var f = addFlames(s);
			s.splashes = spl;
			s.flames = f;

			this.fg.add(f);
			this.fg.add(s);
			this.fg.add(spl);
	}
	
}

var shake;

function loadData(source) {
	if (localStorage && localStorage.shipsData) {
		var data = JSON.parse(localStorage.shipsData);
		highscore = data.highscore;
		highcombo = data.highcombo;
	} else {
		console.log("No stored information found.");
	}
}

function saveData() {
	if (localStorage) {
		localStorage.setItem("shipsData", JSON.stringify({highscore: highscore, highcombo: highcombo}));
	}
}

var onStart = function () {

	// load from storage, if exists
	//saveData = JSON.stringify(saveData);

	loadData();

	queue = [];

	var scene = this;
	Polygon.onCheck = notFriendly(Polygon.onCheck);

	this.started = -1;
	this.layers = [];

	this.money = 0;
	this.buyShips = buyShips;
	this.addShips = addShips;
	this.cooldown = 0;

	scene.musicLoop = function () {
		if (score == 0 || combo == 0) {
			gameWorld.soundtrack = gameWorld.playSound(Resources.soundtrack0);
		} else if (combo <= 5) {
			gameWorld.soundtrack = gameWorld.playSound(Resources.soundtrack1);			
		} else if (combo <= 10) {
			gameWorld.soundtrack = gameWorld.playSound(Resources.soundtrack2);
		} else if (combo <= 14) {
			gameWorld.soundtrack = gameWorld.playSound(Resources.soundtrack3);
		} else if (combo <= 18) {
			gameWorld.soundtrack = gameWorld.playSound(Resources.soundtrack4);
		} else {
			gameWorld.soundtrack = gameWorld.playSound(Resources.soundtrack5);
		}
		gameWorld.soundtrack.onended = scene.musicLoop;
	}

	scene.oceanLoop = function () {
		gameWorld.ocean = gameWorld.playSound(Resources.ocean);
		gameWorld.ocean.onended = scene.oceanLoop;
	}

	var fg_camera = Object.create(Camera).init(0, -216);
	shake = fg_camera.addBehavior(Shake, {duration: 0.3, magnitude: 3});

	var fg = Object.create(Layer).init(fg_camera);
	fg.drawOrder = function () {
		return this.entities.sort(function (a, b) { 
			if (a.z && b.z && b.z != a.z) return a.z - b.z;
			else if (a.y && b.y && a.y != b.y) return a.y - b.y;
			else return a.x - b.x;
		});
	}

	var ui_camera = Object.create(Camera).init(0, 0);
	ui = Object.create(Layer).init(ui_camera);

	scoreText = Object.create(Text).init(2, 12, "Score: " + score, {size: 24, align: "left", color: "black"});
	//comboText = Object.create(Text).init(CONFIG.width - 4, 30, "Combo: " + combo, {align: "right", size: 64, color: "black"});
	scoreText.opacity = 0;//, comboText.opacity = 0;

	var titleTexts = [];
	titleTexts.push(Object.create(Text).init(CONFIG.width / 2, CONFIG.height / 2 - 94, "Seven", {size: 96, align: "center", color: "rgba(0,0,0,0.8)"} ));
	titleTexts.push(Object.create(Text).init(CONFIG.width / 2, CONFIG.height / 2 - 48, "Deadly Seas", {size: 96, align: "center", color: "rgba(0,0,0,0.8)"} ));

	titleTexts.push(Object.create(Text).init(CONFIG.width / 2, CONFIG.height / 2 + 72, "to start", {size: 36, align: "center", color: "rgba(0,0,0,0.7)"}));
	titleTexts.push(Object.create(Text).init(CONFIG.width / 2, CONFIG.height / 2 + 16, "press SPACE", {size: 24, align: "center", color: "rgba(0,0,0,0.7)"}));
	titleTexts.push(Object.create(Text).init(CONFIG.width / 2, CONFIG.height / 2 + 32, "TOUCH anywhere", {size: 24, align: "center", color: "rgba(0,0,0,0.7)"}));
	titleTexts.push(Object.create(Text).init(CONFIG.width / 2, CONFIG.height / 2 + 48, "press   ", {size: 24, align: "center", color: "rgba(0,0,0,0.85)"}));
	titleTexts.push(Object.create(Sprite).init(CONFIG.width / 2 + 24, CONFIG.height / 2 + 44, Resources.a));

	titleTexts.forEach(function (e) {
		e.addBehavior(Oscillate, {field: "y", constant: 12, initial: e.y, rate: 1.6, time: 0, object: e});
	});	

	if (!first_game) {
		score += Math.floor(timer) * 10;
		var sc = Object.create(Text).init(48, CONFIG.height - 32, "Score: " + score, {size: 48, align: "left", color: "white"} );
		//sc.addBehavior(FadeOut, {duration: 5.5});
		titleTexts.push(sc);

		if (score > highscore) 
    {
      var highScoreText = Object.create(Text).init(
        CONFIG.width / 2,
        0,
        "NEW HIGH SCORE!",
      {color: "black", size: 48, align: "center"});
      highScoreText.addBehavior(FadeOut, {duration: 7});
			highScoreText.addBehavior(Oscillate, {field: "y", constant: 32, time: 0, rate: 1, initial: 0});
      highScoreText.z = 20;
      ui.add(highScoreText);
      highscore = score;
      saveData();
    }
    ngio.callComponent('ScoreBoard.postScore', {id: 7512, value: score}, function (result) {
    	console.log(result);
    });

		var timebonustext = Object.create(Text).init(48, CONFIG.height - 56, "Time Bonus: " + Math.floor(timer) * 10 + "!", {size: 36, align: "left", color: "white"});
		//timebonustext.addBehavior(FadeOut, {duration: 5.5});
		titleTexts.push(timebonustext);

		var highScoreNumberText = Object.create(Text).init(CONFIG.width - 32, CONFIG.height - 32, "Best: " + highscore, {size: 45, align: "right", color: "white"});
		titleTexts.push(highScoreNumberText);
	}
	

	titleTexts.forEach(function (e) {
		ui.add(e);
	});
	ui.add(scoreText);
	//ui.add(comboText);

	var more_text = Object.create(Text).init(64, 12, "SEE MORE?", {size: 24, color: "black"});
	ui.add(more_text);

	var more_button = Object.create(Button).init(64, 12, 96, 18);
  more_button.trigger = function () {
  	window.open("http://littlegustv.itch.io");
  };
  more_button.hover = function () {
  	more_text.color = "rgba(150,150,150,0.6)";
  };
  more_button.unhover = function () {
  	more_text.color = "black";
  };
  ui.add(more_button);

	var high_score_text = Object.create(Text).init(200, 12, "HIGH SCORES", {size: 24, color: "black"});
	ui.add(high_score_text);

	var high_score_button = Object.create(Button).init(240, 12, 200, 18);
  high_score_button.trigger = function () {
  	var overlay = Object.create(Entity).init(- CONFIG.width / 2, CONFIG.height / 2, CONFIG.width, CONFIG.height);
  	overlay.color = "#222";
  	overlay.addBehavior(Lerp, {goal: {x: CONFIG.width / 2, y: CONFIG.height / 2}, rate: 10});
  	overlay.addBehavior(Delay, {duration: 1, callback: function () {
  		gameWorld.setScene(1);
  	}});
  	ui.add(overlay);
  };
  high_score_button.hover = function () {
  	high_score_text.color = "rgba(150,150,150,0.6)";
  };
  high_score_button.unhover = function () {
  	high_score_text.color = "black";
  };
  ui.add(high_score_button);


	var mute_text = Object.create(Text).init(CONFIG.width - 48, 12, "SOUND OFF", {size: 24, color: "black"});
	ui.add(mute_text);

	mute_button = Object.create(Button).init(CONFIG.width - 48, 12, 96, 18);
  mute_button.trigger = function () {
  	if (gameWorld.muted) {
	  	mute_text.text = "SOUND OFF";
			gameWorld.audioContext.gn.gain.value = 1;
	  }
	  else {
	  	mute_text.text = "SOUND ON";
			gameWorld.audioContext.gn.gain.value = 0;
	  }
    gameWorld.muted = !gameWorld.muted;
  };
  mute_button.hover = function () {
  	mute_text.color = "rgba(150,150,150,0.6)";
  };
  mute_button.unhover = function () {
  	mute_text.color = "black";
  };
  ui.add(mute_button);

  this.buttons = [];
  this.buttons.push(mute_button);
  this.buttons.push(more_button);
  this.buttons.push(high_score_button);

  var pause_text = Object.create(Text).init(CONFIG.width - 160, 12, "PAUSE", {size: 24, color: "black"});
  ui.add(pause_text);

	pause_button = Object.create(Button).init(CONFIG.width - 160, 12, 96, 18, pause_text);
  pause_button.trigger = function () {
  	if (gameWorld.paused) {
  		gameWorld.startTime = new Date();
  		pause_text.text = "PAUSE";
  		if (!gameWorld.muted) 
  			gameWorld.audioContext.gn.gain.value = 1;
  	}
  	else {
			gameWorld.audioContext.gn.gain.value = 0;
  		pause_text.text = "RESUME";
  	}
    gameWorld.paused = !gameWorld.paused;
  };
  pause_button.hover = function () {
  	pause_text.color = "rgba(150,150,150,0.6)";
  };
  pause_button.unhover = function () {
  	pause_text.color = "black";
  };
  ui.add(pause_button);
  this.buttons.push(pause_button);

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
	player.addBehavior(DieFanfare);
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
	player.opacity = 1;//0.75;

	var spl = addSplashes(player);
	var f = addFlames(player);

	for (var i = 0; i < Math.random() * 3 + 3; i++ ) {
		var cloud = Object.create(Sprite).init(Math.random() * (CONFIG.width - 96) + 48, Math.random() * (CONFIG.height - 96) - CONFIG.height / 2, Resources.cloud );
		cloud.addBehavior(Wrap, {min: {x: 0, y: -CONFIG.height}, max: {x: CONFIG.width, y: CONFIG.height}});
		cloud.addBehavior(Velocity);
		cloud.z = -2;
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
		var w = wave.addBehavior(Oscillate, {field: "x", constant: 32, time: Math.random() * Math.PI, initial: Math.floor(Math.random() * 32), object: wave});
		//wave.opacity = 0.3;
		fg.add(wave);
	}

	var t = this;
	this._gamepad = Object.create(Gamepad).init();
	this._gamepad.aleft.onUpdate = function (dt) {
		if (Math.abs(this.x) > 0.3) {
			player.velocity.x = this.x > 0 ? SPEED.ship : -SPEED.ship;
		}
	}

	this._gamepad.buttons.a.onStart = function (dt) {
		if (t.started == -1) {
			controls = "gamepad";
			t.do_start();
			return 
		} else {
			player.shoot();
			return;
		}
	}

	this.touch = {x: undefined, y: undefined, timestamp: undefined};

	this.onClick = function (e) {
		if (!e.offsetX) {
			e.offsetX = e.clientX - e.originalTarget.offsetLeft, e.offsetY = e.clientY - e.originalTarget.offsetTop;
		}
		var b = ui.onButton(e.offsetX, e.offsetY);
		if (b) {
			if (b.trigger) b.trigger();
			return;
		}
		if (t.started == -1) {
			controls = "keyboard";
			t.do_start();
			return 
		} /*else {
			player.shoot();
			return;
		}*/
	}

	this.do_start = function () {
	  enemies = [];

		var ease = Object.create(Ease);
		ease.end = function () {
			t.started = 1;
		}
		t.started = 0;
		score = 0;
		combo = 0;
		lastimer = timer;
		timer = 0;
		gameWorld.playSound(Resources.swosh);
		fg_camera.addBehavior(ease, {destination: {x: 0, y: 0}});
		scoreText.addBehavior(FadeIn, {duration: 0.5});
		//comboText.addBehavior(FadeIn, {duration: 0.5});
		titleTexts.forEach( function (e) {
			e.addBehavior(FadeOut, {duration: 0.5});
		});

		more_button.addBehavior(ease, {destination: {x: 0, y: -100}});
		more_text.addBehavior(ease, {destination: {x: 0, y: -100}});
		high_score_button.addBehavior(ease, {destination: {x: 0, y: -100}});
		high_score_text.addBehavior(ease, {destination: {x: 0, y: -100}});

		// 'new game'
		if (highscore == 0) {
			var tutorial_shoot_text = Object.create(Text).init(CONFIG.width - 32, CONFIG.height / 5, "TO SHOOT", {align: "right", size: 32, color: "black"});
			tutorial_shoot_text.addBehavior(FadeOut, {duration: 10});

			var tutorial_move_text = Object.create(Text).init(32, CONFIG.height / 5, "TO CHANGE DIRECTION", {align: "left", size: 32, color: "black"});
			tutorial_move_text.addBehavior(FadeOut, {duration: 10});

			ui.add(tutorial_move_text);
			ui.add(tutorial_shoot_text);

			if (controls == "gamepad") {
				var gamepad_shoot_text = Object.create(Text).init(CONFIG.width - 32, CONFIG.height / 5 - 16, "PRESS  ", {align: "right", size: 32, color: "black"});
				gamepad_shoot_text.addBehavior(FadeOut, {duration: 10});

				var gamepad_shoot_icon = Object.create(Sprite).init(CONFIG.width - 48, CONFIG.height / 5 - 24, Resources.a);
				gamepad_shoot_icon.addBehavior(FadeOut, {duration: 10});

				var gamepad_move_text = Object.create(Text).init(32, CONFIG.height / 5 - 16, "USE", {align: "left", size: 32, color: "black"});
				gamepad_move_text.addBehavior(FadeOut, {duration: 10});

				var gamepad_move_icon = Object.create(Sprite).init(96, CONFIG.height / 5 - 32, Resources.lstick);
				gamepad_move_icon.addBehavior(Animate);
				gamepad_move_icon.addBehavior(FadeOut, {duration: 10});

				ui.add(gamepad_shoot_text);
				ui.add(gamepad_shoot_icon);
				ui.add(gamepad_move_text);
				ui.add(gamepad_move_icon);

			} else if (controls == "touch") {
				var touch_shoot_text = Object.create(Text).init(CONFIG.width - 32, CONFIG.height / 5 - 16, "TAP SCREEN", {align: "right", size: 32, color: "black"});
				touch_shoot_text.addBehavior(FadeOut, {duration: 10});

				var touch_move_text = Object.create(Text).init(32, CONFIG.height / 5 - 16, "SWIPE LEFT/RIGHT", {align: "left", size: 32, color: "black"});
				touch_move_text.addBehavior(FadeOut, {duration: 10});

				ui.add(touch_shoot_text);
				ui.add(touch_move_text);

			} else if (controls == "keyboard" ) {

				var keyboard_shoot_text = Object.create(Text).init(CONFIG.width - 32, CONFIG.height / 5 - 16, "PRESS SPACE", {align: "right", size: 32, color: "black"});
				keyboard_shoot_text.addBehavior(FadeOut, {duration: 10});

				var keyboard_move_text = Object.create(Text).init(32, CONFIG.height / 5 - 16, "USE ARROW KEYS", {align: "left", size: 32, color: "black"});
				keyboard_move_text.addBehavior(FadeOut, {duration: 10});

				ui.add(keyboard_shoot_text);
				ui.add(keyboard_move_text);

			}
		}
	}

	this.onKeyDown = function (e) {
		e.preventDefault();
		if (e.keyCode == 32) {
			if (t.started == 1)
				player.shoot();
			else if (t.started == -1) {
				controls = "keyboard";
				t.do_start();				
			}
			else {}
		} else if (e.keyCode == 37 ) {
			player.velocity.x = -SPEED.ship;
		} else if (e.keyCode == 39) {
			player.velocity.x = SPEED.ship;
		}
		return false;
	}
	this.onTouchStart = function (e) {

		t.touch.timestamp = new Date();
		t.touch.x = e.changedTouches[0].pageX, t.touch.y = e.changedTouches[0].pageY;

	}
	this.onTouchEnd = function (e) {
		if (!fullscreen) {
			requestFullScreen();
			return;
		}

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
			if (t.started == -1)
			{
				controls = "touch";
				t.do_start();
				return;
			} else {
				player.shoot();
				return;
			}
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

	this.onMouseMove = function (e) {
		e.preventDefault();
		for (var i = 0; i < t.buttons.length; i++) {
			if (t.buttons[i].check(e.offsetX / gameWorld.scale, e.offsetY / gameWorld.scale)) {
				t.buttons[i].hover();
			} else {
				t.buttons[i].unhover();
			}
		}
	}
};

var onUpdate = function (dt) {
	timer += dt;
	if (Resources.soundtrack1 && !gameWorld.soundtrack) {
		this.musicLoop();
	}

	if (Resources.ocean && !gameWorld.ocean) {
		this.oceanLoop();
	}

	this._gamepad.update(dt);
	scoreText.text = "Score: " + score;
	//comboText.text = "Combo: " + combo;

	if (this.started == 1) {

		comboTimer += dt;
		if (comboTimer > comboMax) {
			if (combo > highcombo) {
				var highComboText = Object.create(Text).init(
	        CONFIG.width / 2,
	        0,
	        "NEW BEST COMBO! " + combo + "x",
	      {color: "black", size: 48, align: "center"});
	      highComboText.addBehavior(FadeOut, {duration: 7});
				highComboText.addBehavior(Oscillate, {field: "y", constant: 32, time: 0, rate: 1, initial: 0});
	      highComboText.z = 20;
	      ui.add(highComboText);				
	      highcombo = combo;
				saveData();
			}
			combo = 0;
			comboTimer = 0;
		}

		//console.log(scoreText);

		if (player.health > 0)
			this.buyShips(dt);
	}
};

var onEnd = function () {

};

var onDraw = function (ctx) {
};