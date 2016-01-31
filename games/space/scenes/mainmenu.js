var onStart = function () {

	var t = this;
	console.log(t, t.h);

	for (var i = 0; i < this.data.entities.length; i++) {
		var eData = this.data.entities[i];
		if (eData.sprite) {
			if (eData.tile) {
				var e = Object.create(TiledBackground).init(eData.x, eData.y, eData.w || this.width * 2, eData.h || this.height * 2, Resources[eData.sprite]);
				e.bounce = 0.2;
				e.addBehavior(Animate);
//				e.behaviors.push(Behavior.doAnimations());
			} else {
				var e = Object.create(Sprite).init(eData.x, eData.y, Resources[eData.sprite]);
				e.opacity = 0;
				e.health = 3;
				var b = Object.create(Behavior);
				b.update = function (dt) { if (this.entity.health <= 0) this.entity.end(); };
				b.end = function () { this.entity.alive = false; }
				e.addBehavior(b);
				e.addBehavior(Fade, {speed: 10});
//				e.behaviors.push(Behavior.doFade({speed: 10}));
			}
		}
		else {
			var e = Object.create(Entity).init(eData.x, eData.y);
			e.angle = Math.random() * Math.PI * 2;
		}
		if (eData.collide) {
			e.checkCollision = Collision[eData.collide];
		}
		e.solid = eData.solid || false;
		if (eData.velocity) e.velocity = eData.velocity;
		this.entities.push(e);
	}

	var s = Object.create(Sprite).init(300, 200, Resources.viper);
	//s.velocity = {x: 10, y: 10};
	s.handleCollision = Collision.handleSolid;
	s.addBehavior(Accelerate, {maxSpeed: SPEED.ship});
	s.addBehavior(Velocity);
	s.addBehavior(Bound, {min: {x: -600, y: 0}, max: {x: 1800, y: 800}})
	s.addBehavior(DrawHitBox);
	//s.behaviors.push(Behavior.doAcceleration({maxSpeed: SPEED.ship}));
	//s.behaviors.push(Behavior.doBound());
	//s.behaviors.push(function (dt) { this.velocity.y += dt * 100; }); //gravity
	this.entities.push(s);
/*
	var scope = Object.create(Sprite).init(300, 200, Resources.scope);
	scope.behaviors.push(function (dt) {this.x = s.x; this.y = s.y;})
	scope.opacity = 0.4;
	this.entities.push(scope);
*/
	debug = s;

	var camera = Object.create(Camera).init(0, 0);
	var b = Object.create(Behavior);
	b.update = function (dt) { 
		this.entity.x = Math.floor(s.x - CONFIG.width/2);
		this.entity.y = Math.max(0, Math.min(t.height - CONFIG.height, s.y - CONFIG.height / 2));
	};
	camera.addBehavior(b);
	this.entities.unshift(camera);

	this.gamepad = Object.create(Gamepad).init();
	this.gamepad.aleft.onUpdate = function (dt) {
		if (Math.abs(this.x) > 0.3) {
			s.angle += dt * this.x * 5;
		}
		//s.acceleration = {x: 3 * SPEED.ship * Math.round(this.x * 2) / 2, y: 3 * SPEED.ship * Math.round(this.y * 2) / 2}
	}
	/*
	this.gamepad.aright.onUpdate = function (dt) {
		if (Math.abs(this.x) > 0.3) {
			scope.angle += dt * this.x * 5;
		}		
	}*/

	var scene = this;
	this.gamepad.buttons.lt.onUpdate = function (dt) {
		s.acceleration = {x: Math.cos(s.angle) * SPEED.ship, y: Math.sin(s.angle) * SPEED.ship};
	}
	this.gamepad.buttons.lt.onStart = function () {
		s.animation = 1;
	}
	this.gamepad.buttons.lt.onEnd = function () {
		s.animation = 0;
		s.acceleration = {x: 0, y: 0};
	}
	this.gamepad.buttons.rt.onStart = function () {
		var e = Object.create(Sprite).init(s.x, s.y, Resources.projectile);
		e.angle = s.angle;
		e.handleCollision = function (other) {
			if (other.health) {
				other.health -= 1;
				this.alive = false;
			} else if (other.solid) {
				this.alive = false;
			}
		}
		e.velocity = {x: Math.cos(s.angle) * SPEED.projectile, y: Math.sin(s.angle) * SPEED.projectile};
		e.addBehavior(Velocity);
		scene.entities.push(e);
		debug = e;
	}

};

var onUpdate = function (dt) {
	this.gamepad.update(dt);	
};

var onEnd = function () {

};