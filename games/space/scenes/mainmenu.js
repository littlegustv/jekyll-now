var onStart = function () {

	for (var i = 0; i < this.data.entities.length; i++) {
		var eData = this.data.entities[i];
		var e = Object.create(Entity).init(eData.x, eData.y);
		e.velocity = eData.velocity;
		this.entities.push(e);
	}

	var s = Object.create(Sprite).init(300, 200, Resources.ship);
	s.velocity = {x: 10, y: 10};
	this.entities.push(s);

	this.gamepad = Object.create(Gamepad).init();
	this.gamepad.aleft.onUpdate = function (dt) {
		s.velocity = {x: SPEED.ship * this.x, y: SPEED.ship * this.y}
	}

	var scene = this;
	this.gamepad.buttons.a.onStart = function () {
		var e = Object.create(Entity).init(s.x, s.y);
		e.velocity = s.velocity;
		scene.entities.push(e);
	}

};

var onUpdate = function (dt) {

	if (this.player && this.player.x > 300) {
		this.player.velocity.x = - SPEED.ship / 3;
	}

	this.gamepad.update(dt);	
};

var onEnd = function () {

};