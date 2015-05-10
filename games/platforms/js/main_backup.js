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
		sounds[name].volume = 0.5;
	}
	
	function loadImage(name) {
		images[name] = new Image();
		images[name].src = "./res/" + name + ".png";
	}
	
	loadSound("jump");
	loadSound("select");
	loadSound("fall");
	
	loadImage("platform");
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
		BUTTON_TIME = 0.5,
		FPS = 30,
		START = false;
	var gameState = "loading";
	var lw = 3;
	ctx.lineWidth = lw;

	var jsonSave = "";
	
	var buttonDelay = BUTTON_TIME;
	
	// Cursor Location
	var mx = -1,
		my = -1;
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
	var buttons = [];
	var effects = [];
	var selection = 0;
	
	var levels = [];
	var currentLevel = 0, levelCompleted = 0;
	
	// LOAD DATA FILE
	var request = new XMLHttpRequest();
	request.open('GET', './levels/levels.json', true);
	request.onload = function () {
		gameState = "mainmenu";
		levels = JSON.parse(request.response).levels;
		levels.forEach(function (l) {
			//console.log(l);
		});
		//console.log(levels);
	};
	request.send();
	
	var Button = {
		init: function (x, y, text, callback) {
			this.x = x;
			this.y = y;
			this.text = text;
			this.callback = callback;
			this.selected = false;
			return this;
		},
		draw: function() {
			ctx.beginPath();
			ctx.rect(this.x - 6,this.y - 4,200,100);
			if (this.selected) ctx.fillStyle = "rgba(0,0,100,0.5)"
			else ctx.fillStyle = "rgba(0,0,0,0.5)";
			ctx.fill()
			//ctx.strokeStyle = "black";
			//ctx.lineWidth = 4;
			ctx.rect(this.x + 6, this.y + 4, 200, 100);
			ctx.fill();
			//ctx.stroke();
			ctx.fillStyle = "white";
			ctx.font = '80px monospace';
			ctx.textAlign = 'center';
			ctx.fillText(this.text, this.x + 95, this.y + 68);
			ctx.lineWidth = lw;
		}
	};
	
	buttons.push(Object.create(Button).init(canvas.width / 4, canvas.height * 2/3, "play", function() {gameState = "levelmenu"}));
	buttons.push(Object.create(Button).init(canvas.width * 3/4 - 200, canvas.height * 2/3, "help", function() {gameState = "help"}));
	
	buttons[0].selected = true;
	
	var Ripple = {
		init: function (x, y) {
			this.x = x;
			this.y = y;
			this.dt = 0;
			return this;
		},
		draw: function () {
			ctx.strokeStyle = "rgba(0,0,0," + (100 - this.dt) / 100 + ")";
			ctx.beginPath();
			ctx.rect(this.x * TILESIZE - this.dt, this.y * TILESIZE - this.dt + TILESIZE / 3, TILESIZE + 2*this.dt, TILESIZE + 2 * this.dt, 20);
			ctx.closePath();
			ctx.stroke();
			ctx.strokeStyle = "black";
		},
		update: function () {
			this.dt += 1;
			if (this.dt > 100)
			{
				var ind = effects.indexOf(this);
				effects.splice(ind, 1);
			}
		}
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
			/*
			ctx.beginPath();
			//ctx.globalAlpha = this.fade / this.duration;
			ctx.roundRect(this.x * TILESIZE + lw / 2, this.y * TILESIZE + lw / 2, TILESIZE - lw, TILESIZE - lw, TILESIZE / 4);
			ctx.fillStyle = this.color;
			ctx.fill();
			ctx.stroke();
			ctx.globalAlpha = 1;
			*/
			ctx.drawImage(images['platform'], this.x * TILESIZE, this.y * TILESIZE - TILESIZE / 3, TILESIZE, 1.7*TILESIZE);

		},
		update: function () {}
	};

	// PLATFORM that changes Character direction
	var TurnPlatform = Object.create(Platform);
	TurnPlatform.init = function (x, y, angle) {
		this.x = x, this.y = y, this.angle = angle, this.distance = distance;
		this.color = "rgba(0,200,0,0.5)";
		return this;
	};
	TurnPlatform.draw = function () {
		/*
		ctx.beginPath();
		ctx.roundRect(this.x * TILESIZE + lw / 2, this.y * TILESIZE + lw / 2, TILESIZE - lw, TILESIZE - lw,TILESIZE/4);
		ctx.fillStyle = this.color;
		ctx.fill();
		ctx.stroke();
		*/

		ctx.drawImage(images['platform'], this.x * TILESIZE, this.y * TILESIZE - TILESIZE / 3, TILESIZE, 1.7* TILESIZE);
		
		/*
		ctx.globalAlpha = 0.4;
		ctx.translate(this.x * TILESIZE + TILESIZE /2, this.y * TILESIZE+ TILESIZE /2 );
		ctx.rotate(this.angle);
		ctx.drawImage(arrow_0, -TILESIZE / 3, -TILESIZE / 3, 2 * TILESIZE / 3, 2 * TILESIZE / 3);
		ctx.rotate(-this.angle);
		ctx.translate(- (this.x * TILESIZE + TILESIZE /2), - (this.y * TILESIZE+ TILESIZE /2));
		ctx.globalAlpha = 1;*/
		/*
		ctx.beginPath();
		ctx.arc((this.x + 0.5) * TILESIZE, (this.y + (1/2)) * TILESIZE, TILESIZE / 3,
		this.angle + 7 * Math.PI / 4, this.angle + 1 * Math.PI / 4, false);
		ctx.stroke();
		*/
		//var arrow = 
		
		ctx.fillStyle = "black";
		//ctx.font = "40px bold monospace";
		ctx.font = "40px bold monospace";
		ctx.fillText(arrows[Math.round(this.angle / (Math.PI / 2))], this.x * TILESIZE + TILESIZE / 2, this.y * TILESIZE + 2 * TILESIZE / 3);
		

		
	};
	
	// OBSTACLE solid barrier that can't be jumped over
	var Obstacle = Object.create(Platform);
	Obstacle.draw = function () {
		/*
		ctx.beginPath();
		ctx.roundRect(this.x * TILESIZE + lw / 2, this.y * TILESIZE + lw / 2, TILESIZE - lw, TILESIZE - lw, TILESIZE / 4);
		ctx.fillStyle = this.collidable ? "grey" : "rgba(100,100,100,0.4)";
		ctx.fill();
		ctx.stroke();
		*/
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
		ctx.beginPath();
		ctx.roundRect(this.x * TILESIZE + lw/2, this.y * TILESIZE + lw / 2, TILESIZE - lw, TILESIZE - lw, TILESIZE / 4);
		ctx.fillStyle = this.color;
		ctx.fill();
		ctx.stroke();
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
			/*
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.arc(this.x * TILESIZE + TILESIZE / 2, this.y * TILESIZE + 7 * TILESIZE / 16, 0.4 * this.scale * TILESIZE, 0, Math.PI * 2, true);
			ctx.fillStyle = "rgba(255,50,50,0.5)";
			ctx.fill();
			ctx.stroke();
			ctx.lineWidth = lw;
			*/
			ctx.drawImage(charImages[Math.round(this.angle/(Math.PI / 2))],
			this.frame * TILESIZE, 0, TILESIZE, TILESIZE, // Clipping, for animation frame
			this.x * TILESIZE + (1 - this.scale) * TILESIZE / 2, 
			this.y * TILESIZE  + (1 - this.scale) * TILESIZE - 8,
			this.scale * TILESIZE,
			this.scale * TILESIZE);
		},
		update: function (dt) {
			//animations
			/*
			this.delay -= dt;
			if (this.delay <= 0) {
				this.frame = (this.frame + 1) % this.frames;
				this.delay = this.animationSpeed;
			}*/
			this.frames = charImages[Math.round(this.angle/(Math.PI / 2))].width / TILESIZE;
			
			this.frame = Math.floor((this.frames - 1)* Math.max(this.distance, 0) / this.maxDistance);
			//console.log(this.frame, this.distance, this.maxDistance);
			
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
				if (!p) {
					this.maxDistance = 0;
					sounds['fall'].play();
					setTimeout(reset, 500);
				}
				else {			
					// TRY triggering switch, if it is a switch
					if (p.trigger) p.trigger();
					
					if (p.angle !== undefined) {
						this.angle = p.angle;
						sounds["jump"].play();
					}
				
					//CHECK IF WE SHOULD MOVE
					if (this.distance <= 0) {
						this.distance = 2;
						this.maxDistance = this.distance;
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
			if (obstacles[i].x == Math.floor(dx) && obstacles[i].y == Math.floor(dy)) {
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
//		start = Object.create(Platform).init(c.x, c.y);
//		exit = Object.create(Platform).init(ex, ey);
//		platforms = [start, exit];
//		obstacles = [];
	}

	// Check if Character is at EXIT
	function checkWin() {
		if (c.x === exit.x && c.y === exit.y) {
			if ((currentLevel + 1) > levelCompleted) {
				levelCompleted = (currentLevel + 1);
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
		ctx.font = 'bold 80px monospace';
		ctx.textAlign = 'center';
		ctx.fillStyle = 'black';
		ctx.fillText('loading...', canvas.width/2, canvas.height/2);
	}
	
	function doMainMenu(dt) {
		ctx.clearRect(0,0,canvas.width,canvas.height);
		ctx.font = '80px monospace';
		ctx.textAlign = 'center';
		ctx.fillStyle = 'black';
		ctx.fillText('flat_FORMS', canvas.width/2, canvas.height/2);
		
		for (var i = 0; i < buttons.length; i++)
		{
			buttons[i].draw();
		}
	}
	
	function doLevelMenu(dt) {
		ctx.clearRect(0,0,canvas.width,canvas.height);
		ctx.font = '20px monospace';
		ctx.textAlign = 'center';
		var lvls = 6;
		//ctx.fillStyle = 'black';
		for (var i = 0; i < levels.length; i++)
		{
			/*
			if (i == currentLevel)
				ctx.fillStyle = "rgba(255,0,255,0.5)";
			else
				ctx.fillStyle = "rgba(0,255,255,0.5)";
			ctx.roundRect(2*TILESIZE + (i % lvls) * 2 * TILESIZE, 2 * TILESIZE + Math.floor(i / lvls) * 2 * TILESIZE, TILESIZE, TILESIZE, TILESIZE / 4);
			ctx.fill();
			ctx.stroke();
			ctx.fillStyle = "black";
			*/
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
			ctx.fillText('Level ' + i, 2*TILESIZE + (i % lvls) * 2 * TILESIZE + TILESIZE / 2, 2 * TILESIZE + Math.floor(i / lvls) * 2 * TILESIZE + TILESIZE + 20);
		}
	}
	
	function doSelected() {
		for (var i = 0; i < buttons.length; i++) {
			if (buttons[i].selected) {
				buttons[i].callback();
				sounds['select'].play();
				break;
			}
		}
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
							buttons[selection].selected = false;
							selection = (selection + 1) % buttons.length;
							buttons[selection].selected = true;
							buttonDelay = BUTTON_TIME;
						}
						else if (pad.axes[0] < -0.5) {
							buttons[selection].selected = false;
							selection = ((selection - 1) % buttons.length + buttons.length) % buttons.length;
							buttons[selection].selected = true;
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
							doLevel();
							gameState = "play";
							sounds['select'].play();
							//console.log('here');
						}
						if (pad.axes[0] > 0.5) {
							currentLevel = (currentLevel + 1) % (levelCompleted + 1);
							buttonDelay = BUTTON_TIME;
						}
						else if (pad.axes[0] < -0.5) {
							currentLevel = ((currentLevel - 1) % (levelCompleted + 1) + (levelCompleted + 1)) % (levelCompleted + 1);
							buttonDelay = BUTTON_TIME;
						}
					}
					else {
						buttonDelay -= dt;
					}
				}
				
				if (buttonDelay < 0) {

					if (pad.buttons[9].pressed) { //START
						if (gameState == 'mainmenu')
						{
							gameState = 'play';
						}
						else
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
						window.close();
					} 

					if (choice >= types.length) choice = 0;
					else if (choice < 0) choice = types.length - 1;
				} else {
					buttonDelay -= dt;
				}
			}
		}
	}

	function doHelp(dt) {
	
		ctx.clearRect(0,0,canvas.width, canvas.height);
		ctx.fillStyle = "black";
		ctx.font = "bold 20px monospace";
		ctx.fillText("HELP! I need somebody...", canvas.width/2, canvas.height/2);
	
	}
	
	// do all the updating and drawing, etc.
	function doStuff(dt) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		
		//CURSOR INDICATION
		ctx.globalAlpha = 0.3;
		/*
		ctx.fillStyle = "rgba(100,100,255,0.2)";
		ctx.roundRect(Math.floor(mx) * TILESIZE, Math.floor(my) * TILESIZE, TILESIZE, TILESIZE, TILESIZE / 4);
		ctx.fill();
		*/
		ctx.drawImage(images['platform'], Math.floor(mx) * TILESIZE, Math.floor(my) * TILESIZE - TILESIZE / 3, TILESIZE, TILESIZE * 1.7);
		ctx.font = "40px bold monospace";
		ctx.fillStyle = "black";
		ctx.fillText(arrows[choice], Math.floor(mx) * TILESIZE + TILESIZE / 2, Math.floor(my) * TILESIZE + 2 * TILESIZE / 3);
		ctx.globalAlpha = 1;
		/*
		ctx.beginPath();
		ctx.strokeStyle = "rgba(0,0,0,0.2)";
		ctx.arc((Math.floor(mx) + 0.5) * TILESIZE, (Math.floor(my) + 0.5) * TILESIZE, TILESIZE / 3,
		choice * Math.PI / 2 + 7 * Math.PI / 4, choice * Math.PI / 2 + 1 * Math.PI / 4, false);
		ctx.stroke();
		ctx.strokeStyle = "black";
		*/
		//DRAW/UPDATE
		// (effects)
		for (var i = 0; i < effects.length; i++)
		{
			effects[i].draw();
			effects[i].update();
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
		ctx.font = "bold 20px monospace";
		ctx.textAlign = "center";
		ctx.fillText("EXIT", (exit.x + 0.5) * TILESIZE, (exit.y + 0.65) * TILESIZE);

		/*
		for (var i = 0; i < platforms.length; i++) {
			platforms[i].draw();
			platforms[i].update();
		}
		for (var i = 0; i < obstacles.length; i++) {
			obstacles[i].draw();
		}
		*/
		if (START) {
			c.update(dt);
		}
		c.draw();
		
		//SCROLLING BG
		by -= 0.3;
		canvas.style.backgroundPosition = "0px " + by + "px";

		//roundRect(10,10,100,100,20);
		//ctx.stroke();
		
		//CHECK WIN
		if (checkWin()) {
			currentLevel++;
			gameState = "levelmenu";
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
		
		window.requestAnimationFrame(step);
	}

	//... awkward way for choosing platform to create
	var types = [TurnPlatform, TurnPlatform, TurnPlatform, TurnPlatform];
	var choice = 1;

	// create a platform at the given cursor
	function addPlatform() {
		if (findPlatform(mx, my) === undefined && findObstacle(mx, my) === undefined) {
			var p1 = Object.create(types[choice]).init(Math.floor(mx), Math.floor(my), Math.PI * choice / 2);
			platforms.push(p1);
			/*
			var e1 = Object.create(Ripple).init(Math.floor(mx), Math.floor(my));
			effects.push(e1);*/
		}
	}
	
	function addObstacle() {
		if (findPlatform(mx, my) === undefined && findObstacle(mx, my) === undefined) {
			var o1 = Object.create(Obstacle).init(Math.floor(mx),Math.floor(my));
			obstacles.push(o1);
		}
	}
	
	/* MOUSE BEHAVIOR
	canvas.addEventListener("click", function (e) {
		addPlatform();
	});

	canvas.addEventListener("mousemove", function (e) {
		mx = Math.floor(e.offsetX / TILESIZE);
		my = Math.floor(e.offsetY / TILESIZE);
	});*/

	//INITIALIZE
	//reset();

	//SAMPLE PLATFORMS
	platforms.push(Object.create(TurnPlatform).init(2, 4, Math.PI));
	platforms.push(Object.create(TurnPlatform).init(0, 4, Math.PI / 2));
	
	obstacles.push(Object.create(Obstacle).init(6,4));
	
	var s = Object.create(Switch).init(3, 4, obstacles[0]);
	//console.log(JSON.stringify(s));
	
	//GET GOING
	window.requestAnimationFrame(step);

};
