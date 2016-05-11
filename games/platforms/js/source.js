
var debug;
var audioContext;
var scale = 1;
var fontFamily = "Frijole"

var AudioContext = window.AudioContext || window.webkitAudioContext;
if (AudioContext) AudioContext.createGain = AudioContext.createGain || AudioContext.createGainNode;

var service, tracker;
if (analytics && chrome.runtime.getManifest) {
	service = analytics.getService('platforms');
  tracker = service.getTracker('UA-65874667-3');
  tracker.sendAppView('MainView');
  service.getConfig().addCallback(
    /** @param {!analytics.Config} config */
    function(config) {
    	console.log('hey!');
      var permitted = myApp.askUser('Allow anonymous usage tracking?');
      config.setTrackingPermitted(permitted);
      // If "permitted" is false the library will automatically stop
      // sending information to Google Analytics and will persist this
      // behavior automatically.
    });
  // Supply your GA Tracking ID.
}

function resizeCanvas(canvas) {
	canvas.style.width = "", canvas.style.height = "";
	var ratio = canvas.width / canvas.height;
	// wider
  if (window.innerWidth / window.innerHeight > ratio)
  {
    canvas.style.height = window.innerHeight + "px";
    scale = window.innerHeight / canvas.height;
  } else {
  	canvas.style.width = window.innerWidth + "px";
  	scale = window.innerWidth / canvas.width;
  }
}

function modulo(n, p) {
	return (n % p + p) % p;
}

function playSound(sound)
{
	if (AudioContext) {

		var buffer = sound.buffer;
		var source = audioContext.createBufferSource();
		source.buffer = buffer;
		
		source.connect(audioContext.gn);
		audioContext.gn.connect(audioContext.destination);
		source.start(0);
		
		return source;
	} else {
		if (window.muted) {
			return;
		}
		else {
			sound.play();
			debug = sound;
			return sound;
		}
	}
}

window.addEventListener("DOMContentLoaded", function () {

	function mouseUp (e) {
		if (e.changedTouches) {
			e.offsetX = e.offsetX || e.changedTouches[0].clientX;
			e.offsetY = e.offsetY || e.changedTouches[0].clientY;
		}
		else {
			e.offsetX = e.offsetX || e.clientX;//e.changedTouches[0].clientX;
			e.offsetY = e.offsetY || e.clientY;//e.changedTouches[0].clientY;
		}
		var offsetX = e.offsetX / scale, offsetY = e.offsetY / scale;
		var m = world.toGrid(offsetX, offsetY);
		world.mouse.down = false;
		
		// check if button is at location

		if (world.scene.button(offsetX, offsetY, world.mouse.x, world.mouse.y)) { return; }
		
		if (!world.paused) return;

		// right click
		if (e.which === 3 || e.button === 2) {
			
			if (world.remove(m, "platform")) { 
				playSound(Resources.remove);
				return;
			}
		}

		// DEBUG BEHAVIOR

		var action = document.getElementById("action").value || "platform";
		world.create(m, action);
	}

	function mouseDown (e) {
		if (e.changedTouches) {
			e.offsetX = e.offsetX || e.changedTouches[0].clientX;
			e.offsetY = e.offsetY || e.changedTouches[0].clientY;
		}
		else {
			e.offsetX = e.offsetX || e.clientX;//e.changedTouches[0].clientX;
			e.offsetY = e.offsetY || e.clientY;//e.changedTouches[0].clientY;
		}
		var offsetX = e.offsetX / scale, offsetY = e.offsetY / scale;
		var m = world.toGrid(offsetX, offsetY);
		
		world.mouse.x = offsetX, world.mouse.y = offsetY;

		if (e.which !== 3 && e.button !== 2) {
			world.remove(m, "platform");
		}

		if (!world.scene || world.scene.type != "level") return;
		else if (e.which === 3 || e.button === 2) {}
		else world.mouse.down = true;
	}

	function mouseMove (e) {
		if (e.changedTouches) {
			e.offsetX = e.offsetX || e.changedTouches[0].clientX;
			e.offsetY = e.offsetY || e.changedTouches[0].clientY;
		}
		else {
			e.offsetX = e.offsetX || e.clientX;//e.changedTouches[0].clientX;
			e.offsetY = e.offsetY || e.clientY;//e.changedTouches[0].clientY;
		}
		var offsetX = e.offsetX / scale, offsetY = e.offsetY / scale;
		world.scene.highlightButton(offsetX, offsetY);
		if (!world.scene || world.scene.type != "level") return;
		var theta = Math.atan2(offsetY - world.mouse.y, offsetX - world.mouse.x);
		world.mouse.angle = world.cs > 5 ? modulo(Math.round(theta / (Math.PI / 3)), 6) : 0;
		if (!world.mouse.down) {
			world.mouse.x = offsetX, world.mouse.y = offsetY;
		}
	}

	var canvas = document.getElementById("mygame");
	var ctx = canvas.getContext("2d");

	resizeCanvas(canvas);
	window.addEventListener('resize', function () { resizeCanvas(canvas); });

	if (AudioContext) {
		audioContext = new AudioContext();
		audioContext.gn = audioContext.createGain();
	}
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
		//{path: "splash.png"},
		{path: "platform.png", frames: 2, speed: 1000},
		{path: "directions.png", frames: 2, speed: 1000, animations: 6},
		{path: "character.png", frames: 2, speed: 500, animations: 8},
		{path: "obstacle.png", frames: 2, speed: 1000},
		{path: "hotspot.png", frames: 2, speed: 500},
		{path: "highlight.png", frames: 2, speed: 400},
		{path: "undertow.png", frames: 5, speed: 200},
		{path: "unstable.png", frames: 4, speed: 300},
		{path: "scenes.js"},
		{path: "empty.png", frames: 2, speed: 1000},
		{path: "tutorial.png", frames: 2, speed: 650, animations: 1},
		{path: "habitation.png", frames: 2, speed: 650, animations: 11},
		{path: "hydroponics.png", frames: 2, speed: 650, animations: 11},
		{path: "operations.png", frames: 2, speed: 650, animations: 11},
		{path: "medical.png", frames: 2, speed: 650, animations: 11},
		{path: "start.png", frames: 2, speed: 500},
		{path: "cell.png", frames: 5, speed: 1500},
		{path: "reset.png", frames: 2, speed: 500},
		{path: "back.png", frames: 2, speed: 500},
		{path: "help.png", frames: 2, speed: 500},
		{path: "play.png", frames: 2, speed: 500},
		{path: "menu.png", frames: 2, speed: 500},
		{path: "lock.png"},
		{path: "blocked.png"},
		{path: "mute.png", frames: 2, speed: 500, animations: 2},
		{path: "cursor.png", frames: 2, speed: 500, animations: 6},
		{path: "temp.png", frames: 2, speed: 500, animations: 6},
		{path: "soundtrack.ogg"},
		{path: "soundtrackFast.ogg"},
		{path: "jump.ogg"},
		{path: "complete.ogg"},
		{path: "remove.ogg"},
		{path: "select.ogg"},
		{path: "collect.ogg"},
		{path: "fall.ogg"}
	];


/**			CLASS DEFINITIONS			**/

	var World = {
		speed: 0,
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
			this.last = {};
			return this;
		},
		loadResources: function () {
			this.resourceLoadCount = 0;
			this.resourceCount = resourceInfo.length;
			var w = this;

			var a = new Audio();
			this.audioType = a.canPlayType("audio/ogg");
			//console.log(this.audioType, a.canPlayType("audio/mp3"), "AUDIO");

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
			// cant play ogg, load mp3
			if (name == "soundtrack" || name == "soundtrackFast") {
				this.progressBar();
			}
			if (this.audioType.length <= 0) {
				res = res.replace("ogg", "mp3");
				//console.log("replaced?");
			}
			//console.log("NEW", res);
			var w = this;
			if (!AudioContext) {
				Resources[name] = new Audio("res/" + res, streaming=false);
				//Resources[name].src = "res/" + res;
				w.progressBar();
				return;
			}
			var request = new XMLHttpRequest();
			request.open('GET', "res/" + res, true);
			request.responseType = 'arraybuffer';

			request.onload = function() {
				audioContext.decodeAudioData(request.response, function(b) {
					Resources[name] = {buffer: b, play: false};
					if (name == "soundtrack" || name == "soundtrackFast") {
						if (AudioContext && Resources.soundtrack && name == "soundtrack") w.musicLoop();
					} else {
						w.progressBar();
					}
				}, function () {console.log("ERROR with decoding audio");});
			};
			request.send();
		},
		loadJSON: function (res, name) {
			var w = this;
			var request = new XMLHttpRequest();
			request.open("GET", "res/" + res, true);
			request.onload = function () {
				//console.log("js", request);
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
			ctx.clearRect(0,0,canvas.width,canvas.height);
			this.resourceLoadCount += 1;
			if (this.resourceLoadCount >= this.resourceCount) {
				this.addEventListeners();
				this.begin();
			}
			//ctx.fillStyle = "#f4f0e8";
			//ctx.fillRect(GLOBALS.border * 0.75, canvas.height - GLOBALS.border * 2, 240, GLOBALS.border);
			ctx.fillStyle = "black";
			ctx.fillRect(0, 0, canvas.width * this.resourceLoadCount / this.resourceCount, canvas.height);
			ctx.fillStyle = "white";
			ctx.font = "900 64px " + fontFamily;
			ctx.textAlign = "center";
			ctx.fillText("loading...", canvas.width / 2, canvas.height / 2);
		},
		reset: function () {
			var i = this.cs;
			this.paused = true;
			this.scene = this.createScene(i);
		},
		create: function (m, action) {
			switch (action) {
				case "platform":
					this.addPlatform(m);
					break;
				case "obstacle":
					var o = Object.create(Obstacle).init(m.x, m.y, Resources.obstacle);
					this.add(o);
					break;
				case "hotspot":
					var o = Object.create(HotSpot).init(m.x, m.y, Resources.hotspot);
					this.add(o);
					break;
				case "undertow":
					var o = Object.create(UnderTow).init(m.x, m.y, Resources.undertow);
					this.add(o);
					break;
				case "unstable":
					var o = Object.create(Unstable).init(m.x, m.y, Resources.unstable);
					this.add(o);
					break;
				case "remove":
					this.remove(m);
					break;
				case "collectable":
					var c = Object.create(Collectable).init(m.x, m.y, Resources[this.scene.stage]);
					this.addEntity(c);
					break;
				case "specimen":
					var m = this.toGrid(this.mouse.x, this.mouse.y);
					var s = Object.create(Specimen).init(m.x, m.y, Resources[this.scene.stage]);
					s.direction = DIRECTION[directions[this.mouse.angle] || "east"];
					//console.log(s.direction, directions[this.mouse.angle], this.mouse);
					this.addEntity(s);
					break;
			}
		},
		undo: function () {
			if (!this.paused || this.scene.completed) return;
			if (this.last && this.last.action) {
				switch (this.last.action) {
					case "add":
						this.remove({x: this.last.x, y: this.last.y}, this.last.type);
						break;
					case "remove":
						//this.mouse.x = this.last.x, this.mouse.y = this.last.y, this.mouse.angle = this.last.direction;
						this.create({x: this.last.x, y: this.last.y, direction: this.last.direction}, this.last.type);
						break;
				}
			}
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
		clear: function () {
			for (var i = 0; i < this.scenes.length; i++) {
				this.scenes[i].score = undefined;
				this.scenes[i].completed = false;
			}
		},
		save: function () {
			console.log("saving");
			if (this.setupStorage()) {
				var saveData = {};
				for (var i = 0; i < this.scenes.length; i++) {
					if (this.scenes[i].score) {
						saveData[i] = this.scenes[i].score;
					}
				}
				saveData = JSON.stringify(saveData);
				if (chrome && chrome.storage) {
					chrome.storage.local.set({"platformSaveData": saveData});
				} else {
					localStorage.setItem("platformSaveData", saveData);
				}
			}
			this.newGame = false;
		},
		load: function () {
			this.newGame = true;
			if (this.setupStorage()) {
				if (chrome && chrome.storage) {
					var t = this;
					chrome.storage.local.get('platformSaveData', function (r) { 
						t.loadData(r);
					});
				} else {
					//var loadData = localStorage.platformSaveData;
					this.loadData(localStorage);
				}
				//console.log("here...", loadData);
			}
		},
		loadData: function (data) {
			data = data.platformSaveData // FIX ME!
			if (data) {
				data = JSON.parse(data);
				for (i in data) {
					var n = Number(i);
					if (this.scenes[n]) {
						this.scenes[n].score = Number(data[i]);
					}
				}
				this.newGame = false;
			}
			this.ready = true;
		},
		loadBG: function () {
			
			this.bg = {};
			for (var i = -2; i <= 2 + canvas.height / (2 * GLOBALS.height); i++) {
				var row = {};
				for (var j = -i; j <= canvas.width / (2 * GLOBALS.width); j++) {
					var o = Object.create(Cell).init(j, i, Resources.cell);
					//o.blend = "overlay";
					o.frame = Math.floor(Math.random() * Resources.cell.frames);
					o.maxFrameDelay = Math.floor(Math.random() * 4) * 500 + 2000;
					o.frameDelay = Math.floor(Math.random() * 4) * 250;//row[j].maxFrameDelay;
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
				if (this.scenes[i].max && this.stages[this.scenes[i].stage] !== undefined) {
					this.stages[this.scenes[i].stage] += this.scenes[i].max + 1000;
				}
			}
		},
		stageComplete: function (stage) {
			if (! this.stages[stage]) return true;
			for (var i = 0; i < this.scenes.length; i++) {
				if (this.scenes[i].stage == stage && this.scenes[i].type == "level") {
					if (!this.scenes[i].score) return false;
				}
			}
			return true;
		},
		stageScore: function (stage) {
			var s = 0;
			for (var i = 0; i < this.scenes.length; i++) {
				if (STAGES.indexOf(this.scenes[i].stage) == -1) { 
					//console.log(this.scenes[i].stage, "mm")
				}
				else if (STAGES.indexOf(this.scenes[i].stage) <= STAGES.indexOf(stage)) {
					s += this.scenes[i].score || 0;
				}
			}
			return s;
		},
		musicLoop: function () {
			//console.log(Resources["s_" + world.scene.stage].buffer, "s_" + world.scene.stage);
			if (world.speed <= 2) {
				world.soundtrack = playSound(Resources.soundtrack);
			}
			else {
				world.speed -= 2;
				world.soundtrack = playSound(Resources.soundtrackFast);
			}
			world.soundtrack.onended = world.musicLoop;
//			debug = world.soundtrack;
		},
		begin: function () {
			this.loadBG();
			this.scenes = this.sceneInfo.scenes, this.cs = 0;
			this.stageUnlock();
			this.load();
			var t = this;
			var s = setInterval(function () {
				if (t.ready) {
					t.readyNow();
					window.clearInterval(s);
				}
			}, 100);
		},
		readyNow: function () {
			this.scene = this.createScene(this.cs);

			this.paused = true;
			this.time = new Date();
			var w = this;
			
//			Resources.soundtrack.sound.play();
//			Resources.soundtrack.sound.volume = 0.5;
//			Resources.soundtrack.sound.onended = function () { Resources.soundtrack.sound.play(); };
//			debug = Resources.soundtrack.sound;
			this.step();
		},
		doScene: function (n) {
			this.paused = true;
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
				var e = undefined;
				//console.log(c.type);
				switch (c.type) {
					case "box":
						e = Object.create(Box).init(c.format, c.border, {counter: 0, maxCount: 1000, type: "fade"});
						for (var j = 0; j < c.contents.length; j++) {
							var co = c.contents[j];
							//console.log(co, "blah", co.type);
							if (co.type == "text") {
								var t = Object.create(Text).init(co.gridX + e.x, co.gridY + e.y, co.text, co.format, co.speed, co.delay + e.delay, co.duration);
								e.contents.push(t);
							} else if (co.type == "textblock") {
								var lines = co.text.split("\n");
								//console.log(lines);
								var start = {x: co.gridX + e.x, y: co.gridY + e.y};
								co.speed = co.speed || 0;
								co.pause = co.pause || 0;
								var delay = 0 + e.delay;
								for (var k = 0; k < lines.length; k++) {
									var t = Object.create(Text).init(start.x, start.y, lines[k], co.format, co.speed, delay, co.duration);
									delay += co.speed * (lines[k].length) + co.pause;
									//console.log("delayt", delay);
									e.contents.push(t);
									start.y += co.format.size + 4;
								}
							} else {
								//console.log(co.type, Resources[co.type], co.animation);
								var t = Object.create(Entity).init(co.gridX, co.gridY, Resources[co.type]);
								t.animation = co.animation != undefined ? co.animation : 0;
								t.offset = {x: e.x, y: e.y};
								e.contents.push(t);
							}
						}
						break;
					case "textblock":
						var lines = c.text.split("\n");
						var start = {x: c.gridX, y: c.gridY};
						var delay = 0;
						for (var j = 0; j < lines.length; j++) {
							var t = Object.create(Text).init(start.x, start.y, lines[j], c.format, c.speed, delay, c.duration);
							delay += c.speed * (lines[j].length) + c.pause;
							s.entities.push(t);
							start.y += c.format.size + 4;
						}
						break;
					case "text":
						e = Object.create(Text).init(c.gridX, c.gridY, c.text, c.format, c.speed, c.delay, c.duration);
						e.z = -10;
						break;
					case "character":
						var start = Object.create(Entity).init(c.gridX, c.gridY, Resources.start);
						start.opacity = 0.65;
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
						s.total += 1;

						//debug = e;
						break;
					case "specimen":
						e = Object.create(Specimen).init(c.gridX, c.gridY, Resources[s.stage]);
						e.animation = s.uid % e.sprite.animations;
						e.direction = DIRECTION[c.direction || "east"];
						//console.log(e.direction);
						break;
					case "highlight":
						e = Object.create(Entity).init(c.gridX, c.gridY, Resources.highlight);
						break;
				}
				if (e) {s.entities.push(e);}
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
					case "platform":
						m  = Object.create(Platform).init(c.gridX, c.gridY, Resources.platform);
						m.direction = DIRECTION[c.direction];
						break;
					case "highlight":
						m = Object.create(Entity).init(c.gridX, c.gridY, Resources.highlight);
						break;
				}
				if (m) {
					if (!s.map[c.gridY]) s.map[c.gridY] = {};
					s.map[c.gridY][c.gridX] = m;
				}
			}
			if (s.type == "cutscene") {
				var t = Object.create(Text).init(0, 0, "<Continue>", {align: "center", size: 18});
				var skip = Object.create(TextButton).init(canvas.width / 2, canvas.height - 8, t);
				var n = (s.uid + 1) % world.scenes.length;
				skip.callback = function () { world.doScene(n) };
				s.buttons.push(skip);
			}
			if (s.type == "level") {

				// ADD LEVEL BUTTONS: reset, back, play
				//var b = Object.create(Button).init( 1, 0, Resources.reset);
				//b.name = "retry";
				//b.offset = {x: 0, y: -8};
				var t_reset = Object.create(Text).init(0,0,"retry", {size: 14, align: "left"});
				var b = Object.create(TextButton).init(10, 38, t_reset);
				b.callback = function () {
					world.reset();
				};
				s.buttons.push(b);

				//var b = Object.create(Button).init( 11, 0, Resources.help);
				//b.name = "walkthrough";
				//b.offset = {x: 0, y: -8};
				if (config.walkthrough) {
					var t_walkthrough = Object.create(Text).init(0,0,"solution", {size: 14, align: "right"});
					var b = Object.create(TextButton).init(470, 38, t_walkthrough);
					b.target = config.walkthrough || "http://www.youtube.com";
					b.callback = function () {
						window.open(this.target, "_blank");
					};
					s.buttons.push(b);
				}

//				var b = Object.create(Button).init( 2, 0, Resources.back);
//				b.name = "undo";
//				b.offset = {x: 0, y: -8};
				var t_undo = Object.create(Text).init(0,0,"undo", {size: 14, align: "left"});
				var b = Object.create(TextButton).init(10, 20, t_undo);
				b.callback = function () {
					world.undo();
				};
				s.buttons.push(b);

				var t_run = Object.create(Text).init(0,0,"run", {size: 14, align: "left"});
				var b = Object.create(TextButton).init(10, 56, t_run);
	//			var b = Object.create(Button).init( 0, 0, Resources.play);
	//			b.name = "run";
	//			b.offset = {x: 0, y: -8};
				b.callback = function () {
					world.paused = false;
					world.scene.platformsUsed = world.scene.count("platform");
				};
				s.buttons.push(b);
				var t = Object.create(Text).init(canvas.width / 2, canvas.height - GLOBALS.height / 2, s.name, {size: 18});
				s.addEntity(t);

				var t2 = Object.create(Text).init(canvas.width / 2, GLOBALS.border, s.name, {align: "center", size: 18});
				s.addEntity(t2);
				s.par = t2;
			}
			if (s.name == "endscene") {

			}
			if (s.name == "mainmenu") {

				var t = Object.create(Text).init(canvas.width / 2,canvas.height / 2 + 16,"Continue", world.newGame ? {color: "#333333"}:{} );
				if (!world.newGame) {
					world.load();
					var tb = Object.create(TextButton).init(canvas.width / 2,canvas.height / 2 + 22,t);
					tb.callback = function () {
						world.doScene(2);
					};
					s.buttons.push(tb);
				} else {
					s.entities.push(t);
				}
			
				var t = Object.create(Text).init(0, 0,"New Game",{});
				var tb = Object.create(TextButton).init(canvas.width / 2, canvas.height / 2 + 66,t);
				tb.callback = function () {
					world.clear();
					world.doScene(3);
				};
				s.buttons.push(tb);

				var t = Object.create(Text).init(0, 0,"Credits",{});
				var tb = Object.create(TextButton).init(canvas.width / 2,canvas.height / 2 + 110,t);
				tb.callback = function () {
					world.doScene(1);
				};
				s.buttons.push(tb);
				//console.log(tb.x, tb.gridX);
/*
				var e = Object.create(Entity).init(3,3,Resources.temp);
				e.animation = 0;
				s.entities.push(e);*/
				var t_mute = Object.create(Text).init(0,0,"mute", {size: 14, align: "right"});
				var mute = Object.create(TextButton).init(470, 20, t_mute);
				//var mute = Object.create(Button).init(12, 0, Resources.mute);
				//mute.name = "mute";
				if (AudioContext) {
					mute.animation = audioContext.state == "suspended" ? 1 : 0;
					mute.callback = function () {
						if (this.animation == 0) {
							if (audioContext.suspend) audioContext.suspend();
							else audioContext.gn.gain.value = 0;
							this.animation = 1;
						} else {
							if (audioContext.resume) audioContext.resume();
							else audioContext.gn.gain.value = 1;
							this.animation = 0;
						}
					}
				}
				else {
					mute.animation = window.muted ? 1 : 0;
					mute.callback = function () {
						window.muted = !window.muted;
						mute.animation = window.muted ? 1 : 0;
					};
				}
				s.buttons.push(mute);

			} else if (s.type != "cutscene") {
				/*
				var b = Object.create(Button).init(12, 0, Resources.menu);
				b.offset = {x: 0, y: -8};
				b.name = "menu";*/
				var t_menu = Object.create(Text).init(0,0,"menu", {size: 14, align: "right"});
				var b = Object.create(TextButton).init(470, 20, t_menu);
				if (s.type == "level")
					b.callback = function () {	world.doScene(2); };
				else
					b.callback = function () {	world.doScene(0); };		
				s.buttons.push(b);
			}
			if (s.name == "credits") {
				var t = Object.create(Text).init(0, 0, "@littlegustv", {size: 16});
				var b = Object.create(TextButton).init(240, 136, t);
				b.callback = function () { window.open("http://www.twitter.com/littlegustv", "_blank"); };
				s.buttons.push(b);
				var t = Object.create(Text).init(0, 0, "littlegustv.github.io", {size: 16});
				var b = Object.create(TextButton).init(240, 162, t);
				b.callback = function () { window.open("https://littlegustv.github.io", "_blank"); };
				s.buttons.push(b);
			}
			else if (s.name == "stagemenu") {
				var y = GLOBALS.border + 32, j = 0;
				for (stage in this.stages) {
					var title = Object.create(Text).init(canvas.width / 2, y, stage, {color: "#000000", align: "center", size: 18});
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
								if (levels[i].score <= levels[i].max) {
									var pos = tb.getPosition();
									var t = Object.create(Text).init(pos.x, pos.y + 10, String.fromCharCode(9733), {size: 32, color: "gold"});
									var perfect = Object.create(TextButton).init(pos.x, pos.y + 10, t);
									perfect.callback = function () {};
								} else {
									var overPar = levels[i].score - levels[i].max;
									var pos = tb.getPosition();
									var t = Object.create(Text).init(pos.x, pos.y + 10, "+" + String(overPar), {size: 32, color: "blue"});
									var perfect = Object.create(TextButton).init(pos.x, pos.y + 10, t);
									perfect.callback = function () {};
								}
							}
							tb.destination = w;
							tb.callback = function () {
								world.doScene(this.destination);
							};
							s.buttons.push(tb);
							if (perfect) s.buttons.push(perfect);
						}
						else {
							var lock = Object.create(Entity).init(i - j, 2 * j + 2, Resources.lock);
							s.entities.push(lock);
						}

					}
					j += 1;
					y += 56;
				}
				var score = 0, max = 0;
				for (var i = 0; i < this.scenes.length; i++) {
					if (this.scenes[i].type == 'level' && this.scenes[i].stage != "tutorial" && this.scenes[i].score) {
						score += this.scenes[i].score, max += this.scenes[i].max;
					}
				}
				s.entities.push(Object.create(Text).init(244,canvas.height - 20,String(score) + " / " + String(max) + " platforms used",{color: "black", size: 24}));
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
				if (current.entities[i].type == "collectable" && current.entities[i].distance > 0) {
					save.entities.push({gridX: current.entities[i].gridX, gridY: current.entities[i].gridY, type: "specimen", direction: getDirectionName(current.entities[i].direction)})
				}
				else if (current.entities[i].type == "character") {
					save.entities.push({gridX: current.entities[i].gridX - 5, gridY: current.entities[i].gridY + 10, type: current.entities[i].type})
				}
				else if (current.entities[i].type != "start" && current.entities[i].type != "text" && current.entities[i].type != "platform") 
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
			var obj = this.scene.remove(position, type);
			if (obj) {
				this.last = {
					action: "remove",
					type: type,
					x: position.x, y: position.y, direction: getDirectionName(obj.direction)
				}
				return true;
			}
			return false;
		},
		removeEntity: function (e) {
			this.scene.removeEntity(e);
		},
		drawCursor: function (ctx) {
			var m = this.toGrid(this.mouse.x, this.mouse.y);
			if (m.y <= 0 || m.y >= 10) return;
			if (!world.paused || world.scene.completed) return;
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
   			        var o1 = this.scene.map[m.y + cursor.direction.y][m.x + cursor.direction.x];
			        var o2 = this.scene.map[m.y + 2*cursor.direction.y][m.x + cursor.direction.x * 2];
			        if (o1 && o1.type == "obstacle") {
				        var d1 = Object.create(Entity).init(m.x + cursor.direction.x, m.y + cursor.direction.y, Resources.blocked);
				        d1.offset = {x: 0, y: -4};
				        d1.draw(ctx);			        	
			        } else if (o2 && o2.type == "obstacle") {
				        var d1 = Object.create(Entity).init(m.x + cursor.direction.x, m.y + cursor.direction.y, Resources.cursor);
				        d1.animation = this.mouse.angle;
				        d1.frame = 1;
				        d1.draw(ctx);			    		
			    	} else {
				        var d1 = Object.create(Entity).init(m.x + cursor.direction.x, m.y + cursor.direction.y, Resources.cursor);
				        d1.animation = this.mouse.angle;
				        d1.frame = 0;
				        d1.draw(ctx);
						var d2 = Object.create(Entity).init(m.x + 2 * cursor.direction.x, m.y + 2 * cursor.direction.y, Resources.cursor);
				        d2.animation = this.mouse.angle;
				        d2.frame = 1;
				        d2.draw(ctx);
		     		}		       
		    	}
			}
			/*
			if (this.scene.start) {
				ctx.font = "24px " + fontFamily;
				ctx.textAlign = "center";
				ctx.fillStyle = "black";
				var mx = modulo(m.x - this.scene.start.x, 2);
				var my = modulo(m.y - this.scene.start.y, 2);
				ctx.fillText(mx + ", " + my, this.mouse.x, this.mouse.y);
			}*/
		},
		addPlatform: function (m) {
			//var 
			//console.log(this.mouse.x, this.mouse.y);
			var dir;
			if (!m.direction) {
				dir = directions[this.mouse.angle];
				m = this.toGrid(this.mouse.x, this.mouse.y);
			}
			else {
				dir = m.direction;
			}

			if (m.y <= 0 || m.y >= 10) return;
			//if (!m.direction) dir = directions[this.mouse.angle];
			//else dir = m.direction;
			if (this.scene.addPlatform(m, dir)) {
				this.last = {
					action: "add",
					type: "platform",
					x: m.x, y: m.y, direction: dir
				};
			}
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
			this.total = 0;
			this.collected = 0;
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
			if (this.type == "level") {
				//ctx.drawImage(Resources.bottomBar.image, 0, canvas.height - 36, canvas.width, Resources.bottomBar.image.height * GLOBALS.scale);
				//ctx.drawImage(Resources.topBar.image, 0, -6, canvas.width, Resources.bottomBar.image.height * GLOBALS.scale);
				/*
				ctx.fillStyle = "rgba(255,255,255,0.6)";
				ctx.fillRect(0,0,canvas.width,32);
				ctx.fillRect(0,canvas.height-32,canvas.width,canvas.height);
				ctx.fillStyle = "black";
				ctx.fillRect(0,32,canvas.width,4);
				ctx.fillRect(0,canvas.height-32,canvas.width,4);*/
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
								playSound(Resources.complete);
								if (tracker.sendEvent) {
									console.log('sending event');
								  tracker.sendEvent('Complete', 'Level', this.uid);
								}	
								world.speed += 1;
								this.completed = true;
								this.character.animation = 1, this.character.frame = 0;
								world.paused = true;
								world.scenes[this.uid].score = this.platformsUsed;
								var n = (this.uid + 1) % world.scenes.length;
								if (world.scenes[n].stage != this.stage && !world.stageComplete(this.stage)) {
									var t = Object.create(Text).init(canvas.width / 2, canvas.height / 2, "<Next>", {size: 60});
									t.z = 100;
									this.entities.push(t);
									var t = Object.create(Text).init(canvas.width / 2, canvas.height / 2 - 16, "lockeclockedlockedlockedlockedlocked", {size: 20, color: "#EEEEEE"});
									t.z = 101;
									this.entities.push(t);
								}
								else {
									// completed a level...
									if (world.scenes[n].stage != this.stage && tracker.sendEvent) {
										tracker.sendEvent('Complete', 'Stage', this.stage);
									}
									var t = Object.create(Text).init(0,0,"<Next>",{size: 60});
									var tb = Object.create(TextButton).init(canvas.width / 2, canvas.height / 2, t);
									tb.callback = function () {
										world.doScene(n);
									};
									this.buttons.push(tb);

								}
								if (world.scenes[this.uid].score <= this.max) {
									var t2 = Object.create(Text).init(canvas.width / 2, canvas.height / 2 + 60, "Perfect!", {size: 72, color: "gold"}, 10, 300);
									t2.z = 100;
									this.entities.push(t2);
									var t2 = Object.create(Text).init(canvas.width / 2 + 4, canvas.height / 2 + 64, "Perfect!", {size: 72, color: "black"}, 10, 320);
									t2.z = 100;
									this.entities.push(t2);
								}
								world.save();
							}
						}
					}
				}
			}
			if (this.type == "level" && world.paused && !world.scene.completed) {
				this.par.text = String(this.count("platform")) + "/" + String(this.max) + " platforms";
				this.par.current = this.par.text.length;
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
		button: function (x, y, mx, my) {
			for (var i = 0; i < this.buttons.length; i++) {
				if (this.buttons[i].check(x, y)) {
					playSound(Resources.select);
					this.buttons[i].callback();
					return true;
				} 
				// check if the initial click was on a button, and they just dragged away to 'cancel'
				else if (this.buttons[i].check(mx, my)) {
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
					var r = this.map[position.y][position.x];
					// re-add removed platform's underlying characteristic... thing
					switch (this.map[position.y][position.x].special) {
						case "undertow":
							o = Object.create(UnderTow).init(position.x, position.y, Resources.undertow);
							break;
						case "hotspot":
							o = Object.create(HotSpot).init(position.x, position.y, Resources.hotspot);
							break;
					}
					if (type)
					{
						if (this.map[position.y][position.x] && this.map[position.y][position.x].type == type)
							this.map[position.y][position.x] = o;
						else return false;
					}
					else {
						this.map[position.y][position.x] = o;
					}
					return r;
				}
			}
			return false;
		},
		removeEntity: function (e) {
			var i = this.entities.indexOf(e);
			this.entities.splice(i, 1);
		},
		addPlatform: function (position, direction) {
			if (this.completed) return;
			if (this.map[position.y]) {
				var m = this.map[position.y][position.x];
				if (this.type != "level") return false;
				if (m && (m.type == "obstacle" || m.type == "platform")) return false;
				//if (this.count("platform") >= this.max) return;
				else {
					playSound(Resources.select);
					var p = Object.create(Platform).init(position.x, position.y, Resources.platform, DIRECTION[direction]);
					if (m && m.callback) { p.onJump = m.callback; p.special = m.type; }
					this.map[position.y][position.x] = p;
					return true;
				}
			}
			return false;
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
			if (this.special) {
				ctx.drawImage(Resources[this.special].image, 
    	    		this.frame * this.w / GLOBALS.scale, this.animation * this.h / GLOBALS.scale, 
        			this.w / GLOBALS.scale, this.h / GLOBALS.scale, 
        			Math.round(o.x - o.scale * this.w / 2), Math.ceil(o.y - o.scale * this.h / 2) - 12, o.scale * this.w, o.scale * this.h);
			}
			ctx.globalCompositeOperation = "normal";
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

	var Box = Object.create(Entity);
	Box.z = 1;
	Box.init = function (format, border, transition) {
		for (key in format) {
			this[key] = format[key];
		}
		this.border = border;
		this.transition = transition || {type: "none", counter: 0, maxCount: 0};
		this.contents = [];
		return this;
	}
	Box.draw = function (ctx) {
		if (this.delay > 0 || this.duration < 0) return;
		if (this.transition.type == "fade") {
			ctx.globalAlpha = this.transition.counter / this.transition.maxCount; 
		}
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.w, this.h);
		ctx.strokeStyle = this.border.color || "black";
		ctx.lineWidth = this.border.w || 0;
		ctx.strokeRect(this.x, this.y, this.w, this.h);
		for (var  i = 0; i < this.contents.length; i++) {
			this.contents[i].draw(ctx);
		}
		ctx.globalAlpha = 1;
	}
	Box.update = function (dt) {
		if (this.delay > 0) {
			this.delay -= dt;
		}
		else if (this.transition.counter < this.transition.maxCount) {
			this.transition.counter += dt;
		}
		else if (this.duration > 0) {
			this.duration -= dt;
		}
		for (var  i = 0; i < this.contents.length; i++) {
			this.contents[i].update(dt);
		}
	}
	var Button = Object.create(Entity);
	Button.type = "button";
	Button.drawButton = Entity.draw;
	Button.draw = function (ctx) {
		this.drawButton(ctx);
		if (this.frame == 1 && this.name) {
			var p = this.getPosition();
			ctx.font = "400 14px " + fontFamily;
			ctx.fillStyle = "#f4f0e8";
			ctx.textAlign = "center";
			ctx.fillText(this.name, p.x, p.y + 24);
		}
	}
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
		this.x = this.x - (this.text.align == "right") * this.w / 2 + (this.text.align == "left") * this.w / 2;
		this.color = this.text.color;
		return this;
	}
	TextButton.draw = function (ctx) {
		// uncomment to show hitbox
		/*ctx.fillStyle = "rgba(255,255,255,0.3)";
		ctx.fillRect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);*/
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
		else this.text.color = this.color;
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
    		Math.round(o.x - o.scale * this.w / 2), Math.ceil(o.y - o.scale * this.h / 2) + this.frame * GLOBALS.scale, Math.round(o.scale * this.w), Math.round(o.scale * this.h));		
		if (this.special) {
			ctx.globalAlpha = 0.6;
			ctx.drawImage(Resources[this.special].image, 
	    		this.frame * this.w / GLOBALS.scale, this.animation * this.h / GLOBALS.scale, 
    			this.w / GLOBALS.scale, this.h / GLOBALS.scale, 
    			Math.round(o.x - o.scale * this.w / 2), Math.ceil(o.y - o.scale * this.h / 2) + this.frame * GLOBALS.scale, o.scale * this.w, o.scale * this.h);
    	ctx.globalAlpha = 1;			
		}
	};
	Platform.update = function (dt) {};

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
	Collectable.opacity = 0.8;

	var Cell = Object.create(Entity);
	Cell.type = "cell";

	var Text = Object.create(Entity);
	Text.type = "text";
	Text.z = -1;
	Text.init = function (x, y, text, format, speed, delay, duration) {
		this.x = x, this.y = y, this.text = text;
		this.size = format.size || 40;
		this.color = format.color || "black";
		this.align = format.align || "center";
		this.speed = speed ? speed : 0;
		this.current = speed ? 0 : text.length;
		this.counter = speed ? speed : 0;
		this.delay = delay ? delay : 0;
		this.duration = duration || 0;
		return this;
	};
	Text.update = function (dt) {
		if (this.delay > 0) {
			this.delay -= dt;
			return;
		}
		if (this.duration > 0) {
			this.duration -= dt;
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
		if (this.duration < 0) return;
		ctx.textAlign = this.align;
		ctx.fillStyle = this.color;
		ctx.font = "900 " + this.size + "px " + fontFamily;
		ctx.fillText(this.text.substr(0,this.current), this.x, this.y);
	};

	var Character = Object.create(Entity);
	Character.offset = {x: 0, y: -16};
	Character.jumping = 0;
	Character.type = "character";
	Character.fall = function (isObstacle) {
		if (this.gridX == world.scene.start.x && this.gridY == world.scene.start.y && world.scene.entities.filter(function (e) { return e.type == "collectable"; }).length == 0) return;
			//this.jumping = GLOBALS.jumpSpeed;
			this.falling = true;
			playSound(Resources.fall);
			if (isObstacle) {
				this.animation = 7;
			} else {
				this.animation = 6;
			}
     	//canvas.style.webkitFilter = "invert(100%)";
     	//world.paused = true;
     	var c = this;
		setTimeout(function () {
			world.paused = true;
			c.falling = false;
   			//canvas.style.webkitFilter = "invert(0%)";
			world.reset(); 
		}, 1000);
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

			if (this.type != "collectable") {
				for (var i = 0; i < e.length; i++) {
					var ep = e[i].getPosition(), tp = this.getPosition();
					if (Math.abs(ep.x - tp.x) < 10 && Math.abs(ep.y - tp.y) < 10) {
						if (e[i].type == "collectable") { 
							var n = Object.create(Entity).init(world.scene.collected - 5, 10, e[i].sprite);
							n.offset = {x: 0, y: -8};
							n.animation = e[i].animation;
							world.addEntity(n);
							world.removeEntity(e[i]);
							world.scene.collected += 1;
							playSound(Resources.collect);
							return;
						}
					}
				}
			}

			var p = world.getAt(this.gridX, this.gridY);
			if (!p || p.type != "platform") { 
				if (!this.falling) this.fall((p && p.type == "obstacle"));
			}
			else if (p.direction) {
				var c = this;
				var d = 0;
				while (d < p.distance) {
					var p2 = world.getAt(this.gridX + p.direction.x * (d + 1), this.gridY + p.direction.y * (d + 1));
					if (p2 && p2.type == "obstacle") {
						d = 1;
						break;
					} else {
						d += 1;
					}
				}
				if (false){//d == 0 || p.type == "obstacle") {
					//if (!this.falling) this.fall();
				} else {
					/* onjump */
					var o = p.getPosition();
					/*
					var PlatformParticle = Object.create(ParticleEffect).init(o.x,o.y,10, Resources.spark, 
						function (n) { this.gridX += Math.cos(n) * GLOBALS.width; this.gridY += Math.sin(n) * GLOBALS.height; this.angle = modulo(n, Math.PI * 2);}, 
						function (dt) {
							this.animate(dt);
							this.health -= dt;
							this.opacity = this.health / 1000;

							this.gridY += -4 * ((this.health / 1000) * 10 - 5) * dt / 100;

							if ( this.angle > Math.PI / 2 && this.angle < 3 * Math.PI / 2) { 
								this.gridX -= dt / 100;
							}
							else { 
								this.gridX += dt / 100;
							};
						} );
					world.addEntity(PlatformParticle);
					*/
					p.frame = 1;
					setTimeout( function () { p.frame = 0; }, 500);
					playSound(Resources.jump);
					this.direction = p.direction;
					this.distance = d;
					this.jumping = GLOBALS.jumpSpeed;
					if (this.type != "collectable") {
						this.animation = directions.indexOf(getDirectionName(this.direction));
					}
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
	Specimen.distance = 1;
	Specimen.update = function (dt) {
		if (!this.next) {
			this.next = Object.create(Entity).init(this.gridX + this.distance * this.direction.x, this.gridY + this.distance * this.direction.y, Resources.cursor);
			this.next.animation = directions.indexOf(getDirectionName(this.direction));
			this.next.frame = 1;
		}
		this.animate(dt);
		if (world.paused) return;
		if (this.jumping > 0) {
			this.jumping -= dt;
		}
		if (this.jumping <= 0) {
			this.jumping = GLOBALS.jumpSpeed;
			this.gridX += this.distance * this.direction.x;
			this.gridY += this.distance * this.direction.y;
			//var d = (directions.indexOf(getDirectionName(this.direction)) + 2) % 6;
			//this.direction = DIRECTION[directions[d]];
		}
		this.next.gridX = this.gridX + this.distance * this.direction.x;
		this.next.gridY = this.gridY + this.distance * this.direction.y;
		if (this.gridX + this.gridY > 14 || this.gridX + this.gridY < -1) {
			world.reset();
		} else if (this.gridY < 1 || this.gridY > 10) {
			world.reset();
		}
	}
	Specimen.drawS = Entity.draw;
	Specimen.draw = function (ctx) {
		if (this.next) this.next.draw(ctx);
		this.drawS(ctx);
	}


 	var ParticleEffect = Object.create(Entity);
    ParticleEffect.update = function (dt) {
    	for (var i = 0; i < this.particles.length; i++) {
    		this.particles[i].update(dt);
    	}
    	for (var i = 0; i < this.particles.length; i++) {
    		if (this.particles[i].health <= 0) {
    			this.particles.splice(i, 1);
    		}
    	}
    	if (this.particles.length <= 0) { world.removeEntity(this)};
    };
    ParticleEffect.draw = function (ctx) {
    	for (var i = 0; i < this.particles.length; i++) {
    		this.particles[i].draw(ctx);
    	}
    };
    ParticleEffect.init = function (x, y, pnum, sprite, psetup, pupdate) {
    	this.gridX = x, this.gridY = y, this.particles = [];
    	for (var i = 0; i < pnum; i++) {
    		var p = Object.create(Particle).init(x, y, sprite);
    		p.setup = psetup, p.update = pupdate;
    		p.setup(2 * Math.PI * i / pnum);
    		this.particles.push(p);
    	}
    	return this;
    };
    ParticleEffect.getPosition = function () { return {x: this.gridX, y: this.gridY, scale: 1}};

    var Particle = Object.create(Entity);
    Particle.health = 1000;
    Particle.scale = 1;
    Particle.type = "particle";
    Particle.getPosition = function () { return {x: this.gridX, y: this.gridY, scale: 1}};
    //Particle.draw = function (ctx) { ctx.fillRect(this.gridX, this.gridY, 3, 3); };

/** 		GAME OBJECT INSTANCES 			**/

	var world = Object.create(World).init();
	window.muted = false;

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
			if (AudioContext) audioContext.suspend(); // FIX ME: adjust volume instead?
			else window.muted = true;
		}
		else {
			if (AudioContext) audioContext.resume();
			else window.muted = false;
		}
		world.time = new Date(); 
	});

});