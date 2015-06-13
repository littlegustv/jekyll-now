window.onload = function () {
	var canvas = document.getElementById("game");
	var ctx = canvas.getContext("2d");

	var mouse = {x: 0, y: 0};
	var cursor = {x: 0, y: 0};

	var bg = new Image();
	bg.src = "http://www.tettix.net/files/lordran.png";
	bg.onload = function () {
		window.requestAnimationFrame(step);
	}

	var shipImage = new Image();
	shipImage.src = "http://fc07.deviantart.net/fs71/f/2014/041/b/4/b40d1e0848f65bc6e94529054bb138f3-d75ybjw.gif";
	shipImage.onload = function () { ship.w = shipImage.width, ship.h = shipImage.height; };
	var bulletImage = new Image();
	bulletImage.src = "http://v-play.net/doc/images/ball.png";

	var entities = [];
	
	var Entity = {
		x: canvas.width / 2,
		y: canvas.height / 2,
		speed: 0,
		angle: 0,
		team: "enemy",
		alive: true,
		update: function (dt) {
			this.x += dt * this.speed * Math.cos(this.angle);
			this.y += dt * this.speed * Math.sin(this.angle);
			this.checkBounds();
		},
		checkBounds: function () {
			this.x = this.x < canvas.width / 2 ? canvas.width / 2 : this.x;
			this.x = this.x > bg.width - canvas.width/2 ? bg.width - canvas.width/2 : this.x;
			this.y = this.y < canvas.height / 2 ? canvas.height / 2 : this.y;
			this.y = this.y > bg.height - canvas.height/2 ? bg.height - canvas.height/2 : this.y;
		},
		draw: function(ctx) {
			ctx.drawImage(this.image, 
						  this.getX() - this.w/2,
						  this.getY() - this.h/2);
		},
		init: function (image, x, y) {
			this.image = image;
			this.x = x;
			this.y = y;
			return this;
		},
		getX: function() { return this.x|0; },
		getY: function() { return this.y|0; }
	}
	var Camera = Object.create(Entity);
	Camera.draw = function (ctx) {
			ctx.translate(-this.getX(),-this.getY());
	};
	var Projectile = Object.create(Entity);
	Projectile.init = function (image, x, y, angle, speed, team) {
		this.x = x, this.y = y, this.image = image, this.angle = angle, this.speed = speed;
		this.w = image.width, this.h = image.height, this.team = team;
		return this;
	}
	Projectile.checkBounds = function () {
		if (this.x > bg.width || this.x < 0 || this.y > bg.height || this.y < 0) {
			this.alive = false;
		}
	}
	Projectile.handleCollision = function (obj) {
		this.alive = false;
	}
	var Ship = Object.create(Entity);
	Ship.init = function (image, x, y, team) {
		this.x = x, this.y = y, this.image = image;
		this.w = image.width, this.h = image.height;
		this.health = 100, this.temperature = 0, this.cooldown = 0;
		this.shield = false, this.team = team;
		return this;
	};
	Ship.update = function (dt) {
		this.x += dt * this.speed * Math.cos(this.angle);
		this.y += dt * this.speed * Math.sin(this.angle);
		this.checkBounds();
		if (this.temperature > 0) {
			this.temperature -= 4 * (dt - 0.5 * dt * this.shield); 
		} else this.temperature = 0;
		if (this.cooldown > 0) {
			this.cooldown -= dt;
		} else this.cooldown = 0;
		
		if (this.health <= 0) {
			this.alive = false;
			this.health = 0;
		}
	}
	Ship.handleCollision = function (obj) {
		if (this.shield && this.temperature < 85) {
			this.temperature += 15;
		}
		else {
			this.health -= 5;
		}
	}
	Ship.canShoot = function() { return this.temperature < 95 && this.cooldown <= 0; }
	Ship.draw = function (ctx) {
		ctx.drawImage(this.image, this.x - this.w/2, this.y - this.h/2);
		if (this.shield) {
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.w * 0.6, 0, 2*Math.PI, true);
			ctx.stroke(); 
		}
	}
	function checkCollision (obj1, obj2) {
		if (obj1.x + obj1.w / 2 > obj2.x - obj2.w / 2 &&
			obj1.x - obj1.w / 2 < obj2.x + obj2.w / 2) {
			if (obj1.y + obj1.h / 2 > obj2.y - obj2.h / 2 &&
				obj1.y - obj1.h / 2 < obj2.y + obj2.h / 2) {
				obj1.handleCollision(obj2);
				obj2.handleCollision(obj1);
			}
		}
	}

	var ship = Object.create(Ship).init(shipImage, canvas.width/2, canvas.height/2, "player");
	entities.push(ship);

	var camera = Object.create(Camera);

	function distance(x1, y1, x2, y2) {
		return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
	}

	function angle(x1, y1, x2, y2) {
		return Math.atan2(y2 - y1, x2 - x1);
	}

	canvas.addEventListener("mousemove", function (e) {
		mouse.x =  e.offsetX==undefined ? e.layerX : e.offsetX;
		mouse.y = e.offsetY==undefined ? e.layerY : e.offsetY;
	});

	document.addEventListener("keydown", function (e) {
		var angle = 0;
		switch (e.keyCode) {
			case 65:
				angle = Math.PI;
				break;
			case 68:
				angle = 0;
				break;
			case 87:
				angle = 3 * Math.PI / 2;
				break;
			case 83:
				angle = Math.PI / 2;
				break;
			case 32:
				ship.shield = true;
				return;
			default:
				return;
				break;
		}
		if (ship.canShoot()) {
			var b = Object.create(Projectile).init(bulletImage, ship.getX(), ship.getY(), angle, 1000, "player");
			entities.push(b);
			ship.cooldown = 0.2;
			ship.temperature += 5;
		}
	});

	document.addEventListener("keyup", function (e) {
		switch (e.keyCode) {
			case 32:
				ship.shield = false;
				return;
		}
	});

	var startTime = new Date();

	function step () {

		var newTime = new Date();
		var dt = (newTime - startTime) / 1000;
		startTime = newTime;
		
		//randomly spawn enemy bullets
		if (Math.random() * 100 < 50)
		{
			var b = Object.create(Projectile).init(bulletImage, Math.random() * bg.width, 0, Math.PI / 2, 1000, "enemy");
			entities.push(b);
		}
		
		ctx.clearRect(0,0,canvas.width,canvas.height);
		ctx.save();
		
		camera.update(dt);
		camera.draw(ctx);
		
		ctx.drawImage(bg, 10, 0);

		cursor.x = mouse.x + camera.getX(), cursor.y = mouse.y + camera.getY();
		ship.speed = Math.min(600, 6 * distance(cursor.x, cursor.y, ship.getX(), ship.getY()));
		ship.angle = angle(ship.getX(), ship.getY(),cursor.x, cursor.y);
		
		for (var i = 0; i < entities.length; i++) {
			entities[i].update(dt);
		}
		for (var i = 0; i < entities.length; i++) {
			entities[i].draw(ctx);
		}
		//check collisions
		for (var i = 0; i < entities.length; i++) {
			for (var j = i + 1; j < entities.length; j++) {
				if (entities[i].team != entities[j].team) {
					checkCollision(entities[i], entities[j]);
				}
			}
		}
		
		camera.speed = 6 * distance(camera.x,camera.y,
								ship.x-canvas.width/2,
								ship.y-canvas.height/2);
		camera.angle = angle(camera.x, camera.y, ship.x-canvas.width/2,
							 ship.y-canvas.height/2);
		ctx.restore();
		
		for (var i = 0; i < entities.length; i++) {
			if (entities[i].alive === false) {
				entities.splice(i, 1);
			}
		}
		
		//overlay (fixed position)
		
		ctx.fillStyle = "black";
		ctx.fillRect(10,10,108,28);
		ctx.fillRect(canvas.width - 118,10,108,28)
		
		ctx.fillStyle = "white"
		ctx.fillRect(14,14,ship.temperature, 20);
		ctx.fillRect(canvas.width - 114, 14,ship.health,20);
		
		window.requestAnimationFrame(step);
		
	}
}