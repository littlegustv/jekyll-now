var onStart = function () {

	game.musicLoop = function () {
	game.soundtrack = game.playSound(Resources.blocks, 1);
		game.soundtrack.onended = game.musicLoop;
	}
	game.musicLoop();

	var bg = this.add(Object.create(Layer).init(320, 180));
	for (var i = 0; i < game.w; i += 16) {
		var b = bg.add(Object.create(Sprite).init(Resources.block)).set({x: 8 + i, y: game.h - 8});
		b.setCollision(Polygon);
		b.collision.onHandle = function (a, b) {
			a.add(FadeOut, {duration: 0, delay: 0.55});
			a.animation = 1;
			a.frameDelay = a.maxFrameDelay;
			a.frame = 0;
			game.playSound(Resources.explode);
		}
	}
	var hammer = bg.add(Object.create(Sprite).init(Resources.hammer)).set({x: 8, y: 32, velocity: {x: 0, y: 0}, acceleration: {x: 0, y: 100}});
	hammer.setCollision(Polygon);
	hammer.collision.onHandle = function (a, b) {
		if (a.nocollide) return;
		a.velocity.y = -120;
		a.nocollide = true;
		a.add(Delay, {duration: 0.5, callback: function () { this.entity.nocollide = false; }});
	}
	hammer.add(Velocity);
	hammer.add(Accelerate);

	this.onKeyPress = function (e) {
		console.log(e.keyCode);
		switch (e.keyCode) {
			case 100:
				hammer.x += 16;
				break;
			case 97:
				hammer.x -= 16;
				break;
		}
	}
};

var onUpdate = function () {

};