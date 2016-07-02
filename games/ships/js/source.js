/*
 - save/load game, autosave and death handling (repair)
 - solid behavior work for side-to-side (maybe use center point?)
 - ingame menu
 - levels & enemies
 - effects & music - invert colors (flicker), sounds, MUSIC
 - upgrades: weapons, movement, etc.
 	- weapons different for different directions ('slots' - bomb, missile, laser, etc.)
 - polish
 - certain endings unlock 'sandbox' open-ended level progression ('freedom' endings), local multiplayer?

 BUG: sometimes will fall through ground, become trapped.
 BUG: wrapping from 0 to max_width 'jumps' - is not smooth
 FIX: gamepad sensitivity - should detect strongest direction, not first triggered 
*/
var debug = {};

window.addEventListener("DOMContentLoaded", function (e) {
	var canvas = document.getElementById("mygame");
	var ctx = canvas.getContext("2d");
	var buf = canvas.getContext("2d");

	// context setup

	ctx.imageSmoothingEnabled = false;
	ctx.font = "20px Teko";
	ctx.textAlign = "center";

	// Helpers

	function clamp (n, min, max) {
		return Math.max(Math.min(n, max), min);
	}

	function distance (o1, o2) {
		return Math.sqrt(Math.pow(o1.x - o2.x, 2) + Math.pow(o1.y - o2.y, 2));
	}

	// Globals

	var GLOBALS = {
		scale: 3,
		invulnerability: 0.3
	};

	var STATE = {
		menu: 0,
		play: 1
	};

	var SPEED = {
		// max speeds
		ship: 200,
	    projectile: 330,
	    // acceleration multipliers
	    acel: 0.1,
	    decel: 0.01,
	    gravity: 0.1
	};

	var TYPE = {
		player: 0,
	    enemy: 1,
	    neutral: 2,
	    obstacle: 3
	};

	var CLASS = {
		none: 0,
		ship: 1,
	    projectile: 2,
	    solid: 3,
	    item: 4
	};

	var DIRECTION = {
		right: 0,
		up: 1,
		left: 2,
		down: 3
	};

	var KEYCODES = {
		37: "left",
	    38: "up",
	    39: "right",
	    40: "down",
	    65: "a",
	    68: "d",
	    83: "s",
	    87: "w",
	    80: "p"
	};


	var Resources = {};
	var resourceInfo = [
		{path: "ship.png", frames: 5, speed: 0.2},
		{path: "a.png"},
		{path: "laser.png"},
		{path: "item.png"},
		{path: "itemHeal.png"},
		{path: "asteroid.png"},
		{path: "bg.png"},
		{path: "projectile.png"},
		{path: "shoot.ogg"},
		{path: "hit.ogg"},
		{path: "ground.png"},
		{path: "scenes.js"},
		{path: "bomb.png", frames: 3, speed: 0.3}
	];

	function loadScenes(data) {
		data = JSON.parse(data);
		console.log(data);

	}

	var Scene = {
		init: function (player, camera, controls, condition, messages) {
	        this.entities = [];
	        this.doControls = controls;
	    	this.player = player;
	        this.camera = camera;
	        this.entities.push(player);
	        this.condition = condition;
	        this.time = 0;
	        this.messages = messages || {};
	        this.message = "";
			this.width = Resources.bg.image.width * 4;
			for (var i = 0; i < this.width; i += Resources.ground.image.width * GLOBALS.scale) {
				var e = Object.create(TiledBackground).init(i, canvas.height - 24, TYPE.obstacle, Resources.ground);
				this.entities.push(e);
			}
	        return this;
	    },
	    update: function (dt) {
	    	for (var i = 0; i < this.entities.length; i++) {
	        	this.entities[i].update(dt);

	        	if (this.entities[i].x < 0) this.entities[i].x = this.width;
	        	else if (this.entities[i].x > this.width) this.entities[i].x = 0;
	        }

			//wrap camera

	        this.camera.update(dt, this.player);
	        if (this.player.x < 0 + Resources.bg.image.width / 2) {
	        	this.camera.x = Math.floor(this.player.x + this.width - canvas.width / 2);
	        }

	        this.doControls();
	        this.spawn();
	        this.time += dt;
	        if (this.messages[Math.floor(this.time)]) {
	        	this.message = this.messages[Math.floor(this.time)];
	        }
	    },
	    animate: function (dt) {
	    	for (var i = 0; i < this.entities.length; i++) {
	    		if (this.entities[i].maxFrame > 0) {
	    			this.entities[i].animate(dt);
	    		}
	    	}
	    },
	    drawBG: function (ctx) {
	    	for (var i = 0; i <= this.width; i += Resources.bg.image.width) {
	        		ctx.drawImage(Resources.bg.image, i, canvas.height / 2 - Resources.bg.image.height / 2);
			}
	    },
	    draw: function (ctx) {
	        ctx.clearRect(0,0,canvas.width,canvas.height);
	        ctx.save();
	        this.camera.draw(ctx);
	        this.drawBG(ctx);
	        var wrapX =  0 + Resources.bg.image.width;
	        var copyX = this.width + Resources.bg.image.width;
	        for (var i = 0; i < this.entities.length; i++) {
	        	this.entities[i].draw(ctx);
	        	if (this.entities[i].x < wrapX) {
	        		this.entities[i].drawOffset(ctx, copyX - (wrapX - this.entities[i].x), this.entities[i].y);
	        	}
	        }
	        ctx.restore();
	    },
	    add: function (obj) { this.entities.push(obj); },
	    remove: function (i) { this.entities.splice(i, 1); },
	    collide: function () {
	    	for (var i = 0; i < this.entities.length; i++) {
	        	for (var j = i + 1; j < this.entities.length; j++) {
	            	if (this.checkCollision(this.entities[i], this.entities[j])) {
	                	this.entities[i].collided(this.entities[j]);
	                    this.entities[j].collided(this.entities[i]);
	                }
	            }
	        }
	    },
	    checkCollision: function (m, n) {
	    	var o1 = m, o2 = n;
	    	if (!m.collideable || !n.collideable) return false;
	    	if (m.type == n.type) return false;
			var n_data = n.imageData;
			var m_data = m.imageData;
	        m = {x: m.getBoundX(), y: m.getBoundY(), w: m.w, h: m.h};
	        n = {x: n.getBoundX(), y: n.getBoundY(), w: n.w, h: n.h};
			if (m.x + m.w < n.x || m.x > n.x + n.w)
				return false;
			if (m.y + m.h < n.y || m.y > n.y + n.h)
				return false;
			var minX = Math.max(m.x, n.x), minY = Math.max(m.y, n.y);
			var maxX =  Math.min(m.x + m.w, n.x + n.w), maxY = Math.min(m.y + m.h, n.y + n.h);
			
	/**					************************					**/
	/**					Compare in overlap range					**/
	/**					(Pixel by pixel, if not 					**/
	/**					transparent i.e. 255)   					**/
	/**					************************					**/

			for (var j = 0; j < maxY - minY; j++)
			{
				for (var i = 0; i < maxX - minX; i++)
				{
					var my = ((minY - m.y) + j) * m.w * 4,
						mx = ((minX - m.x) + i) * 4 + 3;
					var ny = ((minY - n.y) + j) * n.w * 4,
						nx = ((minX - n.x) + i) * 4 + 3;
					if (m_data[my + mx] == 255 && n_data[ny + nx] == 255)
					{
					
	/**					************************					**/
	/**					PUSH OUT FROM EACH OTHER					**/
	/**					************************					**/
/*
						o1.x = m.x < n.x ? o1.x - 1 : o1.x + 1;
						o2.x = n.x < m.x ? o2.x - 1 : o2.x + 1;
						o1.y = m.y < n.y ? o1.y - 1 : o1.y + 1;
						o2.y = n.y < m.y ? o2.y - 1 : o2.y + 1;*/
						return true;
					}
				}
			}
			return false;

	    },
	    checkCollisionOld: function (o1, o2) {
	        o1 = {x: o1.x - o1.w/2, y: o1.y - o1.h/2, w: o1.w, h: o1.h};
	        o2 = {x: o2.x - o2.w/2, y: o2.y - o2.h/2, w: o2.w, h: o2.h};        
	    	if (o1.x + o1.w > o2.x && o1.x < o2.x + o2.w) {
	        	if (o1.y + o1.h > o2.y && o1.y < o2.y + o2.h) {
	            	return true;
	            }
	        }
	        return false;
	    },
	    cleanUp: function () {
	    	for (var i = 0; i < this.entities.length; i++) {
	        	if (this.entities[i].health <= 0) {
	        		this.entities[i].death();
	            	this.remove(i);
	            }
	        }
	    },
	    spawn: function () {
	    	if (Math.random() * 300 < 0) {
	        	var e = Object.create(Entity).init(Math.random() * this.width, Math.random() * canvas.height, TYPE.enemy, Resources.asteroid);
	        	e.health = 2;
	            e.velX = Math.random() * SPEED.projectile - SPEED.projectile / 2;
	            e.velY = Math.random() * SPEED.projectile - SPEED.projectile / 2;
	            //debug = e;
	            this.add(e);
	        } else if (Math.random() * 300 < 1) {
	        	var e = Object.create(Ship).init(world.player.x + canvas.width / 4, Math.random() * canvas.height - 40, TYPE.enemy, Resources.ship);
	        	e.health = 2;
	        	e.velX = Math.random() * SPEED.ship - SPEED.ship / 2;
	        	e.velY = Math.random() * SPEED.ship - SPEED.ship / 2;
	        	e.doWeapons = function (dt) {
	        		if (this.cooldown > 0) return;
	        		if (distance(this, world.player) > canvas.width / 2) return;
	        		var dx = e.x - world.player.x, dy = e.y - world.player.y;
	        		var p = Object.create(Projectile).init(this.x, this.y, this.type, Resources.projectile);
	        		if (Math.abs(dx) > Math.abs(dy)) {
	        			p.velX = dx > 0 ? - SPEED.projectile : SPEED.projectile;
	        		} else {
	        			p.velY = dy > 0 ? - SPEED.projectile : SPEED.projectile;
	        		}
	        		world.add(p);
	        		this.cooldown = 1.2;
	        	};
	        	this.add(e);
	        	debug = {player: world.player, enemy: e};
	        }
	    }
	}

	var controls = {
		autoHorizontal: function () {
			this.player.velX = SPEED.ship;
			this.player.acelY = SPEED.acel * SPEED.ship * (world.keys.s - world.keys.w) - !(world.keys.s || world.keys.w) * SPEED.decel * this.player.velY;
		},
		dir4Gravity: function () {
			this.player.acelY = SPEED.acel * SPEED.ship * (world.keys.s - world.keys.w) - !(world.keys.s || world.keys.w) * SPEED.decel * this.player.velY;
			this.player.acelX = SPEED.acel * SPEED.ship * (world.keys.d - world.keys.a) - !(world.keys.d || world.keys.a) * SPEED.decel * this.player.velX;
			this.player.acelY += SPEED.gravity * SPEED.ship / 2;
		},
		dir4: function () {
			this.player.acelY = SPEED.acel * SPEED.ship * (world.keys.s - world.keys.w) - !(world.keys.s || world.keys.w) * SPEED.decel * this.player.velY;
			this.player.acelX = SPEED.acel * SPEED.ship * (world.keys.d - world.keys.a) - !(world.keys.d || world.keys.a) * SPEED.decel * this.player.velX;
		} 
	};

	var conditions = {
		time: function (limit) {
			return function () { return this.time > limit; };
		},
		horizontal: function (limit) {
			return function () { return this.player.x > limit; };
		},
		vertical: function (limit) {
			return function () { return this.player.y > limit; };
		},
		health: function (limit) {
			return function () { return this.player.health < limit; };
		}
	};

	var World = {
		paused: 0,
		gameState : STATE.menu,
	    currentScene : 0,
	    keys: {up: false, down: false, right: false, left: false, a: false, s: false, d: false, w: false, p: false},
		loadResources: function (resourceInfo) {

			this.setupControls();
			this.resourceLoadCount = 0;
			this.resourceCount = resourceInfo.length;
			ctx.fillStyle = "gray";
			ctx.fillRect(canvas.width / 2 - 25 * this.resourceCount + i * 50, canvas.height / 2 - 12, 50, 25);			
			ctx.fillText("loading...", canvas.width / 2, canvas.height / 2 - 50);
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
			var n = Math.floor((canvas.width - 50) / this.resourceCount);
			ctx.fillStyle = "black";
			ctx.fillRect(25 + this.resourceLoadCount * n, canvas.height / 2 - 12, n, 25);
			this.resourceLoadCount += 1;
			if (this.resourceLoadCount >= this.resourceCount) {
				setTimeout( function () {
					initialize();
				}, 100);
			}
		},
		loadScenes: function () {
			var data = JSON.parse(this.sceneInfo);
			this.scenes = [];
			this.currentScene = data.start;
			var data = data.scenes;
			for (var i = 0; i < data.length; i++) {
				var camera = Object.create(Camera);
				var s = Object.create(Scene).init(this.player, camera, controls[data[i].controls], conditions[data[i].condition.type](data[i].condition.value), data[i].messages);
				this.scenes.push(s);
			}
		},
		init: function () {	        
  	        this.player = Object.create(Ship).init(canvas.width/2, canvas.height/2, TYPE.player, Resources.ship);
			this.player.setWeapon("up", Object.create(Projectile).init(0,0,TYPE.player,Resources.projectile));
			this.player.setWeapon("down", Object.create(Bomb).init(0,0,TYPE.player, Resources.bomb));
			this.player.setWeapon("right", Object.create(Projectile).init(0,0,TYPE.player,Resources.projectile));
			this.player.setWeapon("left", Object.create(Projectile).init(0,0,TYPE.player,Resources.projectile));
			this.loadScenes();

			var p = Object.create(Projectile).init(0,0,0,Resources.laser);
			this.Items = {
				laser: {
					image: Resources.item,
					carrying: {
						direction: "left",
						weapon: p
					}
				},
				heal: {
					image: Resources.itemHeal,
					carrying: {
						health: 2
					}
				}
			};
	        /*this.scenes = [];
	        for (var i = 0; i < sceneInfo.length; i++) {
	            var camera = Object.create(Camera);
	        	var s = Object.create(Scene).init(this.player, camera, sceneInfo[i].controls, sceneInfo[i].condition, sceneInfo[i].messages);
	            this.scenes.push(s);
	        }*/
	        return this;
	    },
	    setupControls: function () {
	        var w = this;
	        window.addEventListener("keydown", function (e) {
	            w.keys[KEYCODES[e.keyCode]] = true;
	        });
	        window.addEventListener("keyup", function (e) {
	            w.keys[KEYCODES[e.keyCode]] = false;
	        });
	    },
	    message: function (ctx, message) {
	    	if (message.length <= 0) return;
	    	ctx.textAlign = "right";
	    	ctx.fillStyle = "black";
	    	ctx.beginPath();
	    	var w = ctx.measureText(message).width;
	    	ctx.moveTo(canvas.width - ( w + 25), 0);
	    	ctx.lineTo(canvas.width - ( w + 35), 30);
	    	ctx.lineTo(canvas.width, 30);
	    	ctx.lineTo(canvas.width, 0);
	    	ctx.closePath();
	    	ctx.fill();
	    	ctx.fillStyle = "white";
	    	ctx.fillText(message, canvas.width - 10, 20);
	    	ctx.fillStyle = "black";
	    },
	    mainMenu: function (ctx) {
	    	ctx.clearRect(0,0,canvas.width,canvas.height);
	    	ctx.fillStyle = "black";
	    	ctx.font = "60px Teko";
	    	ctx.fillText("Final Frontier", canvas.width/2, canvas.height/2);
	    	ctx.font = "20px Teko";
	    	ctx.fillText("Press            to begin.", canvas.width / 2 + 62, canvas.height / 2 + 25);
	    	ctx.drawImage(Resources.a.image, canvas.width / 2 + 40, canvas.height / 2 + 6, GLOBALS.scale * Resources.a.image.width, GLOBALS.scale * Resources.a.image.height);
	    	if (this.keys.p) {
	    		this.gameState = STATE.play;
	    	}
	    },
	    gui: function (ctx) {
	    	for (var i = 0; i < 10; i++) {
	    		if (i < this.player.health) {
	    			ctx.fillStyle = "black";
	    		} else {
	    			ctx.fillStyle = "gray";
	    		}
	    		ctx.fillRect(10 + i * 12, 10, 10, 10);
	    	}
	    	this.message(ctx, this.scenes[this.currentScene].message);
	    },
	    run: function (dt, ctx) {
	    	var gamepads = navigator.getGamepads();
	        this.pad = gamepads[0];
	    	if (this.pad) {
	    		//movement
	    		this.keys.w = this.pad.axes[1] < -0.5;
	    		this.keys.s = this.pad.axes[1] > 0.5;
	    		this.keys.a = this.pad.axes[0] < -0.5;
	    		this.keys.d = this.pad.axes[0] > 0.5;
	    		//shooting
	    		this.keys.up = this.pad.axes[3] < -0.5;
	    		this.keys.down = this.pad.axes[3] > 0.5;
	    		this.keys.left = this.pad.axes[2] < -0.5;
	    		this.keys.right = this.pad.axes[2] > 0.5;
	    		if (this.gameState == STATE.menu) {
	    			this.keys.p = this.pad.buttons[0].pressed;
	    		}
	    	}
	    	if (this.gameState == STATE.play) {
	    		if (this.paused > 0) {
	    			this.paused -= dt;
	    		} else {
			        this.scenes[this.currentScene].update(dt);
			        this.scenes[this.currentScene].animate(dt);
			    	this.scenes[this.currentScene].draw(ctx);
			    	this.scenes[this.currentScene].collide();
			    	this.scenes[this.currentScene].cleanUp();

			    	this.gui(ctx);

			        // "victory" condition, move to next scene
			        if (this.scenes[this.currentScene].condition()) {
			        	this.currentScene += 1;
			        }
			    }
	    	} else if (this.gameState == STATE.menu) {
	    		this.mainMenu(ctx);
	    	}
	    },
	    add: function (obj) {
	    	this.scenes[this.currentScene].add(obj);
	    },
	    pause: function (n) {
	    	this.paused = n;
	    },
	    shake: function (n) {
			this.scenes[this.currentScene].camera.shake(20);
	    }
	}

	var Entity = {
		h: 40, w: 40, velX: 0, velY: 0, cooldown: 0, class: CLASS.ship,
	    health: 10, damage: 1, acelX: 0, acelY: 0, collideable: true,
	    invulnerable: 0,
	    init: function (x, y, type, sprite) {
	    	this.x = x, this.y = y, this.type = type;
	    	if (sprite) {
		    	this.sprite = sprite, this.h = this.sprite.image.height * GLOBALS.scale, this.w = this.sprite.image.width * GLOBALS.scale / this.sprite.frames;
		    	this.frame = 0, this.maxFrame = this.sprite.frames, this.frameDelay = this.sprite.speed, this.maxFrameDelay = this.sprite.speed;
		    	this.imageData = this.getImageData(buf);
		    }
	        return this;
	    },
	    getBoundX: function () { return Math.floor(this.x - this.w/2); },
	    getBoundY: function () { return Math.floor(this.y - this.h/2); },
	    getImageData: function (ctx) {
	    	ctx.clearRect(0,0,canvas.width,canvas.height);
	    	ctx.drawImage(this.sprite.image, 0, 0 ,this.w / GLOBALS.scale, this.h / GLOBALS.scale, 0, 0, this.w, this.h);
	    	return ctx.getImageData(0, 0 ,this.w, this.h).data;
	    },
	    draw: function (ctx) {
	        ctx.drawImage(this.sprite.image, 
	        	this.frame * this.w / GLOBALS.scale, 0, 
	        	this.w / GLOBALS.scale, this.h / GLOBALS.scale, 
	        	Math.round(this.x - this.w / 2), this.y - Math.round(this.h / 2), this.w, this.h);
	    },
	    drawOffset: function (ctx, x, y) {
	    	var tempX = this.x, tempY = this.y;
	    	this.x = x, this.y = y;
	    	this.draw(ctx);
	    	this.x = tempX, this.y = tempY;
	    },
	    animate: function (dt) {
	    	this.frameDelay -= dt;
	    	if (this.frameDelay <= 0) {
	    		this.frameDelay = this.maxFrameDelay;
	    		this.frame = (this.frame + 1) % this.maxFrame;
	    	}
	    },
	    update: function (dt) {
	    	if (this.invulnerable > 0) this.invulnerable -= dt;
	    	this.velX = clamp(this.velX + this.acelX, -SPEED.ship, SPEED.ship);
	    	this.velY = clamp(this.velY + this.acelY, -SPEED.ship, SPEED.ship);
	    	this.x = this.x + this.velX * dt;
	        this.y = clamp(this.y + this.velY * dt, this.h / 2, canvas.height - this.h / 2);// - 24);
	        if (this.cooldown > 0) {
		        this.cooldown -= dt;
	        }
	        this.doWeapons(dt);
	    },
	    doWeapons: function (dt) {},
	    collided: function (obj) {
	    	if (obj.type != this.type && obj.type != TYPE.neutral && this.invulnerable <= 0) {
	        	this.health -= obj.damage;
	        	if (this.class != CLASS.projectile) {
	        		var s = Resources.hit.sound.cloneNode();
	        		s.play();
	        	}
	        	this.invulnerable = GLOBALS.invulnerability;
	        	if (this == world.player) {
	        		world.pause(0.05);
	        		world.shake(10);
	        		canvas.style.webkitFilter = "invert(100%)";
	        		setTimeout(function () {
	        			canvas.style.webkitFilter = "invert(0%)";
	        		}, 100);
	        	}
	        }
	        if (obj.type == TYPE.obstacle) {
				this.x = this.getBoundX() < obj.getBoundX() ? this.x - 1 : this.x + 1;
				this.y = this.getBoundY() < obj.getBoundY() ? this.y - 1 : this.y + 1;
	        	this.velY = this.getBoundY() < obj.getBoundY() ? Math.min(0, this.velY) : Math.max(0, this.velY);
	        	//this.velY *= -1;
	        }
	    },
	    death: function () {
	    	var t = this;
	    	var w = this.w, h = this.h;
        	var p = Object.create(ParticleEffect).init(this.x, this.y, 10,
    		function () {
    			this.health = 1.5,
		    	this.velX = /*-t.velX / 4;*/Math.random() * SPEED.ship / 2 - SPEED.ship / 4,
		    	this.velY = /*-t.velY / 4;*/Math.random() * SPEED.ship / 2 - SPEED.ship / 4;
    		},
    		function (ctx) { 
    			/*
    			ctx.strokeStyle = "rgba(0,0,0," + this.health / 2 + ")";
    			ctx.lineWidth = 3;
    			var theta = Math.atan2(t.velY, t.velX) + Math.PI;
    			ctx.beginPath();
    			ctx.arc(this.x, this.y, 24, theta - Math.PI / 6, theta + Math.PI / 6, false);
    			ctx.stroke();*/
    			ctx.fillStyle = "rgba(0,0,0," + this.health / 2 + ")";
    			ctx.fillRect(this.x - w/2, this.y - h/2, w, h);
    		},
    		function (dt) {
    			this.health -= dt;
    			this.x += this.velX * dt;
    			this.y += this.velY * dt;
    		});
    		world.add(p);
    		if (this.type == TYPE.enemy && this.class == CLASS.ship) {
    			if (Math.random() * 100 < 50) {
    				var cc = Math.random() > 0.5 ? "laser" : "heal";
    				var item = Object.create(Item).init(this.x, this.y, TYPE.neutral, world.Items[cc].image);
    				console.log(world.Items[cc].image, cc, world.Items[cc], Resources.itemHeal);
    				item.acelY = this.y > canvas.width / 2 ? -SPEED.gravity : SPEED.gravity;
    				item.carrying = world.Items[cc].carrying;
    				world.add(item);
    			}
    			Resources.shoot.sound.cloneNode().play();
    			world.pause(0.1);
    			world.shake(20);
    		}
	    }
	};

	var Ship = Object.create(Entity);
	Ship.weapons = {up: null, down: null, right: null, left: null};
	Ship.setWeapon = function (slot, projectile) {
		this.weapons[slot] = projectile;
	};
	Ship.doWeapons = function (dt) {
		if (this.cooldown > 0) return;
		for (w in this.weapons) {
			if (world.keys[w] && this.weapons[w]) {
				var p = Object.create(this.weapons[w]).init(this.x, this.y, this.type);
				p.setup(w);
				world.add(p);
				this.cooldown = p.cooldown;
				break;
			}
		}
	};

	var TiledBackground = Object.create(Entity);
	TiledBackground.class = CLASS.solid;
	TiledBackground.type = TYPE.obstacle;
	TiledBackground.damage = 0;
	TiledBackground.health = 100000000;
	TiledBackground.collided = function (obj) {
	};
	TiledBackground.update = function (dt) {
	};

	var Projectile = Object.create(Entity);
	Projectile.class = CLASS.projectile;
	Projectile.health = 1;
	Projectile.duration = 3;
	Projectile.cooldown = 0.3;
	Projectile.collided = function (obj) {
        if (obj.type != this.type) {
        	this.health  -= obj.damage;
        }
        if (obj.type == TYPE.obstacle) {
        	this.health = 0;
        }
	};
	Projectile.update = function (dt) {	
		this.duration -= dt;
    	this.x = this.x + this.velX * dt;
        this.y = this.y + this.velY * dt;
        if (this.y > canvas.height + this.h / 2 || this.y < - this.h / 2 ) {
        	this.health = 0;
        }
        if (this.duration <= 0) {
        	this.health = 0;
        }
    };
    Projectile.setup = function (direction) {
		this.velY = direction == "down" ? SPEED.projectile : direction == "up" ? - SPEED.projectile : 0;
		this.velX = direction == "right" ? SPEED.projectile : direction == "left" ? - SPEED.projectile : 0;
    };

    var Bomb = Object.create(Projectile);
    Bomb.damage = 2;
    Bomb.cooldown = 1;
    Bomb.setup = function () {
    	this.velX = 0;
    	this.velY = 0;
        this.acelY = SPEED.gravity * SPEED.projectile / 10;
    };
    Bomb.update = function (dt) {
    	this.x = this.x + this.velX * dt;
        this.y = this.y + this.velY * dt;
        this.velY += this.acelY;
    };

 
	var Item = Object.create(Bomb);
	Item.type = TYPE.neutral;
	Item.class = CLASS.item;
	Item.damage = 0;
	Item.invulnerable = 10;
	Item.carrying = null;
	Item.collided = function (obj) {
		if (obj.type == TYPE.player && obj.class == CLASS.ship) {
			if (!this.carrying) {}
			else if (this.carrying.weapon) {
				obj.weapons[this.carrying.direction] = this.carrying.weapon;
			}
			else if (this.carrying.health) {
				obj.health = clamp(obj.health + this.carrying.health, 0, 10);
			}
			this.health = 0;
		}
	};

    var ParticleEffect = Object.create(Entity);
    ParticleEffect.class = CLASS.none;
    ParticleEffect.type = TYPE.neutral;
    ParticleEffect.damage = 0;
    ParticleEffect.collideable = false;
    ParticleEffect.collided = function () {};
    ParticleEffect.update = function (dt) {
    	for (var i = 0; i < this.particles.length; i++) {
    		this.particles[i].update(dt);
    	}
    	for (var i = 0; i < this.particles.length; i++) {
    		if (this.particles[i].health <= 0) {
    			this.particles.splice(i, 1);
    		}
    	}
    	this.health = this.particles.length;
    };
    ParticleEffect.draw = function (ctx) {
    	for (var i = 0; i < this.particles.length; i++) {
    		this.particles[i].draw(ctx);
    	}
    };
    ParticleEffect.drawOffset = function (ctx, x, y) {
    	var ox = x - this.x, oy = y - this.y;
    	for (var i = 0; i < this.particles.length; i++) {
    		this.particles[i].drawOffset(ctx, this.particles[i].x + ox, this.particles[i].y + oy);
    	}
    };
    ParticleEffect.init = function (x, y, pnum, psetup, pdraw, pupdate) {
    	this.x = x, this.y = y, this.particles = [];
    	for (var i = 0; i < pnum; i++) {
    		var p = Object.create(Particle).init(x, y, psetup, pdraw, pupdate);
    		this.particles.push(p);
    	}
    	return this;
    };
    ParticleEffect.death = function () {};

    var Particle = Object.create(Entity);
    Particle.init = function (x, y, setup, draw, update) {
    	this.x = x, this.y = y, this.draw = draw, this.update = update, this.setup = setup;
    	this.setup();
    	return this;
    };

	var Camera = Object.create(Entity);
	Camera.type = TYPE.neutral, Camera.x = 0, Camera.y = 0;
	Camera.draw = function (ctx) {
		ctx.translate(-this.x,-this.y);
	};
	Camera.update = function (dt, player) {
		this.x = Math.floor(player.x - canvas.width/2);
		//this.y += (player.y) * dt;
	};
	Camera.shake = function (n) {
		if (n == 0) {
			this.x =  Math.floor(world.player.x - canvas.width/2), 
			this.y =  0;
			return;
		}
		var c = this;
		setTimeout(function () {
			c.x += Math.random() * 10 - 5;
			c.y += Math.random() * 10 - 5;
			c.shake(n - 1);
		}, 10)
	};

	var world = Object.create(World);
	world.loadResources(resourceInfo);

	var startTime = new Date();
	function step() {
	    var newTime = new Date();
	    var dt = (newTime - startTime) / 1000;
	    startTime = newTime;
		
	    world.run(dt, ctx);
	    
	    window.requestAnimationFrame(step);
	}

	function initialize() {
		world.init();
		startTime = new Date();
		window.requestAnimationFrame(step);
	}
});