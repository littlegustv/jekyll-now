/*
 - ground & sky (visible?)
 - ingame menu
 - levels & enemies
 - effects & music
 - upgrades: weapons, movement, etc.
 - polish
 - certain endings unlock 'sandbox' open-ended level progression ('freedom' endings)
*/
var debug = {};

window.addEventListener("DOMContentLoaded", function (e) {
	var canvas = document.getElementById("mygame");
	var ctx = canvas.getContext("2d");
	var buf = canvas.getContext("2d");

	// context setup

	ctx.imageSmoothingEnabled = false;
	ctx.font = "20px Teko";
	ctx.textAlign = "right";

	// Helpers

	function clamp (n, min, max) {
		return Math.max(Math.min(n, max), min);
	}

	// Globals

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
	    neutral: 2
	};

	var CLASS = {
		none: 0,
		ship: 1,
	    projectile: 2,
	    obstacle: 3
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
		{path: "asteroid.png"},
		{path: "bg.png"},
		{path: "projectile.png"},
		{path: "shoot.ogg"}
	];
	var resourceLoadCount = 0;
	
	for (var i = 0; i < resourceInfo.length; i++ ) {
		ctx.fillStyle = "gray";
		ctx.fillRect(canvas.width / 2 - 25 * resourceInfo.length + i * 50, canvas.height / 2 - 12, 50, 25);
		var res = resourceInfo[i].path;
		var name = res.substring(0, res.length - 4);
		var ext = res.substring(res.length - 4, res.length);
		if (ext == ".png") {
			Resources[name] = {image: new Image(), frames: resourceInfo[i].frames || 1, speed: resourceInfo[i].speed || 1};
			Resources[name].image.src = "res/" + res;
			Resources[name].image.onload = function () {
				ctx.fillStyle = "black";
				ctx.fillRect(canvas.width / 2 - 25 * resourceInfo.length + resourceLoadCount * 50, canvas.height / 2 - 12, 50, 25);
				resourceLoadCount += 1;
				if (resourceLoadCount >= resourceInfo.length) {
					initialize();
				}
			}
		}
		else if (ext == ".ogg") {
			Resources[name] = {sound: new Audio("res/" + res, streaming=false)};
			ctx.fillStyle = "black";
			ctx.fillRect(canvas.width / 2 - 25 * resourceInfo.length + resourceLoadCount * 50, canvas.height / 2 - 12, 50, 25);
			resourceLoadCount += 1;
			Resources[name].sound.onload = function () {
				console.log("loaded sound");
			}
		}
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
	        return this;
	    },
	    update: function (dt) {
	    	for (var i = 0; i < this.entities.length; i++) {
	        	this.entities[i].update(dt);

	        	if (this.entities[i].x <  - this.width / 2) this.entities[i].x = this.width / 2 - (- this.width / 2 - this.entities[i].x);
	        	else if (this.entities[i].x >  this.width / 2) this.entities[i].x =  - this.width / 2 + (this.entities[i].x - this.width / 2);
	        }

			//wrap camera

	        this.camera.update(dt, this.player);
	        if (this.player.x < - this.width / 2 + Resources.bg.image.width / 2) {
	        	this.camera.x = Math.floor(this.player.x + this.width - canvas.width / 2);
	        }

	        this.doControls();
	        this.spawn();
	        this.time += dt;
	        if (this.messages[Math.floor(this.time)]) {
	        	this.message = this.messages[Math.floor(this.time)];
	        }
	    },
	    drawBG: function (ctx) {
	    	for (var i = - this.width / 2; i <= this.width / 2; i += Resources.bg.image.width) {
	        		ctx.drawImage(Resources.bg.image, i, canvas.height / 2 - Resources.bg.image.height / 2);
			}
	    },
	    draw: function (ctx) {
	        ctx.clearRect(0,0,canvas.width,canvas.height);
	        ctx.save();
	        this.camera.draw(ctx);
	        this.drawBG(ctx);
	        var wrapX =  - this.width / 2 + Resources.bg.image.width;
	        var copyX = this.width / 2 + Resources.bg.image.width;
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
	    	if (!m.collideable || !n.collideable) return false;
	    	if (m.type == n.type) return false;
			var n_data = n.imageData;
			var m_data = m.imageData;
	        m = {x: Math.floor(m.x - m.w/2), y: Math.floor(m.y - m.h/2), w: m.w, h: m.h};
	        n = {x: Math.floor(n.x - n.w/2), y: Math.floor(n.y - n.h/2), w: n.w, h: n.h};
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
						console.log("here");
					
	/**					************************					**/
	/**					PUSH OUT FROM EACH OTHER					**/
	/**					************************					**/

						m.x = m.x < n.x ? m.x - 1 : m.x + 1;
						n.x = n.x < m.x ? n.x - 1 : n.x + 1;
						m.y = m.y < n.y ? m.y - 1 : m.y + 1;
						n.y = n.y < m.y ? n.y - 1 : n.y + 1;
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
	    	if (Math.random() * 300 < 1) {
	        	var e = Object.create(Entity).init(Math.random() * this.width - this.width / 2, Math.random() * canvas.height, TYPE.enemy, Resources.asteroid);
	        	e.health = 2;
	            e.velX = Math.random() * SPEED.projectile - SPEED.projectile / 2;
	            e.velY = Math.random() * SPEED.projectile - SPEED.projectile / 2;
	            this.add(e);
	        }
	    }
	}

	var sceneInfo = [
		{
			controls: function () {
				this.player.velX = SPEED.ship;
				this.player.acelY = SPEED.acel * SPEED.ship * (world.keys.s - world.keys.w) - !(world.keys.s || world.keys.w) * SPEED.decel * this.player.velY;
			},
			condition: function () {
				return this.player.x > 1000;
			},
			messages: {
				0: "welcome to the game",
				2: "hi there, this is the first message"
			}
		},
		{
			controls: function () {
				this.player.acelX = SPEED.acel * SPEED.ship * (world.keys.d - world.keys.a) - !(world.keys.d || world.keys.a) * SPEED.decel * this.player.velX;
				this.player.acelY = SPEED.acel * SPEED.ship * (world.keys.s - world.keys.w) - !(world.keys.s || world.keys.w) * SPEED.decel * this.player.velY;

			    if (this.player.cooldown <= 0 && 
			        (world.keys.up || world.keys.down || world.keys.right || world.keys.left)) 
			    {
			        var p = Object.create(Projectile).init(this.player.x, this.player.y, TYPE.player, Resources.projectile);
			        if (world.keys.left) p.velX = - SPEED.projectile;
			        else if (world.keys.right) p.velX = SPEED.projectile;
			        else if (world.keys.up) p.velY = - SPEED.projectile;
			        else if (world.keys.down) p.velY = SPEED.projectile;
			        this.add(p);
			        debug.projectile = p;
			        debug.player = this.player;
			        //Resources.shoot.sound.play();
			        this.player.cooldown = 0.3;
			    }
			},
			condition: function () {
				return this.player.health <= 2;
			},
			messages: {

			}
		},
		{
			controls: function () {
				this.player.acelY = SPEED.acel * SPEED.ship * (world.keys.s - world.keys.w) - !(world.keys.s || world.keys.w) * SPEED.decel * this.player.velY;
				this.player.acelX = SPEED.acel * SPEED.ship * (world.keys.d - world.keys.a) - !(world.keys.d || world.keys.a) * SPEED.decel * this.player.velX;
				this.player.acelY -= SPEED.gravity * SPEED.ship / 2;
			},
			condition: function () {
				return this.player.y > 500;
			},
			messages: {

			}
		}
	];

	var World = {
		paused: 0,
		gameState : STATE.menu,
	    currentScene : 0,
	    keys: {up: false, down: false, right: false, left: false, a: false, s: false, d: false, w: false, p: false},
		init: function () {
	        this.scenes = [];
	        this.player = Object.create(Entity).init(canvas.width/2, canvas.height/2, TYPE.player, Resources.ship);
			this.setupControls(this.player);
	        for (var i = 0; i < sceneInfo.length; i++) {
	            var camera = Object.create(Camera);
	        	var s = Object.create(Scene).init(this.player, camera, sceneInfo[i].controls, sceneInfo[i].condition, sceneInfo[i].messages);
	            this.scenes.push(s);
	        }
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
	    	ctx.textAlign = "center";
	    	ctx.fillText("Main Menu", canvas.width/2, canvas.height/2);
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
	    	if (this.gameState == STATE.play) {
	    		if (this.paused > 0) {
	    			this.paused -= dt;
	    		} else {
			        this.scenes[this.currentScene].update(dt);
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
	    }
	}

	var Entity = {
		h: 40, w: 40, velX: 0, velY: 0, cooldown: 0, class: CLASS.ship,
	    health: 10, damage: 1, acelX: 0, acelY: 0, collideable: true,
	    init: function (x, y, type, sprite) {
	    	this.x = x, this.y = y, this.type = type, this.sprite = sprite;
	    	this.h = this.sprite.image.height * 3, this.w = this.sprite.image.width * 3 / this.sprite.frames;
	    	this.frame = 0, this.maxFrame = this.sprite.frames, this.frameDelay = this.sprite.speed, this.maxFrameDelay = this.sprite.speed;
	    	this.imageData = this.getImageData(buf);
	        return this;
	    },
	    getImageData: function (ctx) {
	    	ctx.clearRect(0,0,canvas.width,canvas.height);
	    	ctx.drawImage(this.sprite.image, 0, 0 ,this.w / 3, this.h / 3, 0, 0, this.w, this.h);
	    	return ctx.getImageData(0, 0 ,this.w, this.h).data;
	    },
	    draw: function (ctx) {
	        ctx.drawImage(this.sprite.image, 
	        	this.frame * this.w / 3, 0, 
	        	this.w / 3, this.h / 3, 
	        	Math.round(this.x - this.w / 2), this.y - Math.round(this.h / 2), this.w, this.h);
	    },
	    drawOffset: function (ctx, x, y) {
	    	var tempX = this.x, tempY = this.y;
	    	this.x = x, this.y = y;
	    	this.draw(ctx);
	    	this.x = tempX, this.y = tempY;
	    },
	    update: function (dt) {
	    	this.frameDelay -= dt;
	    	if (this.frameDelay <= 0) {
	    		this.frameDelay = this.maxFrameDelay;
	    		this.frame = (this.frame + 1) % this.maxFrame;
	    	}

	    	this.velX = clamp(this.velX + this.acelX, -SPEED.ship, SPEED.ship);
	    	this.velY = clamp(this.velY + this.acelY, -SPEED.ship, SPEED.ship);
	    	this.x = this.x + this.velX * dt;
	        this.y = clamp(this.y + this.velY * dt, this.h / 2, canvas.height - this.h / 2);
	        if (this.cooldown > 0) {
		        this.cooldown -= dt;
	        }
	        // wrap
	        /*
			
			Need to draw double on both ends, also perhaps have length be a feature of scene, not BG

	        
	        if (this.x > Resources.bg.image.width * 9 / 2) {
	        	this.x = - Resources.bg.image.width *  9 /2;
	        	console.log("wrap1");
	        }
	        else if (this.x < - Resources.bg.image.width * 9 / 2) {
	        	this.x = Resources.bg.image.width *  9 /2;
	        	console.log("wrap2");
	        }*/
	    },
	    collided: function (obj) {
	    	if (obj.type != this.type && obj.type != TYPE.neutral) {
	        	this.health -= obj.damage;
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
    		if (this.type == TYPE.enemy) {
    			Resources.shoot.sound.play();
    			world.pause(0.1);
    			world.scenes[world.currentScene].camera.shake(20);
    		}
	    }
	};

	var Projectile = Object.create(Entity);
	Projectile.class = CLASS.projectile;
	Projectile.health = 1;
	Projectile.duration = 3;
	Projectile.collided = function (obj) {
        if (obj.type != this.type) {
        	this.health  -= obj.damage;
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

	var startTime = new Date();
	function step() {
	    var newTime = new Date();
	    var dt = (newTime - startTime) / 1000;
	    startTime = newTime;
		
	    world.run(dt, ctx);
	    
	    window.requestAnimationFrame(step);
	}

	function initialize() {
		console.log(Resources);
		world.init();
		startTime = new Date();
		window.requestAnimationFrame(step);
	}
});