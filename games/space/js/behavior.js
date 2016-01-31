var Behavior = {
	init: function (entity, config) {
		this.entity = entity;
		for (c in config) {
			this[c] = config[c];
		}
		return this;
	},
	start: function () {
	},
	update: function (dt) {
	},
	end: function () {
	},
	draw: function (ctx) {
	}
}

var Velocity = Object.create(Behavior);
Velocity.update = function (dt) {
	this.entity.x += dt * this.entity.velocity.x;
	this.entity.y += dt * this.entity.velocity.y;	
};

var Accelerate = Object.create(Behavior);
Accelerate.update = function (dt) {
	this.entity.velocity.x += dt * this.entity.acceleration.x;
	this.entity.velocity.y += dt * this.entity.acceleration.y;
	if (this.maxSpeed) {
		this.entity.velocity.x = clamp(this.entity.velocity.x, -this.maxSpeed, this.maxSpeed);
		this.entity.velocity.y = clamp(this.entity.velocity.y, -this.maxSpeed, this.maxSpeed);
	}
};

var Animate = Object.create(Behavior);
Animate.update = function (dt) {
	this.entity.frameDelay -= dt;
	if (this.entity.frameDelay <= 0) {
		this.entity.frameDelay = this.entity.maxFrameDelay;
		this.entity.frame = (this.entity.frame + 1) % this.entity.maxFrame;
	}
};

var Fade = Object.create(Behavior);
Fade.start = function () {
	if (this.entity.active) {
		this.entity.opacity = 0;
	}
	this.entity.activate = function () {
		this.entity.opacity = 0;
		this.entity.active = true;
	}
};
Fade.update = function (dt) {
	if (this.entity.opacity < 1) {
		this.entity.opacity += dt / (this.speed ? this.speed : 1);
	}
};

var Bound = Object.create(Behavior);
Bound.update = function (dt) {
	this.entity.x = clamp(this.entity.x, this.min.x, this.max.x);
	this.entity.y = clamp(this.entity.y, this.min.y, this.max.y);
};

var DrawHitBox = Object.create(Behavior);
DrawHitBox.draw = function (ctx) {
	ctx.fillStyle = "red";
	ctx.fillRect(this.entity.x - this.entity.w / 2, this.entity.y - this.entity.h / 2, this.entity.w, this.entity.h);
}

var Behaviors = {
	velocity: Velocity,
	accelerate: Accelerate,
	animate: Animate,
	fade: Fade,
	bound: Bound
}