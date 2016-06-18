// name: 'salvage'


var player;
var other;
var debug;

var onscreen; // hacky! this will be a function shortly!

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

var Marker = Object.create(Entity);
Marker.init =  function (x) {
	this.x = x;
	return this;
}
Marker.draw = function (ctx) {
	ctx.beginPath();
	ctx.moveTo(this.x, -1000);
	ctx.lineTo(this.x, 1000);
	ctx.stroke();
	for (var i = -1000; i < 1000; i += 200)
		ctx.fillText('(' + this.x + ', ' + i + ')', this.x + 10, i);
}

// health, maxHealth, score

var onStart = function () {

	Polygon.onCheck = notFriendly(Polygon.onCheck);

	var scene = this;

	scene.enemies = [];
	scene.node = undefined;

	var bg_camera = Object.create(Camera).init(0, 0);
	var b = Object.create(Behavior);
	b.update = function (dt) {
		this.entity.x = (s.x - CONFIG.width / 2) / 10;
	}
	bg_camera.addBehavior(b);
	var bg = Object.create(Layer).init(bg_camera);
	scene.layers.push(bg);

//	bg.add(Object.create(Entity).init(0,0,60,200));

	var fg_camera = Object.create(Camera).init(0, 0);
	var b = Object.create(Behavior);
	b.update = function (dt) { 
		this.entity.x = s.x - CONFIG.width/2;//Math.floor(s.x - CONFIG.width/2);
		this.entity.y = s.y - CONFIG.height/2;//Math.max(0, Math.min(t.height - CONFIG.height, s.y - CONFIG.height / 2));
	};
	fg_camera.addBehavior(b);
	fg_camera.addBehavior(Bound, {min: {x: 0, y: 0}, max: {x: this.width - CONFIG.width, y: this.height - CONFIG.height}})

	debug = fg_camera;

	var fg = Object.create(Layer).init(fg_camera);

	scene.layers.push(fg);
	scene.fg = fg;

	onscreen = function (x, y) {
		return (x > fg_camera.x && x < fg_camera.x + CONFIG.width && y > fg_camera.y && y < fg_camera.y + CONFIG.height);
	}

	this.nodeSprite = Object.create(Sprite).init(100, 100, Resources.node);
	this.nodeSprite.setCollision(Polygon);
	this.nodeSprite.family = "collect";
	this.nodeSprite.health = 1;
	this.nodeSprite.doDamage = doDamage; 

	var beam = undefined;

	var s = Object.create(Sprite).init(640, 200, Resources.viper);
	player = s;
	s.addBehavior(Accelerate, {maxSpeed: SPEED.ship});
	s.addBehavior(Velocity);
	s.family = "player";
	s.addBehavior(Bound, {min: {x: 0, y: 0}, max: {x: this.width, y: 1600}})
	s.health = 10;
	s.maxHealth = 10;
	s.score = 0;
	s.rotate_rate = 1;
	this._player = s;

//	s.addBehavior(Wrap, {min: {x: 320}, max: {x: 3520}});

	s.setVertices([
		{x: -3, y: -4},
		{x: -3, y: 4},
		{x: 5, y: 0}
	]);

	s.setCollision(Polygon)
	s.collision.onHandle = HandleCollision.handleSolid;

	var ai = Object.create(Sprite).init(400, 200, Resources.saucer);
	ai.health = 10;
	ai.maxHealth = 10;
	ai.score = 0;

	//ai.addBehavior(Wrap, {min: {x: 0}, max: {x: 3200}});
	ai.addBehavior(Accelerate, {maxSpeed: SPEED.ship});
	ai.addBehavior(Velocity);
	ai.addBehavior(Invulnerable);
	ai.velocity = {x: 0, y: 0};
	ai.addBehavior(Bound, {min: {x: 0, y: 0}, max: {x: this.width, y: 1600}});
	ai.pathfind = ai.addBehavior(Pathfind, {
		layer: fg,
		bound: {min: {x: 0, y: 0}, max: {x: 3200, y: 1600}},
		cell_size: 80,
		target: s
	});
	ai.family = "enemy";
	ai.setCollision(Polygon);
	ai.collision.onHandle = HandleCollision.handleSolid;
	ai.doDamage = doDamage;
	ai.salvageai = ai.addBehavior(SalvageAI, {target: s, maxRange: 300});
	//debug = salvageAI;

	this.ai = ai;
	this.ai.salvageai.player = s;

	fg.add(ai);

	other = ai;
	fg.add(s);

	this._gamepad = Object.create(Gamepad).init();
	this._gamepad.aleft.onUpdate = function (dt) {
		if (Math.abs(this.x) > 0.3) {
			s.angle += dt * this.x * 5 * s.rotate_rate;
		}
	}

	var scene = this;
	this._gamepad.buttons.lt.onUpdate = function (dt) {
		s.acceleration = {x: Math.cos(s.angle) * SPEED.acel, y: Math.sin(s.angle) * SPEED.acel};
	}
	this._gamepad.buttons.lt.onStart = function () {
		s.animation = 1;
	}
	this._gamepad.buttons.lt.onEnd = function () {
		s.animation = 0;
		s.acceleration = {x: 0, y: 0};
	}
	this._gamepad.buttons.rt.onStart = function () {
		s.rotate_rate = 0.1;
		beam = Object.create(Entity).init(s.x + Math.cos(s.angle) * (200 + s.w), s.y + Math.sin(s.angle) * (200 + s.w), 400, 3);
		beam.color = "red";
		beam.opacity = 0.7;
		beam.angle = s.angle;
		beam.family = "player";
		var b = Object.create(Behavior);
		b.update = function (dt) {
			var w = 400;
			// calculate the first edge the beam hits, and stop it there..

			var start = {x: s.x + Math.cos(s.angle) * (s.w / 2), y: s.y + Math.sin(s.angle) * s.w / 2};
			var dir = {x: Math.cos(s.angle) * 400, y: Math.sin(s.angle) * 400 };

			for (var i = 0; i < fg.entities.length; i++) {
				if (fg.entities[i].family != this.entity.family && fg.entities[i].getVertices) {
					var v = fg.entities[i].getVertices();
					for (var j = 0; j < v.length; j++) {
						var v_start = {x: v[j].x, y: v[j].y};
						var v_next = v[(j + 1) % v.length];
						var v_dir = {x: v_next.x - v_start.x, y: v_next.y - v_start.y};

						if (cross(dir, v_dir) == 0);
						else {

							var diff_t = {x: start.x - v_start.x, y: start.y - v_start.y};
							var diff_u = {x: v_start.x - start.x, y: v_start.y - start.y};

							var t = cross(diff_t, v_dir) / cross(v_dir, dir);
							var u = cross(diff_u, dir) / cross(dir, v_dir);

							if ((t > 0 && t <= 1) && (u > 0 && u <= 1)) {
								var d = distance(0, 0, t * dir.x, t * dir.y);
								if (d < w) w = d;
							}
						}
					}
				}
			}
			this.entity.w = w + 10;
			this.entity.x = s.x + Math.cos(s.angle) * (s.w + this.entity.w) / 2, this.entity.y = s.y + Math.sin(s.angle) * (s.w + this.entity.w) / 2, this.entity.angle = s.angle;
		}

		beam.addBehavior(b);
		beam.setCollision(Polygon);
		beam.collision.onHandle = function (object, other) {
			if (other.doDamage) other.doDamage(1);
		};
		beam.layer = fg;
		scene.add(beam);
	}
	this._gamepad.buttons.rt.onEnd = function () {
		fg.remove(beam);
		s.rotate_rate = 1;		
	}

//	generate(fg, this.width, this.height);
};

var onUpdate = function (dt) {
	this._gamepad.update(dt);

	if (this.node && !this.node.alive) {
		this.node = undefined;
	}

	if (!this.node && this.enemies.reduce( function (a, b) { return a.health + b.health }, 0) <= 0) {
		this.node = Object.create(this.nodeSprite);
		this.node.x = Math.floor(Math.random() * this.width), this.node.y = Math.floor(Math.random() * this.height);
		this.node.addBehavior(Invulnerable);
		var nodePoint = Object.create(Entity).init(this.node.x, this.node.y, 14, 14);
		nodePoint.setCollision(Polygon);
		nodePoint.family = "collect";
		nodePoint.collision.onHandle = function (object, other) {
			if (other.score !== undefined) {
				object.alive = false;
				other.score += 1;
			}
		}
		this.node.addBehavior(Drop, {drop: nodePoint});
		this.fg.add(this.node);
		this.ai.salvageai.node = this.node;
//		this.pathfind.target = this.node;
//		this.pathfind.route = null;
		//debug = this.node;
	}

};

var onEnd = function () {

};

var onDraw = function (ctx) {
	ctx.fillStyle = "black";
	for (var i = 0; i < this._player.health; i++) {
		ctx.fillRect(20 + i * 22, 20, 20, 20);
	}
};

function generate (layer, w, h) {
	var last = 0;
	for (var i = 0; i < w; i++) {
		if (Math.random() * 1000 <= last) {
			var maxWidth = Math.floor(Math.random() * 100) + 100;
			createBox(layer, i, h, maxWidth);
			i += maxWidth + 20;
			last = 0;
		}
		else last += 1;
	}	
}

function createBox(layer, x, y, w) {
	var h = Math.floor(Math.random() * 200) + 150;
	var e = Object.create(Entity).init(x - w/2, y - h/2, w, h);
	e.setCollision(Polygon);
	e.solid = true;
	e.family = "neutral";
	e.color = "#" + Math.floor(Math.random() *16777216).toString(16);
	e.opacity = 0.4;
	layer.add(e);
	var offset =  Math.floor(Math.random() * 2) * Math.floor(Math.random() * 0.1 * w);
	x = x + offset;
	w = (w - offset);
	if (Math.random() * 100 < 33) {
		createBox(layer, x, y - h - 200, w);
	}
}