var Entity = {
	velocity: {x: 0, y: 0},
	opacity: 1,
	init: function (x, y) {
		this.behaviors = [Behavior.doVelocity(), Behavior.doGrowth({speed: 0.3})];
		this.checkCollision = Collision.doBox;
		this.x = x, this.y = y;
		this.h = 4, this.w = 4;
		return this;
	},
    getBoundX: function () { return Math.floor(this.x - this.w/2); },
    getBoundY: function () { return Math.floor(this.y - this.h/2); },
	draw: function (ctx) {
		ctx.globalAlpha = this.opacity;
		ctx.fillRect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
		ctx.globalAlpha = 1;
	},
	behavior: function (dt) {},
	checkCollision: function (obj) {},
	checkCollisions: function (entities) { 
		for (var i = 0; i < entities.length; i++) {
			if (this == entities[i]) {}
			else {
				if (this.checkCollision(entities[i]) && entities[i].checkCollision(this)) {
					this.handleCollision(entities[i]);
					entities[i].handleCollision(this);
				}
			}
		}
	},
	handleCollision: function ( other ) {
	},
	update: function (dt) {
		for (var i = 0; i < this.behaviors.length; i++) {
			this.behavior = this.behaviors[i];
			this.behavior(dt);
		}
//		this.x += dt * this.velocity.x;
//		this.y += dt * this.velocity.y;
	}
};

var Sprite = Object.create(Entity);
Sprite.acceleration = {x: 0, y: 0};
Sprite.init = function (x, y, sprite) {
	this.x = x, this.y = y;
	this.behaviors = [Behavior.doVelocity(), Behavior.doAnimations(), Behavior.doAcceleration()];
	this.checkCollision = Collision.doPixelPerfect;
	if (sprite) {
		// FIX ME: add multiple animations (see PLATFORMS code)
		this.sprite = sprite, this.sprite.h = this.sprite.image.height, this.sprite.w = this.sprite.image.width / this.sprite.frames;
		this.h = this.sprite.image.height * GLOBALS.scale, this.w = this.sprite.image.width * GLOBALS.scale / this.sprite.frames;
		this.frame = 0, this.maxFrame = this.sprite.frames, this.frameDelay = this.sprite.speed, this.maxFrameDelay = this.sprite.speed;
		//this.imageData = this.getImageData(buf);
	}
	return this;
};
Sprite.draw = function (ctx) {
	ctx.globalAlpha = this.opacity;
	ctx.drawImage(this.sprite.image, 
		this.frame * this.sprite.w, 0, 
		this.sprite.w, this.sprite.h, 
		Math.round(this.x - this.w / 2), this.y - Math.round(this.h / 2), this.w, this.h);
	ctx.globalAlpha = 1;
};

var TiledBackground = Object.create(Sprite);
TiledBackground.superInit = Sprite.init;
TiledBackground.init = function (x, y, w, h, sprite) {
	if (sprite) {
		// FIX ME: add multiple animations (see PLATFORMS code)
		this.sprite = sprite, this.sprite.h = this.sprite.image.height, this.sprite.w = this.sprite.image.width / this.sprite.frames;
		this.h = this.sprite.image.height * GLOBALS.scale, this.w = this.sprite.image.width * GLOBALS.scale / this.sprite.frames;
		this.frame = 0, this.maxFrame = this.sprite.frames, this.frameDelay = this.sprite.speed, this.maxFrameDelay = this.sprite.speed;
		//this.imageData = this.getImageData(buf);
	}
	this.x = x, this.y = y;
	this.w = w, this.h = h;
	this.behaviors = [];
	return this;
};
TiledBackground.draw = function (ctx) {
	ctx.globalAlpha = this.opacity;
	for (var i = 0; i < this.w; i += this.sprite.w) {
		for (var j = 0; j < this.h; j += this.sprite.h) {
			ctx.drawImage(this.sprite.image, 
				this.frame * this.sprite.w, 0, 
				this.sprite.w, this.sprite.h, 
				Math.round(this.x - this.w / 2) + i, this.y - Math.round(this.h / 2) + j, this.sprite.w, this.sprite.h);
		}
	}
	ctx.globalAlpha = 1;	
};

var Camera = Object.create(Entity);
Camera.draw = function (ctx) {
	ctx.translate(-this.x,-this.y);
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