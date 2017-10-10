var onStart = function () {

	game.musicLoop = function () {
	game.soundtrack = game.playSound(Resources.blocks, 1);
		game.soundtrack.onended = game.musicLoop;
	}
	game.musicLoop();
	game.keys = {right: false, left: false};
	game.touch = {start: {x: undefined, y: undefined}, end: {x: undefined, y: undefined}, down: false};

	var bg = this.add(Object.create(Layer).init(320, 180));
	bg.add(Object.create(Entity).init()).set({x: game.w / 2, y: -game.h / 10, w: game.w, h: game.h * 22, color: "tomato"});
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
	for (var i = 0; i < 10; i++) {
		var b = bg.add(Object.create(Sprite).init(Resources.block)).set({x: randint(0,20) * 16, y: game.h - 56});
		b.setCollision(Polygon);
		b.collision.onHandle = function (a, b) {
			a.add(FadeOut, {duration: 0, delay: 0.55});
			a.animation = 1;
			a.frameDelay = a.maxFrameDelay;
			a.frame = 0;
			game.playSound(Resources.explode);
		}	
	}

	var owl = bg.add(Object.create(Sprite).init(Resources.owl)).set({x: 8, y: 32, velocity: {x: 0, y: 0}, acceleration: {x: 0, y: 200}});
	owl.setCollision(Polygon);
	owl.collision.onHandle = function (a, b) {
		if (a.nocollide) return;
		a.velocity.y = -160;
		a.nocollide = true;
		a.add(Delay, {duration: 0.5, callback: function () { this.entity.nocollide = false; }});
	}
	owl.add(Velocity);
	owl.add(Accelerate);
	owl.add(Wrap, {min: {x: 0, y: 0}, max: {x: game.w, y: game.h + 16}});
	bg.camera.add(Follow, {target: owl, offset: {x: -game.w / 2, y: -game.h / 2}});
	bg.camera.add(Bound, {min: {x: 0, y: -100000}, max: {x: 0, y: 0}});
	game.owl = owl;

	this.onKeyDown = function (e) {
		switch (e.keyCode) {
			case 100, 39:
				game.keys.right = true;
				break;
			case 97, 37:				
				game.keys.left = true;
				break;
		}
	}
	this.onKeyUp = function (e) {
		switch (e.keyCode) {
			case 100, 39:
				game.keys.right = false;
				break;
			case 97, 37:
				game.keys.left = false;
				break;
		}
	}
	this.onTouchStart = function (e) {
		game.touch = {down: true, start: {x: e.touch.x, y: e.touch.y}, end: {x: e.touch.x, y: e.touch.y}};
	}
	this.onTouchEnd = function (e) {
		game.touch.down = false;
	}
	this.onTouchMove = function (e) {
		game.touch.end = {x: e.touch.x, y: e.touch.y};
	}
};

var onUpdate = function () {
	if (game.keys.right || (game.touch.down && game.touch.end.x > game.touch.start.x)) {
		game.owl.velocity.x = 40;
	} else if (game.keys.left || (game.touch.down && game.touch.end.x < game.touch.start.x)) {
		game.owl.velocity.x = -40;
	} else {
		game.owl.velocity.x = 0;
	}
	if (game.owl.y > game.h) {
		game.setScene(0, true);
	}
};