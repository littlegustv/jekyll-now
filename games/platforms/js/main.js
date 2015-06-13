// music: PAMGAEA (incompetech)

window.onload = function () {

	console.log("NEW");

	var canvas = document.getElementById('mygame');
	var ctx = canvas.getContext("2d");
		
	var images = {};
	var sounds = {};
	
	function loadSound(name) {
		sounds[name] = new Audio();
		sounds[name].src = "./res/" + name + ".wav";
		sounds[name].volume = 0.1;
	}
	
	function loadImage(name) {
		images[name] = new Image();
		images[name].src = "./res/" + name + ".png";
	}
	
	loadSound("jump");
	loadSound("select");
	loadSound("fall");
	loadSound("movecursor");
	loadSound("addplatform");
	loadSound("complete");
	
	loadImage("platform");
	loadImage("switch-up");
	loadImage("switch-down");
	loadImage("obstacle");
	loadImage("checkbox");
	loadImage("square");
	loadImage("lock");
	//Image files
	
	var charImages = [new Image(), new Image(), new Image(), new Image()];
	charImages[0].src = "./res/character-side-flipped.png";
	charImages[1].src = "./res/character-2.png";
	charImages[2].src = "./res/character-side.png";
	charImages[3].src = "./res/character-2-back.png";

	
	var arrows = ["\u2192","\u2193","\u2190","\u2191"];
	
	//output
	//var output = document.getElementById('json_output');

	var TILESIZE = 64,
		FRAMESIZE = 64,
		BUTTON_TIME = 0.5,
		FPS = 30,
		START = false,
		FONT = " Monospace";
	var gameState = "loading";
	function changeState (newstate) {
		gameState = newstate;
	}
	var lw = 3, lvls = 6;
	ctx.lineWidth = lw;

	var jsonSave = "";
	
	var buttonDelay = BUTTON_TIME;
	
	// Cursor Location
	var mx = -1,
		my = -1;
		
	var mouse = {down: false, sx: 0, sy: 0, ex: 0 , ey: 0};
	var touch = {down: false, sx: 0, sy: 0, ex: 0 , ey: 0};
	// Location of the EXIT
	var ex = Math.floor(0.5 * canvas.width / TILESIZE),
		ey = 9;
	//start and end platforms
	var start = null, exit = null;
	// Background Scroll
	var by = 0;

	// Global distance for to-be-created platform
	var distance = 2;

	// Empty character and platform-list objects
	var c = null;
	var platforms = [];
	var obstacles = [];
	var switches = [];
	var buttons = {"loading": [], "mainmenu": [], "levelmenu": [], "help": [], "play": []};
	var effects = [];
	var selection = 0;
	
	var levels = [];
	var currentLevel = 0, levelCompleted = 100;
	
	// LOAD DATA FILE
	var request = new XMLHttpRequest();
	request.open('GET', './levels/levels.json', true);
	request.onload = function () {
		changeState("mainmenu");
		levels = JSON.parse(request.response).levels;
		levels.forEach(function (l) {
			//console.log(l);
			l.score = 0;
		});
		initButtons();
		//console.log(levels);
	};
	request.send();
	
	var Button = {
		init: function (x, y, w, h, text, callback) {
			this.x = x;
			this.y = y;
			this.h = h;
			this.w = w;
			this.text = text;
			this.callback = callback;
			return this;
		},
		draw: function(selected) {
			ctx.beginPath();
			
			if (selected)
				ctx.fillStyle = "rgba(155,155,255,0.5)"	
			else
				ctx.fillStyle = "rgba(155,155,155,0.5)";

			ctx.rect(this.x - 6,this.y - 4,this.w,this.h);			
			ctx.fill()
			ctx.rect(this.x + 6, this.y + 4, this.w, this.h);
			ctx.fill();
			
			ctx.fillStyle = "white";
			ctx.font = 0.8 * this.h + 'px' + FONT;
			ctx.textAlign = 'center';
			ctx.fillText(this.text, this.x + this.w/2 - 5, this.y + this.h * .68);
			ctx.lineWidth = lw;
		},
		drawSelected: function() {
			ctx.beginPath();

			ctx.rect(this.x - 6,this.y - 4,this.w,this.h);			
			ctx.fill()
			ctx.rect(this.x + 6, this.y + 4, this.w, this.h);
			ctx.fill();
			
			ctx.fillStyle = "white";
			ctx.font = '80px' + FONT;
			ctx.textAlign = 'center';
			ctx.fillText(this.text, this.x + 95, this.y + 68);
			ctx.lineWidth = lw;
		}
	};
	
	var LevelButton = Object.create(Button);
	LevelButton.init = function(level,name) {
		this.x = 2*TILESIZE + (level % lvls) * 2 * TILESIZE;
		this.y = 2 * TILESIZE + Math.floor(level / lvls) * 2 * TILESIZE;
		this.h = TILESIZE;
		this.w = TILESIZE;
		this.level = level;
		this.name = name;
		this.callback = function () {
			if (this.level <= levelCompleted) {
				currentLevel = this.level;
				doLevel();
				changeState("play");
			}
		};
		return this;
	}
	LevelButton.draw = function(selected) {
		ctx.font = '20px' + FONT;
		ctx.textAlign = 'center';
		if (selected && this.level <= levelCompleted) {
			ctx.fillStyle = "rgba(140,140,255,0.5)";
			ctx.roundRect(2*TILESIZE + (this.level % lvls) * 2 * TILESIZE, 2 * TILESIZE + Math.floor(this.level / lvls) * 2 * TILESIZE, TILESIZE - 1, TILESIZE - 1, TILESIZE / 6);
			ctx.fill();
		}
		if (this.level < levelCompleted) {
			ctx.drawImage(images['checkbox'], 2*TILESIZE + (this.level % lvls) * 2 * TILESIZE, 2 * TILESIZE + Math.floor(this.level / lvls) * 2 * TILESIZE, TILESIZE, TILESIZE);
		}
		else {
			ctx.drawImage(images['square'], 2*TILESIZE + (this.level % lvls) * 2 * TILESIZE, 2 * TILESIZE + Math.floor(this.level / lvls) * 2 * TILESIZE, TILESIZE, TILESIZE);
		}
		if (this.level > levelCompleted) {
			ctx.drawImage(images['lock'], 2*TILESIZE + (this.level % lvls) * 2 * TILESIZE + 2, 2 * TILESIZE + Math.floor(this.level / lvls) * 2 * TILESIZE + 2, TILESIZE - 4, TILESIZE - 4);			
		}
		ctx.fillStyle = "white";
		ctx.fillText('"' + this.name + '"', 2*TILESIZE + (this.level % lvls) * 2 * TILESIZE + TILESIZE / 2, 2 * TILESIZE + Math.floor(this.level / lvls) * 2 * TILESIZE + TILESIZE + 20);
		if (levels[this.level].score != 0) {
			ctx.font = "40px bold" + FONT;
			if  (levels[this.level].score <= levels[this.level].gold)
				ctx.fillStyle = "gold";
			else if (levels[this.level].score <= levels[this.level].gold + Math.pow(levels[this.level].gold, 0.5))
				ctx.fillStyle = "silver";
			else
				ctx.fillStyle = "peru";
			ctx.fillText("\u2605", 2*TILESIZE + (this.level % lvls) * 2 * TILESIZE + TILESIZE - 10, 2 * TILESIZE + Math.floor(this.level / lvls) * 2 * TILESIZE + 20);
		}

	}
	
	function initButtons() {
	
		for (var i = 0; i < levels.length; i++) {
			buttons["levelmenu"].push(Object.create(LevelButton).init(i,levels[i].name));
		}
		
		buttons["mainmenu"].push(Object.create(Button).init(canvas.width / 4, canvas.height * 2/3, 200, 100,  "play", function() {changeState("levelmenu")}));
		buttons["mainmenu"].push(Object.create(Button).init(canvas.width * 3/4 - 200, canvas.height * 2/3, 200, 100, "help", function() {changeState("help")}));
		
		buttons["help"].push(Object.create(Button).init(canvas.width / 2 - 100, canvas.height - 160, 50, 50, "\u2630", function() {changeState("mainmenu")}));
		buttons["levelmenu"].push(Object.create(Button).init(canvas.width / 2 - 100, canvas.height - 160, 50, 50, "\u2630", function() {changeState("mainmenu")}));
		
		buttons["play"].push(Object.create(Button).init(canvas.width - 100, 50, 50, 50, "\u2630", function() {changeState("levelmenu")}));
		buttons["play"].push(Object.create(Button).init(canvas.width - 100, 120, 50, 50, "\u21BA", function() {reset();}));
		buttons["play"].push(Object.create(Button).init(canvas.width - 100, 190, 50, 50, "\u25B6", function() {	START = true;}));
	}
	
	var Ripple = {
		init: function (x, y, color) {
			this.x = x;
			this.y = y;
			this.color = color;
			this.dt = 0;
			return this;
		},
		draw: function () {
			ctx.lineWidth = 24;
			ctx.strokeStyle = "rgba(" + this.color.red + "," + this.color.green + "," + this.color.blue + "," + (100 - Math.round(100*this.dt)) / 200 + ")";
			ctx.beginPath();
			ctx.rect(this.x * TILESIZE - Math.floor(50*this.dt), this.y * TILESIZE - Math.floor(50*this.dt) + TILESIZE / 3, TILESIZE + Math.floor(100*this.dt), TILESIZE + Math.floor(100 * this.dt), 20);
			ctx.closePath();
			ctx.stroke();
			ctx.strokeStyle = "black";
			ctx.lineWidth = lw;
		},
		update: function (dt) {
			this.dt += dt;
		}
	};
	
	var SmallRipple = Object.create(Ripple);
	SmallRipple.draw = function () {
		ctx.lineWidth = 14;
		ctx.strokeStyle = "rgba(" + this.color.red + "," + this.color.green + "," + this.color.blue + "," + (100 - Math.round(100*this.dt)) / 400 + ")";
		ctx.beginPath();
		ctx.rect(this.x * TILESIZE - Math.floor(25*this.dt), this.y * TILESIZE - Math.floor(25*this.dt) + TILESIZE / 3, TILESIZE + Math.floor(50*this.dt), TILESIZE + Math.floor(50 * this.dt), 20);
		ctx.closePath();
		ctx.stroke();
		ctx.strokeStyle = "black";
		ctx.lineWidth = lw;
	};
	
	// Base PLATFORM class
	var Platform = {
		init: function (x, y) {
			this.x = x;
			this.y = y;
			return this;
		},
		moving: false,
		fade: 10,
		duration: 10,
		color: "rgba(0,0,200,0.5)",
		collidable: true,
		draw: function () {
			ctx.drawImage(images['platform'], this.x * TILESIZE, this.y * TILESIZE - TILESIZE / 3, TILESIZE, 1.7*TILESIZE);
		},
		update: function () {}
	};

	// PLATFORM that changes Character direction
	var TurnPlatform = Object.create(Platform);
	TurnPlatform.init = function (x, y, angle) {
		this.x = x, this.y = y, this.angle = angle, this.distance = distance;
		//this.color = "rgba(0,200,0,0.5)";
		this.color = {red: Math.floor(Math.random() * 255), green: Math.floor(Math.random() * 255), blue: Math.floor(Math.random() * 255)};
		return this;
	};
	TurnPlatform.draw = function () {
		ctx.beginPath();
		ctx.fillStyle = "rgba(" + this.color.red + "," + this.color.green + "," + this.color.blue + ", 0.5)";
		ctx.rect(this.x * TILESIZE + lw, this.y * TILESIZE + 8, TILESIZE - 2*lw, TILESIZE - 14);
		ctx.fill();
		ctx.stroke();
		ctx.fillStyle = "rgba(" + this.color.red/2 + "," + this.color.green/2 + "," + this.color.blue/2 + ", 0.5)";
		ctx.rect(this.x * TILESIZE + lw, this.y * TILESIZE + TILESIZE - 6, TILESIZE - 2*lw, TILESIZE * 0.4);
		ctx.fill();
		ctx.stroke();
		ctx.closePath();

		//ctx.drawImage(images['platform'], this.x * TILESIZE, this.y * TILESIZE - TILESIZE / 3, TILESIZE, 1.7* TILESIZE);
		ctx.fillStyle = "black";
		ctx.font = "40px bold" + FONT;
		ctx.fillText(arrows[Math.round(this.angle / (Math.PI / 2))], this.x * TILESIZE + TILESIZE / 2, this.y * TILESIZE + 2 * TILESIZE / 3);	
	};
	
	// OBSTACLE solid barrier that can't be jumped over
	var Obstacle = Object.create(Platform);
	Obstacle.draw = function () {
		ctx.globalAlpha = this.collidable ? 1 : 0.5;
		ctx.drawImage(images['obstacle'], this.x * TILESIZE, this.y * TILESIZE - TILESIZE / 3, TILESIZE, 1.7*TILESIZE);
		ctx.globalAlpha = 1;
	};
	
	// SWITCH turns another platform on and off (collidable)
	var Switch = Object.create(Platform);
	Switch.init = function (x,y,target) {
		this.x = x;
		this.y = y;
		this.target = target;
		this.color = "rgba(255,0,0,0.6)";
		target.collidable = false;
		return this;
	};
	Switch.draw = function () {
	
		// "current"
		ctx.beginPath();
		ctx.moveTo(this.x * TILESIZE + TILESIZE / 2, this.y * TILESIZE + TILESIZE / 2);
		ctx.lineTo(this.x * TILESIZE + TILESIZE / 2, this.target.y * TILESIZE + TILESIZE / 2);
		ctx.lineTo(this.target.x * TILESIZE + TILESIZE / 2, this.target.y * TILESIZE + TILESIZE / 2);
		ctx.strokeStyle = this.color;
		ctx.lineJoin = "round";
		ctx.stroke();
		ctx.strokeStyle = "black";
	
		// switch
		if (this.target.collidable) {
			ctx.drawImage(images["switch-down"], this.x * TILESIZE, this.y * TILESIZE - TILESIZE / 3, TILESIZE, 1.7 * TILESIZE);
		}
		else {
			ctx.drawImage(images["switch-up"], this.x * TILESIZE, this.y * TILESIZE - TILESIZE / 3, TILESIZE, 1.7 * TILESIZE);		
		}
		/*
		ctx.beginPath();
		ctx.roundRect(this.x * TILESIZE + lw/2, this.y * TILESIZE + lw / 2, TILESIZE - lw, TILESIZE - lw, TILESIZE / 4);
		ctx.fillStyle = this.color;
		ctx.fill();
		ctx.stroke();*/
	};
	Switch.trigger = function () {
		this.color = "rgba(0,255,0,0.6)";
		this.target.collidable = true;
	};
	
	// Character to be moved
	var Character = {
		x:	Math.floor(0.5 * canvas.width / TILESIZE),
		y: 0,
		scale: 1,
		angle: Math.PI / 2,
		speed: 0,
		//CHANGE ACCELERATION TO SPEED UP (fast-forward)
		acel: 20,
		distance: 0,
		maxDistance: 10,
		frame: 0,
		frames: 9,
		animationSpeed: 1 / 9, // denominator = FPS
		delay: 0, 
		setDistance: function (n) {
			if (this.distance <= 0) this.distance = n;
		},
		draw: function () {
			ctx.drawImage(charImages[Math.round(this.angle/(Math.PI / 2))],
			this.frame * FRAMESIZE, 0, FRAMESIZE, FRAMESIZE, // Clipping, for animation frame
			this.x * TILESIZE + (1 - this.scale) * TILESIZE / 2, 
			this.y * TILESIZE  + (1 - this.scale) * TILESIZE - 8,
			this.scale * TILESIZE,
			this.scale * TILESIZE);
		},
		update: function (dt) {
			this.frames = charImages[Math.round(this.angle/(Math.PI / 2))].width / FRAMESIZE;
			
			this.frame = Math.floor((this.frames - 1)* Math.max(this.distance, 0) / this.maxDistance);
			
			if (this.distance > 0) {
				this.scale = 1 + Math.sin(Math.PI * this.distance / this.maxDistance) / 3
				this.x += this.speed * dt * Math.cos(this.angle);
				this.y += this.speed * dt * Math.sin(this.angle);
				this.distance -= this.speed * dt;
				var t = this.speed / this.acel;
				if (this.speed * t / 2 >= this.distance) {
					this.speed -= this.acel * dt;
				} else {
					this.speed += this.acel * dt;
				}
			} else {
				this.scale = 1;
				this.x = Math.round(this.x);
				this.y = Math.round(this.y);
				this.speed = 0;
				var p = findPlatform(this.x, this.y);
				if (!p && START) {
					START = false;
					this.maxDistance = 0;
					var e1 = Object.create(Ripple).init(this.x, this.y, {red: 41, green: 9, blue: 57});
					var e2 = Object.create(SmallRipple).init(this.x, this.y, {red: 99, green: 54, blue: 123});
					effects.push(e1);
					effects.push(e2);
					sounds['fall'].play();
					setTimeout(reset, 500);
				}
				else {			
					// TRY triggering switch, if it is a switch
					if (p.trigger) p.trigger();
					
					if (p.angle !== undefined) {
						this.angle = p.angle;
						sounds["jump"].play();
						var e1 = Object.create(SmallRipple).init(Math.round(this.x), Math.round(this.y), p.color);
						effects.push(e1);
					}
				
					//CHECK IF WE SHOULD MOVE
					if (this.distance <= 0) {
						this.distance = 2;
						this.maxDistance = this.distance;
						//console.log(this.angle, this.x + 2 * Math.cos(this.angle), this.y + 2 * Math.sin(this.angle));
						for (var d = 0; d <= 2; d++) {
							var o = findObstacle(this.x + d * Math.cos(this.angle), this.y + d * Math.sin(this.angle));
							if (o && o.collidable) {
								this.distance = d - 1;
								this.maxDistance = this.distance;
								break;
							}
						}
					}
				}
			}
		},
	};

	ctx.roundRect = function(x, y, w, h, radius) {
		this.beginPath();
		this.moveTo(x,y+radius);
		this.arcTo(x,y,x+radius,y,radius);
		this.lineTo(x+w-radius,y);
		this.arcTo(x+w,y,x+w,y+radius,radius);
		this.lineTo(x+w,y+h-radius);
		this.arcTo(x+w,y+h,x+w-radius,y+h,radius);
		this.lineTo(x+radius,y+h);
		this.arcTo(x,y+h,x,y+h-radius,radius);
		this.lineTo(x,y+radius);
		this.closePath();
	};

	// Check for platform on current Tile
	function findPlatform(dx, dy) {
		for (var i = 0; i < platforms.length; i++) {
			if (platforms[i].x == Math.floor(dx) && platforms[i].y == Math.floor(dy) && platforms[i].collidable) {
				return platforms[i];
			}
		}
		return undefined;
	}
	
	function findObstacle(dx, dy) {
		for (var i = 0; i < obstacles.length; i++) {
			if (obstacles[i].x == Math.round(dx) && obstacles[i].y == Math.round(dy)) {
				return obstacles[i];
			}
		}
		return undefined;
	}
	
	// Reset gameState to beginning
	function reset() {
		START = false;
		distance = 2;
		c = Object.create(Character);
		doLevel();
	}

	// Check if Character is at EXIT
	function checkWin() {
		if (c.x === exit.x && c.y === exit.y) {
			if (platforms.length - 2 < levels[currentLevel].score || levels[currentLevel].score == 0) {
				levels[currentLevel].score = platforms.length - 2;
			}
			if ((currentLevel + 1) > levelCompleted) {
				levelCompleted = (currentLevel + 1);
				selection = currentLevel + 1;
			}
			return true;
		}
	}
	
	function saveLevel() {
		var save = {platforms: platforms, obstacles: obstacles, exit: exit, start: start};
		jsonSave = JSON.stringify(save);
		output.value = jsonSave;
	}
	
	function loadLevel(sourceString) {
		platforms = [], obstacles = [];
		var sourceObj = JSON.parse(sourceString);
		for (var i = 0; i < sourceObj.platforms.length; i++)
		{
			if (sourceObj.platforms[i].angle !== undefined)
				platforms.push(Object.create(TurnPlatform).init(sourceObj.platforms[i].x, sourceObj.platforms[i].y, sourceObj.platforms[i].angle));
		}
		for (var i = 0; i < sourceObj.obstacles.length; i++)
		{
			obstacles.push(Object.create(Obstacle).init(sourceObj.obstacles[i].x, sourceObj.obstacles[i].y));
		}
		exit = Object.create(Platform).init(sourceObj.exit.x, sourceObj.exit.y);
		start = Object.create(Platform).init(sourceObj.start.x, sourceObj.start.y);
		platforms.push(exit);
		platforms.push(start);
	}
	
	function doLevel() {
		START = false;
		platforms = [], obstacles = [];
		c = Object.create(Character);
		var sourceObj = levels[currentLevel];
		for (var i = 0; i < sourceObj.platforms.length; i++)
		{
			if (sourceObj.platforms[i].angle !== undefined)
				platforms.push(Object.create(TurnPlatform).init(sourceObj.platforms[i].x, sourceObj.platforms[i].y, sourceObj.platforms[i].angle));
			else
				platforms.push(Object.create(Platform).init(sourceObj.platforms[i].x, sourceObj.platforms[i].y));
		}
		for (var i = 0; i < sourceObj.obstacles.length; i++)
		{
			obstacles.push(Object.create(Obstacle).init(sourceObj.obstacles[i].x, sourceObj.obstacles[i].y));
		}
		if (sourceObj.switches) {
			for (var i = 0; i < sourceObj.switches.length; i++)
			{
				platforms.push(Object.create(Switch).init(sourceObj.switches[i].x, sourceObj.switches[i].y, findObstacle(sourceObj.switches[i].target.x, sourceObj.switches[i].target.y)));
			}
		}
		exit = Object.create(Platform).init(sourceObj.exit.x, sourceObj.exit.y);
		start = Object.create(Platform).init(sourceObj.start.x, sourceObj.start.y);
		platforms.push(exit);
		platforms.push(start);
		c.x = start.x;
		c.y = start.y;
		mx = c.x;
		my = c.y - 1;
	}
	
	function moveExit(x,y) {
		exit.x = Math.floor(x);
		exit.y = Math.floor(y);
	}
	
	function doLoading(dt) {
		ctx.clearRect(0,0,canvas.width, canvas.height);
		ctx.font = 'bold 80px' + FONT;
		ctx.textAlign = 'center';
		ctx.fillStyle = 'black';
		ctx.fillText('loading...', canvas.width/2, canvas.height/2);
	}
	
	function doMainMenu(dt) {
		ctx.clearRect(0,0,canvas.width,canvas.height);
		
		ctx.fillStyle = "rgba(0,180,0,0.5)";
		ctx.fillRect(canvas.width/2 - 250 - 5, canvas.height/2 - 100 - 5, 500, 150);
		ctx.fillRect(canvas.width/2 - 250 + 5, canvas.height/2 - 100 + 5, 500, 150);
		
		ctx.font = '80px' + FONT;
		ctx.textAlign = 'center';
		ctx.fillStyle = 'black';
		ctx.fillText('flat_FORMS', canvas.width/2, canvas.height/2);
	}
	
	function doLevelMenu(dt) {
		ctx.clearRect(0,0,canvas.width,canvas.height);
		
		/*ctx.font = '20px Ubuntu Mono';
		ctx.textAlign = 'center';
		for (var i = 0; i < levels.length; i++)
		{
			if (i == currentLevel) {
				ctx.fillStyle = "rgba(0,0,100,0.5)";
				ctx.roundRect(2*TILESIZE + (i % lvls) * 2 * TILESIZE, 2 * TILESIZE + Math.floor(i / lvls) * 2 * TILESIZE, TILESIZE - 1, TILESIZE - 1, TILESIZE / 6);
				ctx.fill();
			}
			if (i < levelCompleted) {
				ctx.drawImage(images['checkbox'], 2*TILESIZE + (i % lvls) * 2 * TILESIZE, 2 * TILESIZE + Math.floor(i / lvls) * 2 * TILESIZE, TILESIZE, TILESIZE);
			}
			else {
				ctx.drawImage(images['square'], 2*TILESIZE + (i % lvls) * 2 * TILESIZE, 2 * TILESIZE + Math.floor(i / lvls) * 2 * TILESIZE, TILESIZE, TILESIZE);
			}
			if (i > levelCompleted) {
				ctx.drawImage(images['lock'], 2*TILESIZE + (i % lvls) * 2 * TILESIZE + 2, 2 * TILESIZE + Math.floor(i / lvls) * 2 * TILESIZE + 2, TILESIZE - 4, TILESIZE - 4);			
			}
			ctx.fillStyle = "black";
			ctx.fillText('"' + levels[i].name + '"', 2*TILESIZE + (i % lvls) * 2 * TILESIZE + TILESIZE / 2, 2 * TILESIZE + Math.floor(i / lvls) * 2 * TILESIZE + TILESIZE + 20);
		}*/
	}
	
	function doSelected() {
/*
	for (var i = 0; i < buttons.length; i++) {
			if (buttons[gameState][i].selected) {
				buttons[i].callback();
				sounds['select'].play();
				break;
			}
		}*/
		buttons[gameState][selection].callback();
		sounds['select'].play();
	}
	
	// Handle GAMEPAD input
	function doGamepads(dt) {
		var gamepads = navigator.getGamepads();

		for (var i = 0; i < gamepads.length; i++) {
			var pad = gamepads[i];
			if (pad) {
			
				if (gameState == 'play')
				{
				
					if (Math.abs(pad.axes[0]) > 0.5) {
						mx = Math.max(0, Math.min(mx + pad.axes[0] / 5, canvas.width / TILESIZE - 1));
					}
					if (Math.abs(pad.axes[1]) > 0.5) {
						my = Math.max(0, Math.min(my + pad.axes[1] / 5, canvas.height / TILESIZE - 1));
					}
					
					if (pad.axes[2] > 0.5) {
						choice = 0;
					}
					else if (pad.axes[2] < -0.5) {
						choice = 2;
					}
					else if (pad.axes[3] > 0.5) {
						choice = 1;
					}
					else if (pad.axes[3] < -0.5) {
						choice = 3;
					}
					
					if (buttonDelay < 0) {
					//BUTTON 'A' is DOWN:
						if (pad.buttons[0].pressed) {
							addPlatform();	//A
							sounds['addplatform'].play();
							buttonDelay = BUTTON_TIME;
						}								
						if (pad.buttons[1].pressed) {
							addObstacle(); //B
							buttonDelay = BUTTON_TIME;
						}
						if (pad.buttons[2].pressed) {
							moveExit(mx, my); //X
							buttonDelay = BUTTON_TIME;
						}
						if (pad.buttons[3].pressed) {
							saveLevel(); //Y
							buttonDelay = BUTTON_TIME;
						}
						if (pad.buttons[5].pressed) {
							loadLevel(jsonSave); // RB
							buttonDelay = BUTTON_TIME;
						}						
					}
					else
					{
						buttonDelay -= dt;
					}
				
				}
				
				else if (gameState == 'mainmenu')
				{
					if (buttonDelay < 0)
					{
						if (pad.buttons[0].pressed) {
							buttonDelay = BUTTON_TIME;
							doSelected();
						}
						if (pad.axes[0] > 0.5) {
							//buttons[gameState][selection].selected = false;
							selection = (selection + 1) % buttons[gameState].length;
							//buttons[gameState][selection].selected = true;
							buttonDelay = BUTTON_TIME;
						}
						else if (pad.axes[0] < -0.5) {
							//buttons[gameState][selection].selected = false;
							selection = ((selection - 1) % buttons[gameState].length + buttons[gameState].length) % buttons[gameState].length;
							//buttons[gameState][selection].selected = true;
							buttonDelay = BUTTON_TIME;
						}
					}
					else {
						buttonDelay -= dt;
					}
				}
				
				else if (gameState == 'levelmenu')
				{
					if (buttonDelay < 0) {
						if (pad.buttons[0].pressed) {
							buttonDelay = BUTTON_TIME;
							/*
							doLevel();
							changeState("play");
							sounds['select'].play();*/
							doSelected();
						}
						if (pad.axes[0] > 0.5) {
							currentLevel = (currentLevel + 1) % (levelCompleted + 1);
							selection = currentLevel;
							console.log("gamepad1", currentLevel);
							buttonDelay = BUTTON_TIME;
						}
						else if (pad.axes[0] < -0.5) {
							currentLevel = ((currentLevel - 1) % (levelCompleted + 1) + (levelCompleted + 1)) % (levelCompleted + 1);
							selection = currentLevel;
							console.log("gamepad2", currentLevel);
							buttonDelay = BUTTON_TIME;
						}
					}
					else {
						buttonDelay -= dt;
					}
				}
				
				if (buttonDelay < 0) {

					if (pad.buttons[9].pressed) { //START
						if (gameState == 'play')
						{
							if (START) {
								reset();
							}
							else {
								START = true;
							}
						}
						buttonDelay = BUTTON_TIME;
					} else if (pad.buttons[8].pressed) { //BACK (exit game)
						buttonDelay = BUTTON_TIME;
						if (gameState == 'mainmenu')
							window.close();
						else if (gameState == 'levelmenu' || gameState == 'help')
							changeState('mainmenu');
						else if (gameState == 'play')
							changeState('levelmenu');
					} 

					if (choice >= 4) choice = 0;
					else if (choice < 0) choice = 4 - 1;
				} else {
					buttonDelay -= dt;
				}
			}
		}
	}

	function doHelp(dt) {
	
		ctx.clearRect(0,0,canvas.width, canvas.height);
		ctx.fillStyle = "black";
		ctx.font = "bold 20px" + FONT;
		ctx.fillText("HELP! I need somebody...", canvas.width/2, canvas.height/2);
	
	}
	
	function doButtons(dt) {
		for (var i = 0; i < buttons[gameState].length; i++)
		{
			buttons[gameState][i].draw(i == selection);
		}
	}
	
	// do all the updating and drawing, etc.
	function doStuff(dt) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		
		//LEVEL NAME
		ctx.fillStyle = "rgba(100,100,100,0.5)"
		//console.log(levels[currentLevel].name.length );
		ctx.font = 150.0 / levels[currentLevel].name.length + "vw" + FONT;
		ctx.fillText(levels[currentLevel].name, canvas.width / 2, canvas.height * 0.4); 
		
		//CURSOR INDICATION
		if (findButton(mx * TILESIZE, my * TILESIZE) === undefined) { 
			ctx.globalAlpha = 0.3;

			ctx.drawImage(images['platform'], Math.floor(mx) * TILESIZE, Math.floor(my) * TILESIZE - TILESIZE / 3, TILESIZE, TILESIZE * 1.7);
			ctx.font = "40px bold" + FONT;
			ctx.fillStyle = "black";
			ctx.fillText(arrows[choice], Math.floor(mx) * TILESIZE + TILESIZE / 2, Math.floor(my) * TILESIZE + 2 * TILESIZE / 3);
			ctx.globalAlpha = 1;
		}

		//DRAW/UPDATE

		// (effects)
		for (var i = 0; i < effects.length; i++)
		{
			effects[i].draw();
			effects[i].update(dt);
		}
		
		var objects_sorted = (platforms.concat(obstacles)).sort(function(a,b) {
						if (a.y < b.y)
							return -1;
						if (a.y > b.y)
							return 1;
						return 0;
					});

		//pre-draw shadows
		ctx.fillStyle = "rgba(0,0,0,0.2)";
		for (var i = 0; i < objects_sorted.length; i++)
		{
			ctx.fillRect(objects_sorted[i].x * TILESIZE + 8, objects_sorted[i].y * TILESIZE + TILESIZE / 2, TILESIZE - 4, TILESIZE - 4);
		}

		for (var i = 0; i < objects_sorted.length; i++)
		{
			objects_sorted[i].draw();
			objects_sorted[i].update();
		}
		
		//EXIT SIGN
		ctx.fillStyle = "black";
		ctx.font = "bold 20px" + FONT;
		ctx.textAlign = "center";
		ctx.fillText("EXIT", (exit.x + 0.5) * TILESIZE, (exit.y + 0.65) * TILESIZE);

		if (START) {
			c.update(dt);
		}
		c.draw();
		
		//SCROLLING BG
		//by -= 0.3;
		//canvas.style.backgroundPosition = "0px " + by + "px";

		//CHECK WIN
		if (checkWin() && START) {
			sounds['complete'].play();
			START = false;
			setTimeout(function () {
				currentLevel++;
				changeState("levelmenu");
			}, 500);
		}
		
		//Cleanup
		for (var i = 0; i < effects.length; i++) {
			if (effects.dt > 1)
			{
				var ind = effects.indexOf(this);
				effects.splice(ind, 1);
			}
		}
	}

	//TIME FOR dt VARIABLE
	var startTime = new Date();

	//LOOP FUNCTION
	function step() {
		var newTime = new Date();
		var dt = (newTime - startTime) / 1000;
		startTime = newTime;

		if (gameState == "play")
		{
			doStuff(dt);
		}
		else if (gameState == "mainmenu")
		{
			doMainMenu(dt);
		}
		else if (gameState == "help")
		{
			doHelp(dt);
		}
		else if (gameState == "loading")
		{
			doLoading(dt);
		}
		else if (gameState == "levelmenu")
		{
			doLevelMenu(dt);
		}
		
		//CHECK GAMEPAD INPUT
		doGamepads(dt);

		doButtons(dt);
		
		window.requestAnimationFrame(step);
	}

	//... awkward way for choosing platform to create
	var choice = 1;

	function findButton(x,y) {
		for (var i = 0; i < buttons[gameState].length; i++) {
			//console.log(buttons[gameState]);
			if (x > buttons[gameState][i].x && x < buttons[gameState][i].x + buttons[gameState][i].w) {
				if (y > buttons[gameState][i].y && y < buttons[gameState][i].y + buttons[gameState][i].h) {
					selection = i;
					return buttons[gameState][i];
				}
			}
		}
		return undefined;
	}
	
	// create a platform at the given cursor
	function addPlatform() {
		if (findPlatform(mx, my) === undefined && findObstacle(mx, my) === undefined && platforms.length - 2 < levels[currentLevel].gold) {
			var p1 = Object.create(TurnPlatform).init(Math.floor(mx), Math.floor(my), Math.PI * choice / 2);
			platforms.push(p1);
			var e1 = Object.create(Ripple).init(Math.floor(mx), Math.floor(my), p1.color);
			effects.push(e1);
			return true;
		}
		return false;
	}
	
	function addObstacle() {
		if (findPlatform(mx, my) === undefined && findObstacle(mx, my) === undefined) {
			var o1 = Object.create(Obstacle).init(Math.floor(mx),Math.floor(my));
			obstacles.push(o1);
		}
	}
	
	function removePlatform() {
		var p = findPlatform(mx, my);
		if (p !== undefined && p != start && p != exit && p.angle !== undefined) {
			var i = platforms.indexOf(p);
			platforms.splice(i, 1);
			return true;
		}
		return false;
	}
	
	// MOUSE BEHAVIOR
	
	canvas.addEventListener("contextmenu", function (e) {
		e.preventDefault();
		return false;
	});
	
	canvas.addEventListener("mouseup", function (e) {
		e.preventDefault();
		mouse.down = false;
		var b = findButton(e.offsetX, e.offsetY);
		if (b !== undefined) {
			b.callback();
			sounds['select'].play();
		}
		else if (gameState == "play" && !START) {
			if (e.which === 3 || e.button === 2) {
				if (removePlatform())
					sounds['fall'].play();
			}
			else {
				if (addPlatform())
					sounds['addplatform'].play();
			}
		}
	});
	
	canvas.addEventListener("mousedown", function (e) {
		if (gameState == "play") {
			mouse.down = true;
			mouse.sx = e.offsetX, mouse.sy = e.offsetY;
		}
	});

	canvas.addEventListener("mousemove", function (e) {
		findButton(e.offsetX, e.offsetY);
		if (gameState == "play") {
			if (mouse.down) {
				mouse.ex = e.offsetX, mouse.ey = e.offsetY;
				choice = Math.round((Math.atan2((mouse.ey - mouse.sy),(mouse.ex - mouse.sx)) + Math.PI * 2) / (Math.PI / 2)) % 4;
			}
			else {
				mx = Math.floor(e.offsetX / TILESIZE);
				my = Math.floor(e.offsetY / TILESIZE);
			}
		}
	});
	//TOUCH BEHAVIOR
	canvas.addEventListener("touchend", function (e) {
		if (gameState == "play") {
			addPlatform();
		}
	});
	
	canvas.addEventListener("touchstart", function (e) {
		if (gameState == "play") {
			touch.sx = e.changedTouches[0].clientX, touch.sy = e.changedTouches[0].clientY;
			mx = Math.floor(e.changedTouches[0].clientX / TILESIZE);
			my = Math.floor(e.changedTouches[0].clientY / TILESIZE);
		}
	});

	canvas.addEventListener("touchmove", function (e) {
		if (gameState == "play") {
			touch.ex = e.changedTouches[0].clientX, touch.ey = e.changedTouches[0].clientY;
			choice = Math.round((Math.atan2((touch.ey - touch.sy),(touch.ex - touch.sx)) + Math.PI * 2) / (Math.PI / 2)) % 4;
		}
	});
	

	//GET GOING
	window.requestAnimationFrame(step);

};