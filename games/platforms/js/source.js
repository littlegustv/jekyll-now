/**

bugs: new game, hotspot removes platform from score,

todo: 
in order to put off making puzzles:
- make some puzzles, why not?
- LOCK/UNLOCK levels/stages
- music, sound effects, cut scenes (?), art
touch controls, mobile optimization, kongregate api

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
	-> warning.  many of the specimen are loose.
	-> collectibles are 'specimen' -> they move each time you jump
**/

var debug;
var audioContext;

function modulo(n, p) {
	return (n % p + p) % p;
}

function playSound(buffer)
{
	var source = audioContext.createBufferSource();
	source.buffer = buffer;
	
	source.connect(audioContext.destination);
	source.start(0);
	
	return source;
}

window.addEventListener("DOMContentLoaded", function () {

	function mouseUp (e) {
		if (e.changedTouches) {
			e.offsetX = e.offsetX || e.changedTouches[0].clientX;
			e.offsetY = e.offsetY || e.changedTouches[0].clientY;
		}
		var m = world.toGrid(e.offsetX, e.offsetY);
		world.mouse.down = false;
		
		// check if button is at location

		if (world.scene.button(e.offsetX, e.offsetY)) { return; }
		
		// right click

		if (e.which === 3 || e.button === 2) {
			world.remove(m, "platform"); return;
		}

		// DEBUG BEHAVIOR

		var action = document.getElementById("action").value || "platform";
		switch (action) {
			case "platform":
				world.addPlatform();
				break;
			case "obstacle":
				var o = Object.create(Obstacle).init(m.x, m.y, Resources.obstacle);
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
				var c = Object.create(Collectable).init(m.x, m.y, Resources[world.scene.stage]);
				world.addEntity(c);
				break;
			case "specimen":
				var s = Object.create(Specimen).init(m.x, m.y, Resources[world.scene.stage]);
				s.direction = DIRECTION.east;
				world.addEntity(s);
				break;
		}
	}

	function mouseDown (e) {
		if (e.changedTouches) {
			e.offsetX = e.offsetX || e.changedTouches[0].clientX;
			e.offsetY = e.offsetY || e.changedTouches[0].clientY;
		}
		world.mouse.x = e.offsetX, world.mouse.y = e.offsetY;

		if (e.changedTouches) console.log("start", e);
		if (!world.scene || world.scene.type != "level") return;
		else world.mouse.down = true;
	}

	function mouseMove (e) {
		if (e.changedTouches) {
			e.offsetX = e.offsetX || e.changedTouches[0].clientX;
			e.offsetY = e.offsetY || e.changedTouches[0].clientY;
		}
		world.scene.highlightButton(e.offsetX, e.offsetY);
		if (!world.scene || world.scene.type != "level") return;
		var theta = Math.atan2(e.offsetY - world.mouse.y, e.offsetX - world.mouse.x);
		world.mouse.angle = modulo(Math.round(theta / (Math.PI / 3)), 6);
		if (!world.mouse.down) {
			world.mouse.x = e.offsetX, world.mouse.y = e.offsetY;
		}
	}

	var canvas = document.getElementById("mygame");
	var ctx = canvas.getContext("2d");

	audioContext = new AudioContext();

//	ctx.globalCompositeOperation = "multiply";
	//debug = ctx;

	ctx.imageSmoothingEnabled = false;
	ctx.mozImageSmoothingEnabled = false;
	ctx.webkitImageSmoothingEnabled = false;
	ctx.msImageSmoothingEnabled = false;

	var GLOBALS = {
		scale: 4,
		width: 18,
		height: 16,
		border: 24,
		jumpSpeed: 1000
	};

	var directions = ["east", "southeast", "southwest", "west", "northwest", "northeast", "none"];
	var STAGES = ["habitation", "hydroponics", "operations", "medical"];
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
		{path: "splash.png"},
		{path: "platform.png", frames: 2, speed: 1000},
		{path: "directions.png", frames: 2, speed: 1000, animations: 6},
		{path: "character.png", frames: 2, speed: 500, animations: 6},
		{path: "obstacle.png", frames: 2, speed: 1000},
		{path: "hotspot.png", frames: 2, speed: 500},
		{path: "undertow.png", frames: 4, speed: 800},
		{path: "unstable.png", frames: 4, speed: 300},
		{path: "scenes.js"},
		{path: "empty.png", frames: 2, speed: 1000},
		{path: "habitation.png", frames: 2, speed: 650, animations: 11},
		{path: "hydroponics.png", frames: 2, speed: 650, animations: 11},
		{path: "operations.png", frames: 2, speed: 650, animations: 11},
		{path: "medical.png", frames: 2, speed: 650, animations: 11},
		{path: "start.png", frames: 2, speed: 500},
		{path: "cell.png", frames: 5, speed: 1500},
		{path: "reset.png", frames: 2, speed: 500},
		{path: "back.png", frames: 2, speed: 500},
		{path: "play.png", frames: 2, speed: 500},
		{path: "menu.png", frames: 2, speed: 500},
		{path: "lock.png"},
		{path: "mute.png", frames: 2, speed: 500, animations: 2},
		{path: "blank.png"},
		{path: "temp.png", frames: 2, speed: 500, animations: 6},
		{path: "soundtrack.ogg"},
	/*	{path: "s_habitation.ogg"},
		{path: "s_hydroponics.ogg"},
		{path: "s_operations.ogg"},
		{path: "s_medical.ogg"},*/
		{path: "jump.ogg"},
		{path: "complete.ogg"},
		{path: "remove.ogg"},
		{path: "select.ogg"},
		{path: "fall.ogg"}
	];


/**			CLASS DEFINITIONS			**/

	var World = {
		stages: {
			habitation: 0,
			hydroponics: 0,
			operations: 0,
			medical: 0
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
					this.loadOGG(res, name);
					/*
					Resources[name] = {sound: new Audio("res/" + res, streaming=false)};
					w.progressBar();
					Resources[name].sound.onload = function () {
						console.log("loaded sound");
					}*/
				}
				else if (ext == ".js") {
					this.loadJSON(res, name);
				}
			}
		},
		loadOGG: function (res, name) {
			var w = this;
			var request = new XMLHttpRequest();
			request.open('GET', "res/" + res, true);
			request.responseType = 'arraybuffer';

			request.onload = function() {
				console.log("ogg", request);
				audioContext.decodeAudioData(request.response, function(b) {
					Resources[name] = {buffer: b, play: false};
					w.progressBar();
				}, function () {console.log("ERROR");});
			};
			request.send();
		},
		loadJSON: function (res, name) {
			var w = this;
			var request = new XMLHttpRequest();
			request.open("GET", "res/" + res, true);
			request.onload = function () {
				console.log("js", request);
				try {
					w.sceneInfo = JSON.parse(request.response);
					w.progressBar();
				}
				catch (e) {
					console.log("Error in JSON file load:", e);
				}
			};
			request.send();
		},
		progressBar: function () {
			this.resourceLoadCount += 1;
			if (this.resourceLoadCount >= this.resourceCount) {
				this.addEventListeners();
				this.begin();
			} else if (Resources.splash) {
				ctx.drawImage(Resources.splash.image, 0, 0, canvas.width, canvas.height);
			}
			ctx.fillStyle = "#f4f0e8";
			ctx.fillRect(GLOBALS.border * 0.75, canvas.height - GLOBALS.border * 2, 240, GLOBALS.border);
			ctx.fillStyle = "black";
			ctx.fillRect(GLOBALS.border * 0.75, canvas.height - GLOBALS.border * 2, 240 * this.resourceLoadCount / this.resourceCount, GLOBALS.border);
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
		setupStorage: function () {
			if(typeof(Storage) !== "undefined") {
			    return true;
			} else {
				console.log("storage not available, no saving possible");
				return false;
			}
		},
		save: function () {
			if (this.setupStorage()) {
				var saveData = {};
				for (var i = 0; i < this.scenes.length; i++) {
					if (this.scenes[i].score) {
						saveData[i] = this.scenes[i].score;
					}
				}
				saveData = JSON.stringify(saveData);
				localStorage.setItem("platformSaveData", saveData);
			}
		},
		load: function () {
			if (this.setupStorage()) {
				var loadData = localStorage.platformSaveData;
				if (loadData) {
					loadData = JSON.parse(loadData);
					for (i in loadData) {
						var n = Number(i);
						if (this.scenes[n]) {
							this.scenes[n].score = Number(loadData[i]);
						}
					}
				}
			}
		},
		loadBG: function () {
			this.bg = {};
			for (var i = -2; i <= 2 + canvas.height / (2 * GLOBALS.height); i++) {
				var row = {};
				for (var j = -i; j <= canvas.width / (2 * GLOBALS.width); j++) {
					var o = Object.create(Cell).init(j, i, Resources.cell);
					//o.blend = "overlay";
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
		stageUnlock: function () {
			for (var i = 0; i < this.scenes.length; i++) {
				if (this.scenes[i].max) {
					this.stages[this.scenes[i].stage] += this.scenes[i].max + 1000;
				}
			}
		},
		stageComplete: function (stage) {
			if (! this.stages[stage]) return true;
			for (var i = 0; i < this.scenes.length; i++) {
				if (this.scenes[i].stage == stage) {
					if (!this.scenes[i].score) return false;
				}
			}
			return true;
		},
		stageScore: function (stage) {
			var s = 0;
			for (var i = 0; i < this.scenes.length; i++) {
				if (STAGES.indexOf(this.scenes[i].stage) <= STAGES.indexOf(stage)) {
					s += this.scenes[i].score || 0;
				}
			}
			console.log(s);
			return s;
		},
		musicLoop: function () {
			//console.log(Resources["s_" + world.scene.stage].buffer, "s_" + world.scene.stage);
			world.soundtrack = playSound(Resources.soundtrack.buffer);
			world.soundtrack.onended = world.musicLoop;
			debug = world.soundtrack;
		},
		begin: function () {
			this.loadBG();
			this.scenes = this.sceneInfo.scenes, this.cs = 0;
			this.stageUnlock();
			this.scene = this.createScene(this.cs);

			this.paused = true;
			this.time = new Date();
			var w = this;
			this.musicLoop();
//			Resources.soundtrack.sound.play();
//			Resources.soundtrack.sound.volume = 0.5;
//			Resources.soundtrack.sound.onended = function () { Resources.soundtrack.sound.play(); };
//			debug = Resources.soundtrack.sound;
			this.step();
		},
		doScene: function (n) {
			this.scene = this.createScene(n);
			if (this.scene.type == "level") this.cs = n;
		},
		createScene: function (n) {
			var config = this.scenes[n];
			var s = Object.create(Scene).init(config.name);
			s.uid = n;
			s.type = config.type || "none";
			s.max = config.max || 0;
			s.stage = config.stage || "none";
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
						//start.blend = "hard-light";
						start.type = "start";
						s.entities.push(start);
						s.start = {x: start.gridX, y: start.gridY};
						e = Object.create(Character).init(c.gridX + 5, c.gridY - 10, Resources.character);
						e.jumping = GLOBALS.jumpSpeed;
						e.direction = {x: -1, y: 2};
						e.distance = 5;
						s.character = e;
						//debug = e;
						break;
					case "collectable":
						e = Object.create(Collectable).init(c.gridX, c.gridY, Resources[s.stage]);
						e.animation = s.uid % e.sprite.animations;
						//debug = e;
						break;
					case "specimen":
						e = Object.create(Specimen).init(c.gridX, c.gridY, Resources[s.stage]);
						e.animation = s.uid % e.sprite.animations;
						e.direction = DIRECTION.east;
						break;
				}
				if (e) s.entities.push(e);
			}
			for (var i = 0; i < config.map.length; i++) {
				var c = config.map[i];
				var m;
				switch(c.type) {
					case "obstacle":
						m = Object.create(Obstacle).init(c.gridX, c.gridY, Resources.obstacle);
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
				if (m) {
					if (!s.map[c.gridY]) s.map[c.gridY] = {};
					s.map[c.gridY][c.gridX] = m;
				}
			}
			if (s.type == "cutscene") {
				var t = Object.create(Text).init(0, 0, "<Continue>", {align: "center", size: 18});
				var skip = Object.create(TextButton).init(canvas.width / 2, canvas.height - 24, t);
				var n = s.uid + 1;
				skip.callback = function () { world.doScene(n) };
				s.buttons.push(skip);
			}
			if (s.type == "level") {
				console.log(s.name);
				// ADD LEVEL BUTTONS: reset, back, play
				var b = Object.create(Button).init( 0, 0, Resources.reset);
				b.callback = function () {
					world.reset();
				};
				s.buttons.push(b);
				var b = Object.create(Button).init( 11, 0, Resources.back);
				b.callback = function () {
					world.doScene(2);
				};
				s.buttons.push(b);
				var b = Object.create(Button).init( 1, 0, Resources.play);
				b.callback = function () {
					world.paused = !world.paused;
				};
				s.buttons.push(b);
				var t = Object.create(Text).init(canvas.width / 2, canvas.height - GLOBALS.height, s.name, {});
				s.addEntity(t);

				var p = Object.create(Platform).init(6, 0, Resources.platform);
				p.z = -1;
				s.addEntity(p);

				var t2 = Object.create(Text).init(canvas.width / 2 + GLOBALS.width * 1.5, GLOBALS.border + GLOBALS.height / 2, s.name, {align: "left"});
				s.addEntity(t2);
				s.par = t2;
			}
			if (s.name == "mainmenu") {
				var t = Object.create(Text).init(0, 0,"<New Game>",{});
				var tb = Object.create(TextButton).init(canvas.width / 2,canvas.height / 2 + 40,t);
				tb.callback = function () {
					world.doScene(3);
				};
				s.buttons.push(tb);
			
				var t = Object.create(Text).init(0, 0,"<Continue>",{});
				var tb = Object.create(TextButton).init(canvas.width / 2,canvas.height / 2 + 68,t);
				tb.callback = function () {
					world.load();
					world.doScene(2);
				};
				s.buttons.push(tb);

				var t = Object.create(Text).init(0, 0,"<Credits>",{});
				var tb = Object.create(TextButton).init(canvas.width / 2,canvas.height / 2 + 96,t);
				tb.callback = function () {
					world.doScene(1);
				};
				s.buttons.push(tb);
/*
				var e = Object.create(Entity).init(3,3,Resources.temp);
				e.animation = 0;
				s.entities.push(e);*/

				var mute = Object.create(Button).init(0, 0, Resources.mute);
				mute.animation = audioContext.state == "suspended" ? 1 : 0;
				mute.callback = function () {
					if (this.animation == 0) {
						audioContext.suspend();
						this.animation = 1;
					} else {
						audioContext.resume();
						this.animation = 0;
					}
				}
				s.buttons.push(mute);

			} else if (s.type != "cutscene") {
				var b = Object.create(Button).init(12, 0, Resources.menu);
				b.callback = function () {
					world.doScene(0);
				}
				s.buttons.push(b);
			}
			if (s.name == "credits") {
				var t = Object.create(Text).init(0, 0, "@littlegustv", {});
				var b = Object.create(TextButton).init(240, 136, t);
				b.callback = function () { window.open("http://www.twitter.com/littlegustv", "_blank"); };
				s.buttons.push(b);
				var t = Object.create(Text).init(0, 0, "littlegustv.github.io", {});
				var b = Object.create(TextButton).init(240, 162, t);
				b.callback = function () { window.open("https://littlegustv.github.io", "_blank"); };
				s.buttons.push(b);
			}
			else if (s.name == "stagemenu") {
				var y = GLOBALS.border + 32, j = 0;
				for (stage in this.stages) {
					var title = Object.create(Text).init(canvas.width / 2, y, stage, {color: "#000000", align: "center"});
					s.entities.push(title);
					var sc = STAGES[STAGES.indexOf(stage) - 1];
					var levels = this.scenes.filter(function (a) { return a.stage == stage && a.type == "level"; });
					for (var i = 0; i < levels.length; i++) {
						var w = this.scenes.indexOf(levels[i]);
						if (!sc || this.stageComplete(sc)) {
							var tb;
							if (!levels[i].score) {
								tb = Object.create(Button).init(i - j, 2 * j + 2, Resources.empty);
							} else {
								tb = Object.create(Button).init(i - j, 2 * j + 2, Resources[stage]);
								tb.animation = w % tb.sprite.animations;
							}
							tb.destination = w;
							tb.callback = function () {
								world.doScene(this.destination);
							};
							s.buttons.push(tb);
						}
						else {
							var lock = Object.create(Entity).init(i - j, 2 * j + 2, Resources.lock);
							s.entities.push(lock);
						}

					}
					j += 1;
					y += 56;
				}
			}
			return s;
		},
		toText: function () {
			var current = this.scene;
			var save = {name: "default", type: "level", stage: this.scene.stage, max: 20, map: [], entities: []};
			save.name = current.name;
			for (y in current.map) {
				for (x in current.map[y]) {
					if (current.map[y][x] != undefined && current.map[y][x].type != "platform") {
						save.map.push({gridX: Number(x), gridY: Number(y), type: current.map[y][x].type});
					}
				}
			}
			for (var i = 0; i < current.entities.length; i++) {
				if (current.entities[i].type != "start" && current.entities[i].type != "text" && current.entities[i].type != "platform") 
					save.entities.push({gridX: current.entities[i].gridX, gridY: current.entities[i].gridY, type: current.entities[i].type})
			}
			return JSON.stringify(save, null, '\t');
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

			//ctx.globalCompositeOperation = "overlay";
			//ctx.fillStyle = "#ff7607";
			//ctx.fillRect(0,0,canvas.width,canvas.height);
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
				for (var i = 0; i < this.scene.buttons.length; i++) {
					if (this.scene.buttons[i].check(this.mouse.x, this.mouse.y)) return;
				}
			
				if (p && (p.type == "obstacle" || p.type == "platform")) return;
				else {
					var dir = directions[this.mouse.angle];
					/*var mx = m.x * GLOBALS.width * 2 + m.y * GLOBALS.width + GLOBALS.border;
					var my = Math.sin(Math.PI / 3) * 2 * GLOBALS.height * m.y + GLOBALS.border - 8;
					var w = 9 * GLOBALS.scale, h = 9 * GLOBALS.scale;
			        ctx.drawImage(Resources.platform.image, 0, w / GLOBALS.scale, w / GLOBALS.scale, h / GLOBALS.scale, mx - Math.round(w / 2), Math.ceil(my - h / 2), w, h);
			        ctx.drawImage(Resources.directions.image, 0, this.mouse.angle * h / GLOBALS.scale, w / GLOBALS.scale, h / GLOBALS.scale, mx - Math.round(w / 2), Math.ceil(my - h / 2), w, h);
			        ctx.globalAlpha = 1.0;*/
			        var cursor = Object.create(Platform).init(m.x, m.y, Resources.platform);
			        cursor.direction = DIRECTION[directions[this.mouse.angle]];
			        cursor.opacity = 0.5;
			        cursor.draw(ctx);
			        var d1 = Object.create(Entity).init(m.x + cursor.direction.x, m.y + cursor.direction.y, Resources.blank);
			        d1.draw(ctx);
					var d2 = Object.create(Entity).init(m.x + 2 * cursor.direction.x, m.y + 2 * cursor.direction.y, Resources.blank);
			        d2.draw(ctx);			       
		    	}
			}
			/*
			if (this.scene.start) {
				ctx.font = "24px VT323";
				ctx.textAlign = "center";
				ctx.fillStyle = "black";
				var mx = modulo(m.x - this.scene.start.x, 2);
				var my = modulo(m.y - this.scene.start.y, 2);
				ctx.fillText(mx + ", " + my, this.mouse.x, this.mouse.y);
			}*/
		},
		addPlatform: function () {
			var m = this.toGrid(this.mouse.x, this.mouse.y);
			console.log(this.mouse.x, this.mouse.y);
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
			this.score;
			return this;
		},
		draw: function (ctx) {
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
					if (this.entities[i].type == "start") {
						if (this.entities.filter(function (a) { return a.type == "collectable"; }).length <= 0) {
							if (!this.completed) {
								playSound(Resources.complete.buffer);
								this.completed = true;
								this.character.animation = 1, this.character.frame = 0;
								world.scenes[this.uid].score = world.scene.count("platform");
								world.paused = true;
								var t = Object.create(Text).init(0,0,"<Next>",{size: 60});
								var tb = Object.create(TextButton).init(canvas.width / 2, canvas.height / 2, t);
								var n = this.uid + 1;
								tb.callback = function () {
									world.doScene(n);
								};
								this.buttons.push(tb);
								world.save();
							}
						}
					}
				}
			}
			if (this.type == "level") {
				this.par.text = "x" + String(this.max - this.count("platform"));
			}
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
					playSound(Resources.select.buffer);
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
		getEntitiesAt: function (x, y) {
			var e = [];
			for (var i = 0; i < this.entities.length; i++) {
				if (this.entities[i].gridX == x && this.entities[i].gridY == y) {
					e.push(this.entities[i]);
				}
			}
			return e;
		},
		getAt: function (x, y) {
			return this.map[y] ? this.map[y][x] : undefined;
		},
		remove: function (position, type) {
			if (this.map[position.y]) {
				var o = undefined;
				if (this.map[position.y][position.x]) {
					// re-add removed platform's underlying characteristic... thing
					switch (this.map[position.y][position.x].special) {
						case "undertow":
							o = Object.create(UnderTow).init(position.x, position.y, Resources.undertow);
							break;
						case "hotspot":
							o = Object.create(HotSpot).init(position.x, position.y, Resources.hotspot);
							break;
					}
				}
				if (type)
				{
					playSound(Resources.remove.buffer);
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
		addPlatform: function (position, direction) {
			if (this.map[position.y]) {
				var m = this.map[position.y][position.x];
				if (this.type != "level") return;
				if (m && (m.type == "obstacle" || m.type == "platform")) return;
				//if (this.count("platform") >= this.max) return;
				else {
					playSound(Resources.select.buffer);
					var p = Object.create(Platform).init(position.x, position.y, Resources.platform, DIRECTION[direction]);
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

/**		DEFAULT GAME OBJECT, draw, update, animate methods		**/

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
		draw: function (ctx) {
			ctx.globalAlpha = this.opacity;
			ctx.globalCompositeOperation = this.blend || "normal";
			var o = this.getPosition();
			ctx.drawImage(this.sprite.image, 
        		this.frame * this.w / GLOBALS.scale, this.animation * this.h / GLOBALS.scale, 
        		this.w / GLOBALS.scale, this.h / GLOBALS.scale, 
        		Math.round(o.x - o.scale * this.w / 2), Math.ceil(o.y - o.scale * this.h / 2), Math.round(o.scale * this.w), Math.round(o.scale * this.h));
			ctx.globalAlpha = 1;
			ctx.globalCompositeOperation = "normal";

			if (this.special) {
				ctx.drawImage(Resources[this.special].image, 
    	    		this.frame * this.w / GLOBALS.scale, this.animation * this.h / GLOBALS.scale, 
        			this.w / GLOBALS.scale, this.h / GLOBALS.scale, 
        			Math.round(o.x - o.scale * this.w / 2), Math.ceil(o.y - o.scale * this.h / 2), o.scale * this.w, o.scale * this.h);				
			}

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
		// uncomment to show hitbox
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
		if (toggle) this.text.color = "#f4f0e8";
		else this.text.color = "#18140c";
	}

	var Platform = Object.create(Entity);
	Platform.type = "platform";
	Platform.distance = 2;
	Platform.onJump = function () {};
	Platform.draw = function (ctx) {
		var o = this.getPosition();
		ctx.drawImage(this.sprite.image, 
    		this.frame * this.w / GLOBALS.scale, this.animation * this.h / GLOBALS.scale, 
    		this.w / GLOBALS.scale, this.h / GLOBALS.scale, 
    		Math.round(o.x - o.scale * this.w / 2), Math.ceil(o.y - o.scale * this.h / 2), Math.round(o.scale * this.w), Math.round(o.scale * this.h));
		ctx.drawImage(Resources.directions.image,
    		this.frame * this.w / GLOBALS.scale,  directions.indexOf(getDirectionName(this.direction)) * this.h / GLOBALS.scale, 
    		this.w / GLOBALS.scale, this.h / GLOBALS.scale, 
    		Math.round(o.x - o.scale * this.w / 2), Math.ceil(o.y - o.scale * this.h / 2), Math.round(o.scale * this.w), Math.round(o.scale * this.h));		
		if (this.special) {
			ctx.drawImage(Resources[this.special].image, 
	    		this.frame * this.w / GLOBALS.scale, this.animation * this.h / GLOBALS.scale, 
    			this.w / GLOBALS.scale, this.h / GLOBALS.scale, 
    			Math.round(o.x - o.scale * this.w / 2), Math.ceil(o.y - o.scale * this.h / 2), o.scale * this.w, o.scale * this.h);				
		}
	};

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
		//this.sprite = Resources[directions[d]];
	}

	var HotSpot = Object.create(Environment);
	HotSpot.type = "hotspot";
	HotSpot.callback = function () {
		world.remove({x: this.gridX, y: this.gridY});
		var o = Object.create(Obstacle).init(this.gridX, this.gridY, Resources.obstacle);
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
		this.color = format.color || "#18140c";
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
		ctx.font = "900 " + this.size + "px VT323";
		ctx.fillText(this.text.substr(0,this.current), this.x, this.y);
	};

	var Character = Object.create(Entity);
	Character.offset = {x: 0, y: -16};
	Character.jumping = 0;
	Character.type = "character";
	Character.fall = function () {
		this.jumping = GLOBALS.jumpSpeed;
		playSound(Resources.fall.buffer);
     	canvas.style.webkitFilter = "invert(100%)";
		setTimeout(function () { 
   			canvas.style.webkitFilter = "invert(0%)";
			world.reset(); 
		}, 100);
	}
	Character.update = function (dt) {
		if (world.paused) return;
		this.animate(dt);
		if (this.jumping > 0) {
			this.jumping -= dt;
		}
		if (this.jumping <= 0) {
			this.gridX += this.distance * this.direction.x;
			this.gridY += this.distance * this.direction.y;
			this.distance = 0;
			this.direction = DIRECTION.none;

			// get entity, if collectable

			var e = world.scene.entities;

			for (var i = 0; i < e.length; i++) {
				var ep = e[i].getPosition(), tp = this.getPosition();
				if (e[i].type == "collectable") { 
					if (Math.abs(ep.x - tp.x) < 10 && Math.abs(ep.y - tp.y) < 10) {
						world.removeEntity(e[i]);
					}
				}
			}

			var p = world.getAt(this.gridX, this.gridY);
			if (!p || p.type == "obstacle") { 
				this.fall();
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
					this.fall();
				} else {
					playSound(Resources.jump.buffer);
					this.direction = p.direction;
					this.distance = d;
					this.jumping = GLOBALS.jumpSpeed;
					this.animation = directions.indexOf(getDirectionName(this.direction));
					world.scene.doMap("undertow", "onJump");

					if (p.special == "hotspot") {
						p.onJump();
					}
				}
			}
		}
	};

	var Specimen = Object.create(Character);
	Specimen.type = "collectable";
	Specimen.jumping = GLOBALS.jumpSpeed;
	Specimen.distance = 2;
	Specimen.update = function (dt) {
		this.animate(dt);
		if (world.paused) return;
		if (this.jumping > 0) {
			this.jumping -= dt;
		}
		if (this.jumping <= 0) {
			this.jumping = GLOBALS.jumpSpeed;
			this.gridX += this.distance * this.direction.x;
			this.gridY += this.distance * this.direction.y;
			var d = (directions.indexOf(getDirectionName(this.direction)) + 2) % 6;
			this.direction = DIRECTION[directions[d]];
		}
	}
/** 		GAME OBJECT INSTANCES 			**/

	var world = Object.create(World).init();

/**			DEBUG EVENT LISTENERS 			**/

	document.getElementById("save").addEventListener("click", function () {
		var js = world.toText();
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

	document.addEventListener("visibilitychange", function (e) { 
		if (document.visibilityState == "hidden") {
			audioContext.suspend();
		}
		else {
			audioContext.resume();
		}
		world.time = new Date(); 
	});

});