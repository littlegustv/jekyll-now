// name: 'salvage'

function notFriendly (callback) {
	return function (object, other) {
		if (other.family == object.family) return false;
		else if (!other.family || !object.family) return false;
		return callback.call(this, object, other);
	}
}

var onStart = function () {

	Polygon.onCheck = notFriendly(Polygon.onCheck);


	var t = this;

	var beam = undefined;

	var s = Object.create(Sprite).init(300, 200, Resources.viper);
	s.addBehavior(Accelerate, {maxSpeed: SPEED.ship});
	s.addBehavior(Velocity);
	s.family = "player";
	//s.addBehavior(Bound, {min: {x: -600, y: 0}, max: {x: 1800, y: 800}})
	s.health = 10;
	s.rotate_rate = 1;
	this._player = s;

	s.setVertices([
		{x: -3, y: -4},
		{x: -3, y: 4},
		{x: 5, y: 0}
	]);

	s.setCollision(Polygon)
	s.collision.onHandle = HandleCollision.handleSolid;

	debug = s;


	for (var i = 0; i < this.data.entities.length; i++) {
		var eData = this.data.entities[i];
		if (eData.sprite) {
			if (eData.tile) {
				var e = Object.create(TiledBackground).init(eData.x, eData.y, eData.w || this.width * 2, eData.h || this.height * 2, Resources[eData.sprite]);
				e.bounce = 0.2;
				e.addBehavior(Animate);
			} else {
				var e = Object.create(Sprite).init(eData.x, eData.y, Resources[eData.sprite]);
				e.opacity = 0;
				e.health = 3;
				var b = Object.create(Behavior);
				b.update = function (dt) { if (this.entity.health <= 0) this.entity.end(); };
				b.end = function () { this.entity.alive = false; }
				e.addBehavior(b);
				e.addBehavior(Fade, {speed: 1});
				if (eData.sprite == "saucer") {
					e.health = 10;
					//e.addBehavior(SimpleAI, {target: s});
					e.addBehavior(Velocity);
					//e.setCollision(Polygon);
					//e.handleCollision = Collision.handleSolid;
				}
			}
		}
		else {
			var e = Object.create(Entity).init(eData.x, eData.y);
			e.angle = Math.random() * Math.PI * 2;
		}
		if (eData.collide == "Polygon") {
			e.setCollision(Polygon);
		}
		e.family = eData.family || "";
		e.solid = eData.solid || false;
		e.bounce = 0;
		if (eData.velocity) e.velocity = eData.velocity;
		this.entities.push(e);

		if (eData.vertices) e.setVertices(eData.vertices);
	}


	this.addEntity(s);

	var camera = Object.create(Camera).init(0, 0);
	var b = Object.create(Behavior);
	b.update = function (dt) { 
		this.entity.x = Math.floor(s.x - CONFIG.width/2);
		this.entity.y = Math.max(0, Math.min(t.height - CONFIG.height, s.y - CONFIG.height / 2));
	};
	camera.addBehavior(b);
	this.entities.unshift(camera);

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
		//var e = Object.create(Sprite).init(s.x, s.y, Resources.projectile);
		//e.angle = s.angle;
		/*e.handleCollision = function (other) {
			if (other.health) {
				other.health -= 1;
				this.alive = false;
			} else if (other.solid) {
				this.alive = false;
			}
		}
		e.velocity = {x: Math.cos(s.angle) * SPEED.projectile, y: Math.sin(s.angle) * SPEED.projectile};
		e.addBehavior(Velocity);
		scene.entities.push(e);*/


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
			var w = createBox(scene, i, 800);
			i += w;
			last = 0;
		}
		else last += 1;
	}	
}

function createBox(scene, x, y) {
	//var h = Math.random() * 100 + 50, w = Math.random() * 50 + 25;
	var e = Object.create(Sprite).init(x, y - 3 * 18, Resources.box);
	e.setCollision(Polygon);
	e.solid = true;
	e.family = "neutral";
	e.addBehavior(Fade);
	var maxWidth = e.w;
	scene.addEntity(e);
	if (Math.random() * 100 < 33) {
		var connector = Object.create(Sprite).init(x, (y - e.h) - 36, Resources.connecterVertical);
		scene.addEntity(connector);
		var mw2 = createBox(scene, x, (y - e.h) - connector.h);
		maxWidth = Math.max(maxWidth, mw2);
	} else {
		for (var i = 0; i < 2; i++) {
			var building = Object.create(Sprite).init(x - 20 + i * 40, y - e.h - 72, Resources.tower);
			building.setCollision(Polygon);
			building.setFrame("random");
			building.solid = true;
			building.family = "neutral";
			building.sprite.speed = 0;
			building.addBehavior(Fade);
			scene.addEntity(building);
		}
	}
	return maxWidth;
}