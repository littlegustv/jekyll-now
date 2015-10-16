var debug;

function modulo(n, p) {
	return (n % p + p) % p;
}

window.addEventListener("DOMContentLoaded", function () {
	var canvas = document.getElementById("mygame");
	var ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = false;
	ctx.textAlign = "center";

	var GLOBALS = {
		scale: 4,
		radius: 18,
		offset: 36,
		jumpSpeed: 750
	};

	var DIRECTION = {
		none: {x: 0, y: 0},
		east: {x: 1, y: 0},
		southeast: {x: 0, y: 1},
		southwest: {x: -1, y: 1},
		west: {x: -1, y: 0},
		northwest: {x: 0, y: -1},
		northeast: {x: 1, y: -1}
	};
	var directions = ["east", "southeast", "southwest", "west", "northwest", "northeast"];
	var conditions = {
		"space": function () { return world.keys.space; },
		"esc": function () { return world.keys.escape; }
	};

	function getDirectionName(d) {
		for (dir in DIRECTION) {
			if (d == DIRECTION[dir]) {
				return dir;
			}
		}
	}

	var Resources = {};
	var resourceInfo = [
		{path: "c1.png", frames: 2, speed: 400, animations: 6},
		{path: "east.png"},
		{path: "southeast.png"},
		{path: "southwest.png"},
		{path: "west.png"},
		{path: "northwest.png"},
		{path: "northeast.png"},
		{path: "o1.png", frames: 2, speed: 1000},
		{path: "hotspot.png", frames: 2, speed: 500},
		{path: "undertow.png", frames: 4, speed: 800},
		{path: "unstable.png", frames: 4, speed: 300},
		{path: "scenes.js"}
	];

	var World = {
		mouse: {down: false, x: 0, y: 0, angle: 0},
		keys: {space: false},
		init: function () {
			this.paused = true;
			this.loadResources();
			return this;
		},
		loadResources: function () {
			this.resourceLoadCount = 0;
			this.resourceCount = resourceInfo.length;
			var w = this;

			for (var i = 0; i < resourceInfo.length; i++ ) {
				var res = resourceInfo[i].path;
				var e = res.indexOf(".");
				var name = res.substring(0, e);
				var ext = res.substring(e, res.length);
				if (ext == ".png") {
					Resources[name] = {image: new Image(), frames: resourceInfo[i].frames || 1, speed: resourceInfo[i].speed || 1, animations: resourceInfo[i].animations || 1};
					Resources[name].image.src = "res/" + res;
					Resources[name].image.onload = function () {
						w.progressBar();
					}
				}
				else if (ext == ".ogg") {
					Resources[name] = {sound: new Audio("res/" + res, streaming=false)};
					w.progressBar();
					Resources[name].sound.onload = function () {
						console.log("loaded sound");
					}
				}
				else if (ext == ".js") {
					var request = new XMLHttpRequest();
					request.open("GET", "res/" + res, true);
					request.onload = function () {
						try {
							w.sceneInfo = JSON.parse(request.response);
							w.progressBar();
						}
						catch (e) {
							console.log("Error in JSON file load:", e);
						}
					};
					request.send();
				}
			}
		},
		progressBar: function () {
			this.resourceLoadCount += 1;
			if (this.resourceLoadCount >= this.resourceCount) {
				this.begin();
			}
		},
		begin: function () {
			this.scenes = [], this.cs = 0;
			var sceneJSON = this.sceneInfo.scenes;
			for (var i = 0; i < sceneJSON.length; i++) {
				console.log("hey");
				this.createScene(sceneJSON[i]);
			}
			/*var s = Object.create(Scene).init();
			var s2 = Object.create(Scene).init();
			this.scenes.push(s);
			this.scenes.push(s2);*/
			this.time = new Date();
			this.paused = true;
			this.step();
		},
		createScene: function (config) {
			var s = Object.create(Scene).init(config.name);
			for (var i = 0; i < config.entities.length; i++) {
				var c = config.entities[i];
				var e;
				switch (c.type) {
					case "text":
						e = Object.create(Text).init(c.gridX, c.gridY, c.text, c.size);
						break;
					case "character":
						e = Object.create(Character).init(c.gridX, c.gridY, Resources.c1);
						break;	
				}
				if (e) s.entities.push(e);
			}
			for (var i = 0; i < config.map.length; i++) {
				var c = config.map[i];
				var m;
				switch(c.type) {
					case "obstacle":
						m = Object.create(Obstacle).init(c.gridX, c.gridY, Resources.o1);
						break;
					case "hotspot":
						m = Object.create(HotSpot).init(c.gridX, c.gridY, Resources.hotspot);
						break;
					case "undertow":
						m = Object.create(UnderTow).init(c.gridX, c.gridY, Resources.undertow);
						break
					case "unstable":
						m = Object.create(Unstable).init(c.gridX, c.gridY, Resources.unstable);
						break;
				}
				if (m) s.map[c.gridY][c.gridX] = m;
			}
			for (var i = 0; i < config.exits.length; i++) {
				var e = Object.create(Exit).init(config.exits[i].destination, conditions[config.exits[i].condition]);
				s.exits.push(e);
			}
			debug = s;
			this.scenes.push(s);
		},
		save: function () {
			var current = this.scenes[this.cs];
			var save = {name: current.name, map: []};
			save.name = current.name;
			for (y in current.map) {
				for (x in current.map[y]) {
					if (current.map[y][x] != undefined) {
						save.map.push({gridX: x, gridY: y, type: current.map[y][x].type});
					}
				}
			}
			return JSON.stringify(save);
		},
		step: function () {
			var newTime = new Date();
			var dt = newTime - this.time;
			this.time = newTime;
			this.scenes[this.cs].update(dt);
			this.scenes[this.cs].draw(ctx);
			this.drawCursor(ctx);
			var w = this;
			window.requestAnimationFrame(function () {	w.step();  });
		},
		getAt: function (x, y) {
			return this.scenes[this.cs].getAt(x,y);
		},
		toGrid: function (x, y) {
			var gridY = Math.round((y - GLOBALS.radius) / (Math.sin(Math.PI / 3) * 2 * GLOBALS.radius ));
			return {
				x: Math.round((x - (gridY * GLOBALS.radius + GLOBALS.radius)) / (GLOBALS.radius * 2)),
				y: gridY
			}
		},
		remove: function (position) {
			this.scenes[this.cs].remove(position);
		},
		drawCursor: function (ctx) {
			if (this.mouse.down) {
				var m = this.toGrid(this.mouse.x, this.mouse.y);
				var p = this.getAt(m.x, m.y);
				if (p && (p.type == "obstacle" || p.type == "platform")) return;
				else {
					ctx.globalAlpha = 0.5;
					var dir = directions[this.mouse.angle];
					var mx = m.x * GLOBALS.radius * 2 + m.y * GLOBALS.radius + GLOBALS.radius;
					var my = Math.sin(Math.PI / 3) * 2 * GLOBALS.radius * m.y + GLOBALS.radius;
					var w = Resources[dir].image.width * GLOBALS.scale, h = Resources[dir].image.height * GLOBALS.scale;
			        ctx.drawImage(Resources[dir].image, mx - Math.round(w / 2), my - Math.round(h / 2), w, h);
			        ctx.globalAlpha = 1.0;
		    	}
			}
		},
		addPlatform: function () {
			var m = this.toGrid(this.mouse.x, this.mouse.y);
			var dir = directions[this.mouse.angle];
			this.scenes[this.cs].addPlatform(m, dir);
		},
		add: function (obj) {
			this.scenes[this.cs].add(obj);
		}
	};

	var Scene = {
		init: function (name) {
			this.name = name;
			this.setupMap();
			this.entities = [];
			this.exits = [];
			return this;
		},
		draw: function (ctx) {
			ctx.clearRect(0,0,canvas.width,canvas.height);
			ctx.fillStyle = "#f0e848";
			ctx.fillRect(0,0,canvas.width,canvas.height);
			for (y in this.map) {
				for (x in this.map[y]) {
					if (this.map[y][x]) {
						this.map[y][x].draw(ctx);
					}
				}
			}
			for (var i = 0; i < this.entities.length; i++) {
				this.entities[i].draw(ctx);
			}
		},
		update: function (dt) {
			for (y in this.map) {
				for (x in this.map[y]) {
					if (this.map[y][x]) {
						this.map[y][x].update(dt);
					}
				}
			}
			for (var i = 0; i < this.entities.length; i++) {
				this.entities[i].update(dt);
			}
			// check exit points for scene
			for (var i = 0; i < this.exits.length; i++) {
				this.exits[i].check();
			}
		},
		setupMap: function () {
			this.map = {};
			for (var i = 0; i <= canvas.height / (2 * GLOBALS.radius); i++) {
				var row = {};
				for (var j = -i; j <= canvas.width / (2 * GLOBALS.radius); j++) {
					row[j] = undefined;
				}
				this.map[i] = row;
			}
		},
		getAt: function (x, y) {
			return this.map[y] ? this.map[y][x] : undefined;
		},
		remove: function (position) {
			if (this.map[position.y]) this.map[position.y][position.x] = undefined;
		},
		addPlatform: function (position, direction) {
			if (this.map[position.y]) {
				var m = this.map[position.y][position.x];
				if (m && (m.type == "obstacle" || m.type == "platform")) return;
				else {
					var p = Object.create(Platform).init(position.x, position.y, Resources[direction], DIRECTION[direction]);
					if (m && m.callback) { p.onJump = m.callback; }
					this.map[position.y][position.x] = p;
				}
			}
		},
		add: function (obj) {
			if (this.map[obj.gridY]) {
				var m = this.map[obj.gridY][obj.gridX];
				if (m && (m.type == "obstacle" || m.type == "platform")) return;
				else {
					this.map[obj.gridY][obj.gridX] = obj;
				}
			}
		}
	};

	var Entity = {
		frame: 0,
		delay: 0,
		offset: {x: 0, y: 0},
		direction: DIRECTION.none,
		distance: 0,
		jumping: 0,
		init: function (gridX, gridY, sprite, direction) {
			this.gridX = gridX, this.gridY = gridY;
	    	this.sprite = sprite, this.h = this.sprite.image.height * GLOBALS.scale / this.sprite.animations, this.w = this.sprite.image.width * GLOBALS.scale / this.sprite.frames;
	    	this.frame = 0, this.maxFrame = this.sprite.frames, this.frameDelay = this.sprite.speed, this.maxFrameDelay = this.sprite.speed, this.animation = 0;
	    	this.direction = direction ? direction : DIRECTION.none;
			return this;
		},
		getPosition: function () {
			var ox = this.gridX, oy = this.gridY, j = 0;
			if (this.jumping > 0) {
				ox += this.direction.x * this.distance * ((GLOBALS.jumpSpeed - this.jumping) / GLOBALS.jumpSpeed);
				oy += this.direction.y * this.distance * ((GLOBALS.jumpSpeed - this.jumping) / GLOBALS.jumpSpeed);
				j = Math.sin(Math.PI * (GLOBALS.jumpSpeed - this.jumping) / GLOBALS.jumpSpeed) / 2;
				oy -= j
			}
			return {x: ox * GLOBALS.radius * 2 + oy * GLOBALS.radius + GLOBALS.radius + this.offset.x,
				y: Math.sin(Math.PI / 3) * 2 * GLOBALS.radius * oy + GLOBALS.radius + this.offset.y, scale: j/2 + 1} 
		},
//		drawY: function () {  },
		draw: function (ctx) {
			var o = this.getPosition();
			ctx.drawImage(this.sprite.image, 
        		this.frame * this.w / GLOBALS.scale, this.animation * this.h / GLOBALS.scale, 
        		this.w / GLOBALS.scale, this.h / GLOBALS.scale, 
        		Math.round(o.x - o.scale * this.w / 2), Math.round(o.y - o.scale * this.h / 2), o.scale * this.w, o.scale * this.h);
		},
		update: function (dt) {
			this.frameDelay -= dt;
			if (this.frameDelay <= 0) {
				this.frameDelay = this.maxFrameDelay;
				this.frame = (this.frame + 1) % this.maxFrame;
			}
		}
	};

	var Exit = {
		init: function (destination, condition) {
			this.destination = destination;
			this.condition = condition;
			return this;
		},
		check: function () {
			if (this.condition()) {
				world.paused = true;
				world.cs = this.destination;
			}
		}
	}

	var Platform = Object.create(Entity);
	Platform.type = "platform";
	Platform.distance = 2;
	Platform.onJump = function () {};

	var Obstacle = Object.create(Entity);
	Obstacle.type = "obstacle";

	var Environment = Object.create(Entity);
	Environment.type = 'environment';

	var UnderTow = Object.create(Environment);
	UnderTow.type = "undertow";
	UnderTow.callback = function () {
		var d = (directions.indexOf(getDirectionName(this.direction)) + 1) % 6;
		this.direction = DIRECTION[directions[d]];
		this.sprite = Resources[directions[d]];
	}

	var HotSpot = Object.create(Environment);
	HotSpot.type = "hotspot";
	HotSpot.callback = function () {
		world.remove({x: this.gridX, y: this.gridY});
		var o = Object.create(Obstacle).init(this.gridX, this.gridY, Resources.o1);
		world.add(o);
	}

	var Unstable = Object.create(Environment);
	Unstable.type = "unstable";
	Unstable.callback = function () {
		world.remove({x: this.gridX, y: this.gridY});
		var u = Object.create(Unstable).init(this.gridX, this.gridY, Resources.unstable);
		world.add(u);
	}

	var Text = Object.create(Entity);
	Text.type = "text";
	Text.init = function (x, y, text, size) {
		this.size = size, this.gridX = x, this.gridY = y, this.text = text;
		return this;
	};
	Text.update = function (dt) {};
	Text.draw = function (ctx) {
		var p = this.getPosition();
		ctx.fillStyle = "black";
		ctx.font = this.size + "px Monospace";
		ctx.fillText(this.text, p.x, p.y);
	};

	var Character = Object.create(Entity);
	Character.offset = {x: 0, y: -12};
	Character.jumping = 0;
	Character.type = "character";
	Character.update = function (dt) {
		this.frameDelay -= dt;
		if (this.frameDelay <= 0) {
			this.frameDelay = this.maxFrameDelay;
			this.frame = (this.frame + 1) % this.maxFrame;
		}
		if (world.paused) return;
		if (this.jumping > 0) {
			this.jumping -= dt;
		}
		if (this.jumping <= 0) {
			this.gridX += this.distance * this.direction.x;
			this.gridY += this.distance * this.direction.y;
			this.distance = 0;
			this.direction = DIRECTION.none;
			var p = world.getAt(this.gridX, this.gridY);
			if (!p || p.type == "obstacle") { 
				this.jumping = GLOBALS.jumpSpeed;
				setTimeout(function () { world.begin(); }, 100);
			}
			else if (p.direction) {
				var c = this;
				var d = 0;
				while (d < p.distance) {
					var p2 = world.getAt(this.gridX + p.direction.x * (d + 1), this.gridY + p.direction.y * (d + 1));
					if (p2 && p2.type == "obstacle") {
						break;
					} else {
						d += 1;
					}
				}
				if (d == 0 || p.type == "obstacle") {
					this.jumping = GLOBALS.jumpSpeed;
					setTimeout(function () { world.begin(); }, 100);
				} else {
					this.direction = p.direction;
					this.distance = d;
					this.jumping = GLOBALS.jumpSpeed;
					this.animation = directions.indexOf(getDirectionName(this.direction));
					p.onJump();
					//this.animation = 
	//				setTimeout(function () { c.gridX += p.direction.x * d, c.gridY += p.direction.y * d; c.jumping = false;}, 500);
				}
			}
		}
	};

	/* GAME OBJECT INSTANCES */

	var world = Object.create(World).init();

	canvas.addEventListener("mousedown", function (e) {
		world.mouse.down = true;
		world.mouse.x = e.offsetX, world.mouse.y = e.offsetY;
	});

	canvas.addEventListener("mousemove", function (e) {
		var theta = Math.atan2(e.offsetY - world.mouse.y, e.offsetX - world.mouse.x);
		world.mouse.angle = modulo(Math.round(theta / (Math.PI / 3)), 6);
	});

	canvas.addEventListener("mouseup", function (e) {
		world.mouse.down = false;
		var m = world.toGrid(e.offsetX, e.offsetY);
		var action = document.getElementById("action");
		switch (action.value) {
			case "platform":
				world.addPlatform();
				break;
			case "obstacle":
				var o = Object.create(Obstacle).init(m.x, m.y, Resources.o1);
				world.add(o);
				break;
			case "hotspot":
				var o = Object.create(HotSpot).init(m.x, m.y, Resources.hotspot);
				world.add(o);
				break;
			case "undertow":
				var o = Object.create(UnderTow).init(m.x, m.y, Resources.undertow);
				world.add(o);
				break;
			case "unstable":
				var o = Object.create(Unstable).init(m.x, m.y, Resources.unstable);
				world.add(o);
				break;
			case "remove":
				world.remove(m);
				break;
		}
	});

	document.addEventListener("keydown", function (e) {
		if (e.keyCode == 32) {
			world.keys.space = true;
			world.paused = !world.paused;
		}
	});

	document.getElementById("save").addEventListener("click", function () {
		var js = world.save();
		document.getElementById("json").value = js;
	});

});