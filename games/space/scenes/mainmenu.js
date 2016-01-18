var onStart = function () {

	for (var i = 0; i < this.data.entities.length; i++) {
		var eData = this.data.entities[i];
		if (eData.sprite) {
			if (eData.tile) {
				var e = Object.create(TiledBackground).init(eData.x, eData.y, this.width * 2, this.height * 2, Resources[eData.sprite]);
				e.behaviors.push(Behavior.doAnimations());
			} else {
				var e = Object.create(Sprite).init(eData.x, eData.y, Resources[eData.sprite]);
				e.opacity = 0;
				e.behaviors.push(Behavior.doFade({speed: 10}));
			}
		}
		else
			var e = Object.create(Entity).init(eData.x, eData.y);
		e.velocity = eData.velocity;
		this.entities.push(e);
	}

	var s = Object.create(Sprite).init(300, 200, Resources.ship);
	s.velocity = {x: 10, y: 10};
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