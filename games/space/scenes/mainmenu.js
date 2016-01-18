var onStart = function () {

	for (var i = 0; i < this.data.entities.length; i++) {
		var eData = this.data.entities[i];
		if (eData.sprite) {
			if (eData.tile) {
				var e = Object.create(TiledBackground).init(eData.x, eData.y, eData.w || this.width * 2, eData.h || this.height * 2, Resources[eData.sprite]);
				e.behaviors.push(Behavior.doAnimations());
			} else {
				var e = Object.create(Sprite).init(eData.x, eData.y, Resources[eData.sprite]);
				e.opacity = 0;
				e.behaviors.push(Behavior.doFade({speed: 10}));
			}
		}
		else
			var e = Object.create(Entity).init(eData.x, eData.y);
		if (eData.collide) {
			e.checkCollision = Collision[eData.collide];
		}
		e.solid = eData.solid || false;
		if (eData.velocity) e.velocity = eData.velocity;
		this.entities.push(e);
	}

	var s = Object.create(Sprite).init(300, 200, Resources.ship);
	s.velocity = {x: 10, y: 10};
	s.handleCollision = function (other) { 
		if (other.solid) {
			var dx = (this.getBoundX() - other.getBoundX());
			var d = distance(this.getBoundX(), this.getBoundY(), other.getBoundX(), other.getBoundY());
			if (Math.abs(dx / d) > Math.sin(Math.PI / 4)) {
				console.log('vertical');
				this.y += this.getBoundY() < other.getBoundY() ? -2 : 2;
        		this.velocity.y = this.getBoundY() < other.getBoundY() ? Math.min(0, this.velocity.y) : Math.max(0, this.velocity.y);
        		this.acceleration.y = this.getBoundY() < other.getBoundY() ? Math.min(0, this.acceleration.y) : Math.max(0, this.acceleration.y);
        	} else {
        		console.log('horizontal')
				this.x += this.getBoundX() < other.getBoundX() ? -2 : 2;
        		this.velocity.x = this.getBoundX() < other.getBoundX() ? Math.min(0, this.velocity.x) : Math.max(0, this.velocity.x);
        		this.acceleration.x = this.getBoundX() < other.getBoundX() ? Math.min(0, this.acceleration.x) : Math.max(0, this.acceleration.x);
        	}//this.velY *= -1;
		}
	};
	this.entities.push(s);

	debug = s;

	var camera = Object.create(Camera).init(0, 0);
	camera.behaviors.push(function (dt) { this.x = Math.floor(s.x - CONFIG.width/2); })
	this.entities.unshift(camera);

	this.gamepad = Object.create(Gamepad).init();
	this.gamepad.aleft.onUpdate = function (dt) {
		s.acceleration = {x: SPEED.ship * Math.round(this.x * 2) / 2, y: SPEED.ship * Math.round(this.y * 2) / 2}
	}

	var scene = this;
	this.gamepad.buttons.a.onStart = function () {
		var e = Object.create(Entity).init(s.x, s.y);
		e.velocity = {x: s.velocity.x, y: s.velocity.y};
		scene.entities.push(e);
	}

};

var onUpdate = function (dt) {
	this.gamepad.update(dt);	
};

var onEnd = function () {

};