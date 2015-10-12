var debug;

window.addEventListener("DOMContentLoaded", function () {
	var canvas = document.getElementById("mygame");
	var ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = false;

	var GLOBALS = {
		scale: 4,
		radius: 18
	};

	var DIRECTION = {
		none: false,
		east: {x: 1, y: 0},
		southeast: {x: 0, y: 1},
		southwest: {x: -1, y: 1},
		west: {x: -1, y: 0},
		northwest: {x: 0, y: -1},
		northeast: {x: 1, y: -1}
	};
	var directions = ["east", "southeast", "southwest", "west", "northwest", "northeast"];

	var Resources = {};
	var resourceInfo = [
		{path: "c1.png", frames: 2, speed: 400},
		{path: "p1.png"},
	];

	var World = {
		init: function () {
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
					Resources[name] = {image: new Image(), frames: resourceInfo[i].frames || 1, speed: resourceInfo[i].speed || 1};
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
						w.sceneInfo = request.response;
						w.progressBar();
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
			var s = Object.create(Scene).init();
			this.scenes.push(s);
			this.time = new Date();
			this.step();
		},
		step: function () {
			var newTime = new Date();
			var dt = newTime - this.time;
			this.time = newTime;
			this.scenes[this.cs].update(dt);
			this.scenes[this.cs].draw(ctx);
			var w = this;
			window.requestAnimationFrame(function () {	w.step();  });
		},
		getAt: function (x, y) {
			return this.scenes[this.cs].getAt(x,y);
		}
	};

	var Scene = {
		init: function () {
			this.setupMap();
			this.entities = [];
			var c = Object.create(Character).init(4, 4, Resources.c1);
			debug = c;
			this.entities.push(c);
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
			for (var i = 0; i < this.entities.length; i++) {
				this.entities[i].update(dt);
			}
		},
		setupMap: function () {
			this.map = {};
			for (var i = 0; i <= canvas.height / (2 * GLOBALS.radius); i++) {
				var row = {};
				for (var j = -i; j <= canvas.width / (2 * GLOBALS.radius); j++) {
					if (Math.random() > 0.3) {
						row[j] = Object.create(Platform).init(j, i, Resources.p1, DIRECTION[directions[Math.floor(Math.random() * 6)]]);
					} else {
						row[j] = undefined;
					}
				}
				this.map[i] = row;
			}
		},
		getAt: function (x, y) {
			return this.map[y] && this.map[y][x];
		}
	};

	var Entity = {
		frame: 0,
		delay: 0,
		offset: {x: 0, y: 0},
		init: function (gridX, gridY, sprite, direction) {
			this.gridX = gridX, this.gridY = gridY;
	    	this.sprite = sprite, this.h = this.sprite.image.height * GLOBALS.scale, this.w = this.sprite.image.width * GLOBALS.scale / this.sprite.frames;
	    	this.frame = 0, this.maxFrame = this.sprite.frames, this.frameDelay = this.sprite.speed, this.maxFrameDelay = this.sprite.speed;
	    	this.direction = direction ? direction : DIRECTION.none;
			return this;
		},
		drawX: function () { return this.gridX * GLOBALS.radius * 2 + this.gridY * GLOBALS.radius + GLOBALS.radius + this.offset.x; },
		drawY: function () { return Math.sin(Math.PI / 3) * 2 * GLOBALS.radius * this.gridY + GLOBALS.radius + this.offset.y; },
		draw: function (ctx) {
	        ctx.drawImage(this.sprite.image, 
	        	this.frame * this.w / GLOBALS.scale, 0, 
	        	this.w / GLOBALS.scale, this.h / GLOBALS.scale, 
	        	Math.round(this.drawX() - this.w / 2), this.drawY() - Math.round(this.h / 2), this.w, this.h);
		},
		update: function (dt) {

		}
	};

	var Platform = Object.create(Entity);
	Platform.distance = 2;

	var Character = Object.create(Entity);
	Character.offset = {x: 0, y: -12};
	Character.jumping = false;
	Character.update = function (dt) {
		this.frameDelay -= dt;
		if (this.frameDelay <= 0) {
			this.frameDelay = this.maxFrameDelay;
			this.frame = (this.frame + 1) % this.maxFrame;
		}
		var p = world.getAt(this.gridX, this.gridY);
		if (this.jumping) {}
		else if (!p) { 
			this.jumping = true;
			setTimeout(function () { world.begin(); }, 500);
		}
		else if (p.direction) {
			this.jumping = true;
			var c = this;
			setTimeout(function () { c.gridX += p.direction.x * p.distance, c.gridY += p.direction.y * p.distance; c.jumping = false;}, 500);
		}
	};

	/* GAME OBJECT INSTANCES */

	var world = Object.create(World).init();

});