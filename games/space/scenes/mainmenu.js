// name: 'salvage'

/**** 
 - 'wrapping' should happen for everything that OVERLAPS the start box
 - it should ALSO be applied for updating(?) and esp. collisions (yes)
 - needs to be done in reverse (in BOTH directions, check it out!)
 ****/


var player;

function notFriendly (callback) {
	return function (object, other) {
		if (other.family == object.family) return false;
		else if (!other.family || !object.family) return false;
		return callback.call(this, object, other);
	}
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

var onStart = function () {

	Polygon.onCheck = notFriendly(Polygon.onCheck);


	var t = this;

	t.super_update = t.update, t.super_draw = t.draw;
	t.update = function (dt) {
		this.super_update(dt);
		var overlaps = this.entities.filter( function (e) {
			return (e.x < CONFIG.width && e.x >= 0 && e.to_s != "Camera");
		});
		for (var i = 0; i < overlaps.length; i++) {
			overlaps[i].x += 3200;
			overlaps[i].checkCollisions(i, this.entities);
			overlaps[i].x -= 3200;
		}
	}
	t.draw = function (ctx) {
		this.super_draw(ctx);
		ctx.save();
		this.camera.draw(ctx);
		var overlaps = this.entities.filter( function (e) {
			return (e.x < CONFIG.width && e.x >= 0 && e.to_s != "Camera");
		});
		for (var i = 0; i < overlaps.length; i++) {
			overlaps[i].x += 3200;
			overlaps[i].draw(ctx);
			overlaps[i].x -= 3200;
		}
		ctx.restore();
	}

	var beam = undefined;

	var s = Object.create(Sprite).init(300, 200, Resources.viper);
	player = s;
	s.addBehavior(Accelerate, {maxSpeed: SPEED.ship});
	s.addBehavior(Velocity);
	s.family = "player";
	//s.addBehavior(Bound, {min: {x: -600, y: 0}, max: {x: 1800, y: 800}})
	s.health = 10;
	s.rotate_rate = 1;
	this._player = s;

	var wrap = Object.create(Behavior);
	wrap.update = function (dt) {
		if (this.entity.x > this.max.x) {
			this.entity.x = this.min.x + (this.entity.x - this.max.x);
		} else if (this.entity.x < this.min.x) {
			this.entity.x = this.max.x  - (this.min.x - this.entity.x);
		}
	}
	s.addBehavior(wrap, {min: {x: 320}, max: {x: 3520}});

	s.setVertices([
		{x: -3, y: -4},
		{x: -3, y: 4},
		{x: 5, y: 0}
	]);

	s.setCollision(Polygon)
	s.collision.onHandle = HandleCollision.handleSolid;

	debug = s;

	for (var i = -10000; i < 10000; i += 200) {
		var m = Object.create(Marker).init(i);
		this.entities.push(m);
	}

	this.addEntity(s);

	var camera = Object.create(Camera).init(0, 0);
	var b = Object.create(Behavior);
	b.update = function (dt) { 
		this.entity.x = s.x - CONFIG.width/2;//Math.floor(s.x - CONFIG.width/2);
		this.entity.y = s.y - CONFIG.height/2;//Math.max(0, Math.min(t.height - CONFIG.height, s.y - CONFIG.height / 2));
	};
	camera.addBehavior(b);
	camera.addBehavior(Bound, {min: {x: -10000, y: -10000}, max: {x: 10000, y: CONFIG.height / 2 + 80}})
	this.entities.unshift(camera);
	this.camera = camera;

	var e = Object.create(Entity).init(CONFIG.width / 2, CONFIG.height / 2, CONFIG.width, CONFIG.height);
	e.color = "red";
	e.opacity = 0.4;
	this.entities.push(e);

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
		s.rotate_rate = 0.5;
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

			for (var i = 0; i < scene.entities.length; i++) {
				if (scene.entities[i].family != this.entity.family && scene.entities[i].getVertices) {
					var v = scene.entities[i].getVertices();
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
			//other.opacity = 0.5;
		};
		scene.addEntity(beam);
	}
	this._gamepad.buttons.rt.onEnd = function () {
		scene.removeEntity(beam);
		s.rotate_rate = 1;		
	}

	generate(this);
};

var onUpdate = function (dt) {
	this._gamepad.update(dt);

	if (Math.random() < 0.01) {
		var asteroid = Object.create(Sprite).init(Math.random() * this.width, Math.random() * this.height, Resources.asteroid);
		var b = Object.create(Behavior);
		asteroid.health = 3;
		asteroid.family = "enemy";
		b.update = function (dt) { if (this.entity.health <= 0) this.entity.end(); };
		b.end = function () { this.entity.alive = false; }
		asteroid.addBehavior(b);
		asteroid.addBehavior(Fade);

		var invuln = Object.create(Behavior);
		invuln.update = function (dt) { 
			if (this.entity.invulnerable && this.entity.invulnerable > 0) {
				this.entity.invulnerable -= dt;
				this.entity.opacity = 0.5;
			} else {
				this.entity.invulnerable = false;
			}
		}
		asteroid.addBehavior(invuln);

		asteroid.addBehavior(Velocity);
		asteroid.solid = true;
		asteroid.setCollision(Polygon);
		asteroid.collision.onHandle = HandleCollision.handleSolid;
		asteroid.velocity = {x: Math.random() * SPEED.ship - SPEED.ship / 2, y: Math.random() * SPEED.ship - SPEED.ship / 2 };
		asteroid.doDamage = function (d) {
			if (!this.invulnerable) {
					this.health -= d;
					this.invulnerable = 0.2;
					console.log(this.invulnerable);
			}
		}
		this.addEntity(asteroid);
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

function generate (scene) {
	var last = 0;
	for (var i = 0; i < scene.width; i++) {
		if (Math.random() * 1000 <= last) {
			var maxWidth = Math.floor(Math.random() * 100) + 100;
			createBox(scene, i, 800, maxWidth);
			i += maxWidth;
			last = 0;
		}
		else last += 1;
	}	
}

function createBox(scene, x, y, w) {
	var h = Math.floor(Math.random() * 20) + 15;
	var e = Object.create(Entity).init(x - w/2, y - h/2, w, h);
	e.setCollision(Polygon);
	e.solid = true;
	e.family = "neutral";
	e.color = "#" + Math.floor(Math.random() *16777216).toString(16);
	e.opacity = 0.4;
	scene.addEntity(e);
	if (Math.random() * 100 < -33) {
		createBox(scene, x, y - h - 40, w);
	}
}