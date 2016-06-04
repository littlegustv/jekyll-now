// name: 'salvage'


var player;
var other;

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

	var scene = this;

	var bg_camera = Object.create(Camera).init(0, 0);
	var b = Object.create(Behavior);
	b.update = function (dt) {
		this.entity.x = (s.x - CONFIG.width / 2) / 10;
	}
	bg_camera.addBehavior(b);
	var bg = Object.create(Layer).init(bg_camera);
	scene.layers.push(bg);

	bg.add(Object.create(Entity).init(0,0,60,200));

	var fg_camera = Object.create(Camera).init(0, 0);
	var b = Object.create(Behavior);
	b.update = function (dt) { 
		this.entity.x = s.x - CONFIG.width/2;//Math.floor(s.x - CONFIG.width/2);
		this.entity.y = s.y - CONFIG.height/2;//Math.max(0, Math.min(t.height - CONFIG.height, s.y - CONFIG.height / 2));
	};
	fg_camera.addBehavior(b);
	fg_camera.addBehavior(Bound, {min: {x: -10000, y: 0}, max: {x: 10000, y: this.height - CONFIG.height}})

	var fg = Object.create(Layer).init(fg_camera);

	scene.layers.push(fg);

	// create an entity to define the overlap region
	var overlap_region = Object.create(Entity).init(CONFIG.width / 2,this.height / 2,CONFIG.width,this.height);
	overlap_region.setCollision(Polygon);
	overlap_region.family = "code";
	
	var t = fg;

	t.super_update = t.update, t.super_draw = t.draw;
	t.update = function (dt) {
		this.super_update(dt);
		var overlaps = this.entities.filter( function (e) {
			return (overlap_region.collision.onCheck(overlap_region, e));
//			return (e.x < CONFIG.width && e.x >= 0 && e.to_s != "Camera");
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
			return (overlap_region.collision.onCheck(overlap_region, e));
//			return (e.x < CONFIG.width && e.x >= 0 && e.to_s != "Camera");
		});
		for (var i = 0; i < overlaps.length; i++) {
			overlaps[i].x += 3200;
			overlaps[i].draw(ctx);
			overlaps[i].x -= 3200;
		}
		ctx.restore();
	}

	var beam = undefined;

	var s = Object.create(Sprite).init(640, 200, Resources.viper);
	player = s;
	s.addBehavior(Accelerate, {maxSpeed: SPEED.ship});
	s.addBehavior(Velocity);
	s.family = "player";
	s.addBehavior(Bound, {min: {x: -10000000, y: 0}, max: {x: 1000000, y: 1600}})
	s.health = 10;
	s.rotate_rate = 1;
	this._player = s;

	s.addBehavior(Wrap, {min: {x: 320}, max: {x: 3520}});

	s.setVertices([
		{x: -3, y: -4},
		{x: -3, y: 4},
		{x: 5, y: 0}
	]);

	s.setCollision(Polygon)
	s.collision.onHandle = HandleCollision.handleSolid;

	var ai = Object.create(Sprite).init(400, 200, Resources.saucer);
	ai.addBehavior(Wrap, {min: {x: 0}, max: {x: 3200}});
	ai.addBehavior(Accelerate, {maxSpeed: SPEED.ship});
	ai.addBehavior(Velocity);
	ai.velocity = {x: 0, y: 0};
	/*ai.addBehavior(Pathfind, {
		layer: fg,
		bound: {min: {x: 0, y: 0}, max: {x: 3200, y: 1600}},
		cell_size: 80,
		target: s
	})*/
	//ai.addBehavior(SimpleAI, {target: s});
	ai.family = "enemy";
	// FIX ME: have to add collision before an entity 'wraps'
	ai.setCollision(Polygon);
	ai.collision.onHandle = HandleCollision.handleSolid;

	ai.addBehavior(Loop, {duration: 2, radius: 40});
	ai.addBehavior(Bounce, {duration: 4, max: 40});
	ai.addBehavior(Beacon, {target: s});
	ai.addBehavior(WarningShot, {target: s});

	fg.add(ai);

	var barrier = Object.create(Entity).init(500, 0, 10, 600);
	barrier.setCollision(Polygon);
	barrier.family = "neutral";
	barrier.solid = true;
	fg.add(barrier);

	other = ai;
	//debug = ai;
	/*
	for (var i = -10000; i < 10000; i += 200) {
		var m = Object.create(Marker).init(i);
		this.entities.push(m);
	}*/

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
			//other.opacity = 0.5;
		};
		beam.layer = fg;
		scene.add(beam);
	}
	this._gamepad.buttons.rt.onEnd = function () {
		fg.remove(beam);
		s.rotate_rate = 1;		
	}

	generate(fg, this.width, this.height);
};

var onUpdate = function (dt) {
	this._gamepad.update(dt);
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