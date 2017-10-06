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
		b.eyes = bg.add(Object.create(Sprite).init(Resources.eyes));
		b.eyes.add(Follow, {target: b, offset: {x: 0, y: 0, z: 1}});
	}
	var bomb = bg.add(Object.create(Sprite).init(Resources.bomb)).set({x: 8, y: 32, velocity: {x: 0, y: 0}, acceleration: {x: 0, y: 200}});
	bomb.setCollision(Polygon);
	bomb.collision.onHandle = function (a, b) {
		if (a.nocollide) return;
		a.velocity.y = -160;
		a.nocollide = true;
		a.add(Delay, {duration: 0.5, callback: function () { this.entity.nocollide = false; }});
	}
	bomb.add(Velocity);
	bomb.add(Accelerate);
	bomb.add(Wrap, {min: {x: 0, y: 0}, max: {x: game.w, y: game.h}})

	this.onKeyPress = function (e) {
		console.log(e.keyCode);
		switch (e.keyCode) {
			case 100, 39:
				bomb.x += 16;
				break;
			case 97, 37:
				bomb.x -= 16;
				break;
		}
	}
};

var onUpdate = function () {

};