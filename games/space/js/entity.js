var doVelocity = function (dt) {
	this.x += dt * this.velocity.x;
	this.y += dt * this.velocity.y;	
};

var doAcceleration = function (dt) {
	this.velocity.x += dt * this.acceleration.x;
	this.velocity.y += dt * this.acceleration.y;
};

var doAnimations = function (dt) {
	this.frameDelay -= dt;
	if (this.frameDelay <= 0) {
		this.frameDelay = this.maxFrameDelay;
		this.frame = (this.frame + 1) % this.maxFrame;
	}
};

var doGrowth = function (dt) {
	this.h += dt;
	this.w += dt;
}

var Entity = {
	velocity: {x: 0, y: 0},
	init: function (x, y) {
		this.behaviors = [doVelocity, doGrowth];
		this.x = x, this.y = y;
		this.h = 4, this.w = 4;
		return this;
	},
	draw: function (ctx) {
		ctx.fillRect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
	},
	behavior: function (dt) {},
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
	this.behaviors = [doVelocity, doAnimations, doAcceleration];
	if (sprite) {
		// FIX ME: add multiple animations (see PLATFORMS code)
		this.sprite = sprite, this.sprite.h = this.sprite.image.height, this.sprite.w = this.sprite.image.width / this.sprite.frames;
		this.h = this.sprite.image.height * GLOBALS.scale, this.w = this.sprite.image.width * GLOBALS.scale / this.sprite.frames;
		this.frame = 0, this.maxFrame = this.sprite.frames, this.frameDelay = this.sprite.speed, this.maxFrameDelay = this.sprite.speed;
		//this.imageData = this.getImageData(buf);
	}
	return this;
};
Sprite.getImageData = function () { return true; };
Sprite.draw = function (ctx) {
	ctx.drawImage(this.sprite.image, 
		this.frame * this.sprite.w, 0, 
		this.sprite.w, this.sprite.h, 
		Math.round(this.x - this.w / 2), this.y - Math.round(this.h / 2), this.w, this.h);
};