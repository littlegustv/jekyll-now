/**

todo: 
in order to put off making puzzles:
- memory (localstorage?) -> remember levels completed - how much more?
- collectables show as completed levels, bg images for stages screen
- make some puzzles, why not?
- UNSTABLE is not a very useful mechanic, so far ... maybe instead, obstacles that break apart after one 'hit'

- unstable/undertow happen with EACH jump, not just when you jump on them

touch controls, mobile optimization, kongregate api

Level 0: Reconnaissance (tutorial)
Level 1: Habitation -> rescue cats, fishbowls? ... household things
	-> warning.  wreckage exibiting high temperatures, dangerous radiation.  platform movement will avoid.
	(every warning is displayed for each new level as well, first one, then two, three, etc.)
Level 2: Hydroponics -> (unstable) ... rescue plants, have a 'timer'  --> 'unstable' in groups looks nice, by the way
	-> warning.  plasma surface experiencing turbulance.  platforms may be unstable.
Level 3: Operations -> (undertow) ... 
	-> warning.  strong undertow currents detected.  directional stability may be comprimised.
Level 4: Engineering -> (hotspot)
	-> warning.  frequent temperature anomolies.  'hot spots' may occur - proceed with caution.
Level 5: Medical

ship interior, where you can place the objects that you rescued?

**/

// debug variable

var debug;

// helper functions

function modulo(n, p) {
	return (n % p + p) % p;
}

window.addEventListener("DOMContentLoaded", function () {

	function mouseUp (e) {
		if (world.mouse.cooldown > 0) return;
		world.mouse.cooldown = 250;
		if (e.changedTouches) console.log("end", e);
		e.offsetX = e.offsetX || e.changedTouches[0].clientX;
		e.offsetY = e.offsetY || e.changedTouches[0].clientY;

		var m = world.toGrid(e.offsetX, e.offsetY);
		world.mouse.down = false;
		
		// check if button is at location

		if (world.scene.button(e.offsetX, e.offsetY)) { return; }
		
		// right click

		if (e.which === 3 || e.button === 2) {
			world.remove(m, "platform");
			return;
		}

		// DEBUG BEHAVIOR

		var action = document.getElementById("action").value || "platform";
		switch (action) {
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
			case "collectable":
				var c = Object.create(Collectable).init(m.x, m.y, Resources.collectable);
				world.addEntity(c);
				break;
		}
	}

	function mouseDown (e) {
		if (world.mouse.cooldown > 0) return;
		e.offsetX = e.offsetX || e.changedTouches[0].clientX;
		e.offsetY = e.offsetY || e.changedTouches[0].clientY;
		world.mouse.x = e.offsetX, world.mouse.y = e.offsetY;

		if (e.changedTouches) console.log("start", e);
		if (!world.scene || world.scene.type != "level") return;
		else world.mouse.down = true;
	}

	function mouseMove (e) {
		if (world.mouse.cooldown > 0) return;
		if (e.changedTouches) console.log("moving", e);
		e.offsetX = e.offsetX || e.changedTouches[0].clientX;
		e.offsetY = e.offsetY || e.changedTouches[0].clientY;

		world.scene.highlightButton(e.offsetX, e.offsetY);
		if (!world.scene || world.scene.type != "level") return;
		var theta = Math.atan2(e.offsetY - world.mouse.y, e.offsetX - world.mouse.x);
		world.mouse.angle = modulo(Math.round(theta / (Math.PI / 3)), 6);
		//console.log(world.mouse);
		if (!world.mouse.down) {
			world.mouse.x = e.offsetX, world.mouse.y = e.offsetY;
		}
	}

	var canvas = document.getElementById("mygame");
	var ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = false;

	var GLOBALS = {
		scale: 4,
		width: 18,
		height: 16,
		border: 24,
		jumpSpeed: 750
	};

	// keys
	var directions = ["east", "southeast", "southwest", "west", "northwest", "northeast"];
	// values
	var DIRECTION = {
		none: {x: 0, y: 0},
		east: {x: 1, y: 0},
		southeast: {x: 0, y: 1},
		southwest: {x: -1, y: 1},
		west: {x: -1, y: 0},
		northwest: {x: 0, y: -1},
		northeast: {x: 1, y: -1}
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
		{path: "scenes.js"},
		{path: "collectable.png", frames: 2, speed: 650},
		{path: "start.png", frames: 2, speed: 500},
		{path: "cell.png", frames: 5, speed: 1500},
		{path: "reset.png", frames: 2, speed: 500},
		{path: "back.png", frames: 2, speed: 500},
		{path: "play.png", frames: 2, speed: 500}
	];

	var World = {
		// for locking/unlocking stages on completion
		stages: {
			habitation: true,
			hydroponics: true,
			operations: false,
			engineering: false,
			medical: false
		},
		mouse: {down: false, x: 0, y: 0, angle: 0, cooldown: 0},
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
				this.addEventListeners();
				this.begin();
			}
		},
		reset: function () {
			var i = this.cs;
			this.paused = true;
			this.scene = this.createScene(i);
		},
		addEventListeners: function () {
			canvas.addEventListener("contextmenu", function (e) {
				e.preventDefault();
				return false;
			});
			canvas.addEventListener("mousedown", mouseDown);
			canvas.addEventListener("mousemove", mouseMove);
			canvas.addEventListener("mouseup", mouseUp);

			canvas.addEventListener("touchstart", mouseDown);
			canvas.addEventListener("touchmove", mouseMove);
			canvas.addEventListener("touchend", mouseUp);		

		},
		loadBG: function () {
			this.bg = {};
			for (var i = -2; i <= 2 + canvas.height / (2 * GLOBALS.height); i++) {
				var row = {};
				for (var j = -i; j <= canvas.width / (2 * GLOBALS.width); j++) {
					var o = Object.create(Cell).init(j, i, Resources.cell);
					o.frame = Math.floor(Math.random() * Resources.cell.frames);
					o.maxFrameDelay = Math.floor(Math.random() * 500 + 3000);
					o.frameDelay = Math.floor(Math.random() * o.maxFrameDelay);//row[j].maxFrameDelay;
					row[j] = o;
				}
				this.bg[i] = row;
			}
		},
		updateBG: function (dt) {
			for (y in this.bg) {
				for (x in this.bg[y]) {
					this.bg[y][x].update(dt);
				}
			}
		},
		drawBG: function (ctx) {
			for (y in this.bg) {
				for (x in this.bg[y]) {
					this.bg[y][x].draw(ctx);
				}
			}
		},
		begin: function () {
			this.loadBG();
			this.scenes = this.sceneInfo.scenes, this.cs = 0;
			//var sceneJSON = this.sceneInfo.scenes;
			//for (var i = 0; i < sceneJSON.length; i++) {
			//	this.scenes.push(this.createScene(sceneJSON[i]));
			//}

			/*
				create and fill 'stages' here
				 - or just use that to draw stages on stagemenu?  array filter, quick and simple

			*/

			this.scene = this.createScene(this.cs);
			/*var s = Object.create(Scene).init();
			var s2 = Object.create(Scene).init();
			this.scenes.push(s);
			this.scenes.push(s2);*/
			this.time = new Date();
			this.paused = true;
			this.step();
		},
		doScene: function (n) {
			//this.cs = n;
			this.scene = this.createScene(n);
			//debug = this.scene;
			if (this.scene.type == "level") this.cs = n;
		},
		createScene: function (n) {
			//console.log(n);
			var config = this.scenes[n];
			var s = Object.create(Scene).init(config.name);
			s.uid = n;
			s.type = config.type || "none";
			s.max = config.max || 0;
			for (var i = 0; i < config.entities.length; i++) {
				var c = config.entities[i];
				var e;
				switch (c.type) {
					case "text":
						e = Object.create(Text).init(c.gridX, c.gridY, c.text, c.format, c.speed, c.delay);
						break;
					case "character":
						var start = Object.create(Entity).init(c.gridX, c.gridY, Resources.start);
						start.offset = {x: 0, y: -11 * GLOBALS.height - 7};
						start.type = "start";
						s.entities.push(start);
						s.start = {x: start.gridX, y: start.gridY};
						e = Object.create(Character).init(c.gridX + 5, c.gridY - 10, Resources.c1);
						e.jumping = GLOBALS.jumpSpeed;
						e.direction = {x: -1, y: 2};
						e.distance = 5;
						s.character = e;
						debug = e;
						break;
					case "collectable":
						e = Object.create(Collectable).init(c.gridX, c.gridY, Resources.collectable);
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
						m.frameDelay = Math.floor(Math.random() * m.maxFrameDelay);
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
			/*
			for (var i = 0; i < config.exits.length; i++) {
				var e = Object.create(Exit).init(config.exits[i].destination, conditions[config.exits[i].condition]);
				s.entities.push(e);
			}*/
			if (s.type == "level") {
				// ADD LEVEL BUTTONS: reset, back, play
				var b = Object.create(Button).init( 0, 0, Resources.reset);
				b.callback = function () {
					world.reset();
				};
				s.buttons.push(b);
				var b = Object.create(Button).init( 1, 0, Resources.back);
				b.callback = function () {
					world.doScene(2);
				};
				s.buttons.push(b);
				var b = Object.create(Button).init( 2, 0, Resources.play);
				b.callback = function () {
					console.log("yeah!!!", this);
					world.paused = !world.paused;
				};
				s.buttons.push(b);
				var t = Object.create(Text).init(canvas.width / 2, canvas.height - 40, s.name, {});
				s.addEntity(t);
			}
			if (s.name == "mainmenu") {
				var t = Object.create(Text).init(0, 0,"-- New Game --",{});
				var tb = Object.create(TextButton).init(canvas.width / 2,canvas.height / 2 + 40,t);
				tb.callback = function () {
					world.doScene(2);
				};
				s.buttons.push(tb);
			
				var t = Object.create(Text).init(0, 0,"-- Continue --",{});
				var tb = Object.create(TextButton).init(canvas.width / 2,canvas.height / 2 + 68,t);
				tb.callback = function () {
					world.doScene(2);
				};
				s.buttons.push(tb);

				var t = Object.create(Text).init(0, 0,"-- Credits --",{});
				var tb = Object.create(TextButton).init(canvas.width / 2,canvas.height / 2 + 96,t);
				tb.callback = function () {
					world.doScene(1);
				};
				s.buttons.push(tb);
			}
			if (s.name == "stagemenu") {
				var y = 100;
				for (stage in this.stages) {
					if (this.stages[stage]) {
						var title = Object.create(Text).init(canvas.width - GLOBALS.border, y, stage, {color: "#000000", align: "right"});
						s.entities.push(title);
						var levels = this.scenes.filter(function (a) { return a.stage == stage; });
						for (var i = 0; i < levels.length; i++) {
							var t = Object.create(Text).init(0, 0,  String(i), {align: "left"});
							var tb = Object.create(TextButton).init(GLOBALS.border + i * 25, y, t);
							var w = this.scenes.indexOf(levels[i]);
							tb.destination = w;
							tb.callback = function () {
								world.doScene(this.destination);
							};
							s.buttons.push(tb);
							//console.log(tb);
						}
						y += 28;
					} else {
						var title = Object.create(Text).init(canvas.width - GLOBALS.border, y, stage, {color: "#333333", align: "right"});
						s.entities.push(title);
						var levels = this.scenes.filter(function (a) { return a.stage == stage; });
						for (var i = 0; i < levels.length; i++) {
							var t = Object.create(Text).init(canvas.width / 2 + i * 20, y,  String(i), {color: "#333333", align: "left"});
							s.buttons.push(t);
						}
						y += 28;
					}
				}
			}
			//debug = s;
			return s;
		},
		save: function () {
			var current = this.scene;
			var save = {name: "default", type: "level", stage: "recon", max: 20, map: [], entities: [], exits: []};
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

			this.mouse.cooldown -= dt;

			ctx.clearRect(0,0,canvas.width,canvas.height);

			this.updateBG(dt);
			this.drawBG(ctx);
			
			this.scene.update(dt);
			this.scene.draw(ctx);
			if (this.scene.type == "level") {
				this.drawCursor(ctx);
			}
			var w = this;
			window.requestAnimationFrame(function () {	w.step();  });
		},
		getAt: function (x, y) {
			return this.scene.getAt(x,y);
		},
		toGrid: function (x, y) {
			var gridY = Math.round((y - GLOBALS.border) / (Math.sin(Math.PI / 3) * 2 * GLOBALS.height ));
			return {
				x: Math.round((x - (gridY * GLOBALS.width + GLOBALS.border)) / (GLOBALS.width * 2)),
				y: gridY
			}
		},
		remove: function (position, type) {
			this.scene.remove(position, type);
		},
		removeEntity: function (e) {
			this.scene.removeEntity(e);
		},
		drawCursor: function (ctx) {
			var m = this.toGrid(this.mouse.x, this.mouse.y);
			if (this.mouse.down) {
				var p = this.getAt(m.x, m.y);
				if (p && (p.type == "obstacle" || p.type == "platform")) return;
				else {
					ctx.globalAlpha = 0.5;
					var dir = directions[this.mouse.angle];
					var mx = m.x * GLOBALS.width * 2 + m.y * GLOBALS.width + GLOBALS.border;
					var my = Math.sin(Math.PI / 3) * 2 * GLOBALS.height * m.y + GLOBALS.border;
					var w = Resources[dir].image.width * GLOBALS.scale, h = Resources[dir].image.height * GLOBALS.scale;
			        ctx.drawImage(Resources[dir].image, mx - Math.round(w / 2), Math.ceil(my - h / 2), w, h);
			        ctx.globalAlpha = 1.0;
		    	}
			}
			if (this.scene.start) {
				ctx.font = "24px Teko";
				ctx.textAlign = "center";
				ctx.fillStyle = "black";
				var mx = modulo(m.x - this.scene.start.x, 2);
				var my = modulo(m.y - this.scene.start.y, 2);
				ctx.fillText(mx + ", " + my, this.mouse.x, this.mouse.y);
			}
		},
		addPlatform: function () {
			var m = this.toGrid(this.mouse.x, this.mouse.y);
			var dir = directions[this.mouse.angle];
			this.scene.addPlatform(m, dir);
		},
		addEntity: function (obj) {
			this.scene.addEntity(obj);
		},
		addBG: function (obj) {
			this.scene.addBG(obj);
		},
		add: function (obj) {
			this.scene.add(obj);
		}
	};

	var Scene = {
		init: function (name) {
			this.name = name;
			this.setupMap();
			this.entities = [];
			this.bg = [];
			this.buttons = [];
			this.selected = 0;
			this.completed = false;
			return this;
		},
		draw: function (ctx) {
			//ctx.fillStyle = "#f0e848";
			//ctx.fillRect(0,0,canvas.width,canvas.height);
			//console.log(this.bg.length);
			for (y in this.map) {
				for (x in this.map[y]) {
					if (this.map[y][x]) {
						this.map[y][x].draw(ctx);
					}
				}
			}
			var e = this.entities.sort(function (a, b) { return a.z != b.z ? a.z - b.z : (a.getPosition().y - a.offset.y) - (b.getPosition().y - b.offset.y); });
			for (var i = 0; i < e.length; i++) {
				e[i].draw(ctx);
			}
			for (var i = 0; i < this.buttons.length; i++) {
				this.buttons[i].draw(ctx);
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
				if (!this.entities[i] || !this.character) {}
				else if (this.character.gridX == this.entities[i].gridX && this.character.gridY == this.entities[i].gridY) {				
					if (this.entities[i].type == "collectable") {
						this.entities.splice(i,1);
					} else if (this.entities[i].type == "start") {
						if (this.entities.filter(function (a) { return a.type == "collectable"; }).length <= 0) {
							if (!this.completed) {
								this.completed = true;
								world.scenes[this.uid].completed = true;
								world.paused = true;
								var t = Object.create(Text).init(0,0,"Next...",{});
								var tb = Object.create(TextButton).init(canvas.width - 60, canvas.height - 40, t);
								var n = this.uid + 1;
								tb.callback = function () {
									world.doScene(n);
								};
								this.buttons.push(tb);

								//this.entities.push(Object.create(Exit).init((world.cs + 1) % world.scenes.length, conditions.space));
								//this.entities.push(Object.create(Text).init(297,360,"well done!  Press SPACE for next level.",{}));
							}
						}
					}
				}
			}

			/* check exit points for scene
			for (var i = 0; i < this.exits.length; i++) {
				this.exits[i].check();
			}*/
		},
		doMap: function (type, fn) {
			for (y in this.map) {
				for (x in this.map[y]) {
					if (this.map[y][x] && this.map[y][x].special == type) {
						this.map[y][x][fn]();
					}
				}
			}
		},
		button: function (x, y) {
			for (var i = 0; i < this.buttons.length; i++) {
				if (this.buttons[i].check(x, y)) {
					this.buttons[i].callback();
					return true;
				}
			}
			return false;
		},
		highlightButton: function (x, y) {
			for (var i = 0; i < this.buttons.length; i++) {
				this.buttons[i].highlight(this.buttons[i].check(x, y));
			}
		},
		getNeighbors: function (x, y) {
			var n = 0;
			for (var i = 0; i < directions.length; i++) {
				var d = DIRECTION[directions[i]];
				if (this.map[y + d.y]) {
					var m = this.map[Number(y) + d.y][Number(x) + d.x];
					if (!m) {}
					else if (m.type == "cell" || m.type == "obstacle"  || m.type == "platform") {
						n += 1;
					}
				}
			}
			return n;
		},
		spawnCells: function () {
			for (y in this.map) {
				for (x in this.map[y]) {
					if (this.map[y][x]) {}
					else {
						var n = this.getNeighbors(Number(x), Number(y));
						if (n == 2) {
							var cell = Object.create(Cell).init(x, y, Resources.cell);
							this.map[y][x] = cell;
							//this.addBG(cell);
						}
					}
				}
			}
		},
		setupMap: function () {
			this.map = {};
			for (var i = -2; i <= 2 + canvas.height / (2 * GLOBALS.height); i++) {
				var row = {};
				for (var j = -i; j <= canvas.width / (2 * GLOBALS.width); j++) {
					row[j] = undefined;
				}
				this.map[i] = row;
			}
		},
		getAt: function (x, y) {
			return this.map[y] ? this.map[y][x] : undefined;
		},
		remove: function (position, type) {
			if (this.map[position.y]) {
				var o = undefined;
				if (this.map[position.y][position.x]) {
					switch (this.map[position.y][position.x].special) {
						case "undertow":
							o = Object.create(UnderTow).init(position.x, position.y, Resources.undertow);
							break;
					}
				}
				if (type)
				{
					if (this.map[position.y][position.x] && this.map[position.y][position.x].type == type)
						this.map[position.y][position.x] = o;
				}
				else {
					this.map[position.y][position.x] = o;
				}
			}
		},
		removeEntity: function (e) {
			var i = this.entities.indexOf(e);
			this.entities.splice(i, 1);
		},
		removeBH: function (obj) {
			var i = this.entities.indexOf(e);
			this.bg.splice(i, 1);
		},
		nPlatforms: function () {
			var n = 0;
			for (y in this.map) {
				for (x in this.map[y]) {
					if (this.map[y][x] && this.map[y][x].type == "platform") {
						n += 1;
					}
				}
			}
			return n;
		},
		addPlatform: function (position, direction) {
			if (this.map[position.y]) {
				var m = this.map[position.y][position.x];
				if (m && (m.type == "obstacle" || m.type == "platform")) return;
				if (this.nPlatforms() >= this.max) return;
				else {
					var p = Object.create(Platform).init(position.x, position.y, Resources[direction], DIRECTION[direction]);
					if (m && m.callback) { p.onJump = m.callback; p.special = m.type; }
					this.map[position.y][position.x] = p;
				}
			}
		},
		addEntity: function (obj) {
			this.entities.push(obj);
		},
		addBG: function (obj) {
			this.bg.push(obj);
		},
		add: function (obj) {
			if (this.map[obj.gridY]) {
				var m = this.map[obj.gridY][obj.gridX];
				if (m && (m.type == "obstacle" || m.type == "platform")) return;
				else {
					this.map[obj.gridY][obj.gridX] = obj;
				}
			}
		},
		count: function (type) {
			var c = 0;
			for (y in this.map) {
				for (x in this.map[y]) {
					if (this.map[y][x] && this.map[y][x].type == type)
						c++;
				}
			}
			return c;
		}
	};

	var Entity = {
		opacity: 1.0,
		alive: true,
		frame: 0,
		z: 1,
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
			return {x: ox * GLOBALS.width * 2 + oy * GLOBALS.width + GLOBALS.border + this.offset.x,
				y: Math.sin(Math.PI / 3) * 2 * GLOBALS.height * oy + GLOBALS.border + this.offset.y, scale: j/2 + 1} 
		},
//		drawY: function () {  },
		draw: function (ctx) {
			ctx.globalAlpha = this.opacity;
			var o = this.getPosition();
			ctx.drawImage(this.sprite.image, 
        		this.frame * this.w / GLOBALS.scale, this.animation * this.h / GLOBALS.scale, 
        		this.w / GLOBALS.scale, this.h / GLOBALS.scale, 
        		Math.round(o.x - o.scale * this.w / 2), Math.ceil(o.y - o.scale * this.h / 2), o.scale * this.w, o.scale * this.h);
			ctx.globalAlpha = 1;
		},
		animate: function (dt) {
			this.frameDelay -= dt;
			if (this.frameDelay <= 0) {
				this.frameDelay = this.maxFrameDelay;
				this.frame = (this.frame + 1) % this.maxFrame;
			}
		},
		update: function (dt) {
			this.animate(dt);
		}
	};

	var Exit = Object.create(Entity);
	Exit.init = function (destination, condition) {
		this.destination = destination;
		this.condition = condition;
		return this;
	};
	Exit.update = function (dt) {
		if (this.condition()) {
			world.paused = true;
			world.doScene(this.destination);
			//debug = world.scene;
		}
	};
	Exit.draw = function (ctx) {
	};

	var Button = Object.create(Entity);
	Button.type = "button";
	Button.callback = function () {
		console.log("no button callback function defined");
	};
	Button.check = function (x, y) {
		var m = world.toGrid(x, y);
		if (this.gridX == m.x && this.gridY == m.y) return true;
	};
	Button.highlight = function (toggle) {
		if (toggle) this.frame = 1;
		else this.frame = 0;
	};

	var TextButton = Object.create(Button);
	TextButton.init = function (x, y, text) {
		this.x = x; this.y = y - 8; this.text = text;
		this.text.draw(ctx);
		this.text.x = x, this.text.y = y;
		this.w = ctx.measureText(this.text.text).width + 10, this.h = this.text.size + 4;
		return this;
	}
	TextButton.draw = function (ctx) {
		//ctx.fillStyle = "red";
		//ctx.fillRect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
		this.text.draw(ctx);
	};
	TextButton.check = function (x, y) {
		if (x > this.x - this.w / 2 && x < this.x + this.w / 2) {
			if (y > this.y - this.h / 2 && y < this.y + this.h / 2) {
				return true;
			}
		}
		return false;
	}
	TextButton.highlight = function (toggle) {
		if (toggle) this.text.color = "#CCCCCC";
		else this.text.color = "#000000";
	}

	var Platform = Object.create(Entity);
	Platform.type = "platform";
	Platform.distance = 2;
	Platform.onJump = function () {};

	var Obstacle = Object.create(Entity);
	Obstacle.type = "obstacle";
	Obstacle.spawned = false;
	Obstacle.update = function (dt) {
		this.animate(dt);
	}

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

	var Collectable = Object.create(Entity);
	Collectable.type = "collectable";
	Collectable.offset = {x: 0, y: -12};

	var Cell = Object.create(Entity);
	Cell.type = "cell";

	var Text = Object.create(Entity);
	Text.type = "text";
	Text.init = function (x, y, text, format, speed, delay) {
		this.x = x, this.y = y, this.text = text;
		this.size = format.size || 24;
		this.color = format.color || "black";
		this.align = format.align || "center";
		this.speed = speed ? speed : 0;
		this.current = speed ? 0 : text.length;
		this.counter = speed ? speed : 0;
		this.delay = delay ? delay : 0;
		return this;
	};
	Text.update = function (dt) {
		if (this.delay > 0) {
			this.delay -= dt;
			return;
		}
		if (this.counter > 0) {
			this.counter -= dt;
		} else {
			if (this.speed) this.current = Math.min(this.current + 1, this.text.length);
			this.counter = this.speed;
		}

	};
	Text.draw = function (ctx) {
		if (this.delay > 0) return;
		ctx.textAlign = this.align;
		ctx.fillStyle = this.color;
		ctx.font = this.size + "px Teko";
		ctx.fillText(this.text.substr(0,this.current), this.x, this.y);
	};

	var Character = Object.create(Entity);
	Character.offset = {x: 0, y: -12};
	Character.jumping = 0;
	Character.type = "character";
	Character.update = function (dt) {
		this.animate(dt);
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
				setTimeout(function () { world.reset(); }, 100);
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
					setTimeout(function () { world.reset(); }, 100);
				} else {
					this.direction = p.direction;
					this.distance = d;
					this.jumping = GLOBALS.jumpSpeed;
					this.animation = directions.indexOf(getDirectionName(this.direction));
					world.scene.doMap("undertow", "onJump");

					if (p.type == "hotspot") {
						p.onJump();
					}

					//this.animation = 
	//				setTimeout(function () { c.gridX += p.direction.x * d, c.gridY += p.direction.y * d; c.jumping = false;}, 500);
				}
			}
		}
	};

	/* GAME OBJECT INSTANCES */

	var world = Object.create(World).init();

/*
	document.addEventListener("keydown", function (e) {
		if (e.keyCode == 32) {
			world.keys.space = true;
			world.paused = !world.paused;			
		}
	});

	document.addEventListener("keyup", function (e) {
		if (e.keyCode == 32) {
			world.keys.space = false;
		}
	});
*/
	document.getElementById("save").addEventListener("click", function () {
		var js = world.save();
		document.getElementById("json").value = js;
	});

	document.getElementById("clearPlatforms").addEventListener("click", function () {
		var map = world.scene.map;
		for (y in map) {
			for (x in map[y]) {
				if (map[y][x] && map[y][x].type == "platform") {
					map[y][x] = undefined;
				}
			}
		}
	});

	document.getElementById("clearAll").addEventListener("click", function () {
		var map = world.scene.map;
		for (y in map) {
			for (x in map[y]) {
				map[y][x] = undefined;
			}
		}
	});

	document.addEventListener("visibilitychange", function () { world.time = new Date(); });
});