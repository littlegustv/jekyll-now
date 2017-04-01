var onStart = function () {
	this.buttons = [];

	this.bg = Object.create(Layer).init(320, 180);
	this.fg = Object.create(Layer).init(320, 180);

	var mute_sprite = this.bg.add(Object.create(Sprite).init(CONFIG.width - 2, 6, Resources.mute));
	mute_sprite.removeBehavior(mute_sprite.behaviors[0]);

	var mute_button = Object.create(Button).init(CONFIG.width - 20, 6, 40, 12);
	mute_button.family = "button";
	mute_button.set = function () {
	if (gameWorld.muted && gameWorld.audioContext && gameWorld.audioContext.gn) {
	  mute_sprite.animation = 1;
	  gameWorld.audioContext.gn.gain.value = 0;
	} else if (gameWorld.audioContext && gameWorld.audioContext.gn) {
	  mute_sprite.animation = 0;
	  gameWorld.audioContext.gn.gain.value = 1;
	}
	}
	mute_button.set();
	mute_button.trigger = function () {
	gameWorld.muted = !gameWorld.muted;
	mute_button.set();
	};
	mute_button.hover = function () {
		mute_sprite.frame = 1;
	};
	mute_button.unhover = function () {
		mute_sprite.frame = 0;
	};
	this.buttons.push(mute_button);
	this.bg.add(mute_button);

	var menu_sprite = this.bg.add(Object.create(Sprite).init(10, 6, Resources.menu));
	menu_sprite.removeBehavior(menu_sprite.behaviors[0]);

	var menu_button = Object.create(Button).init(20, 6, 40, 12);
	menu_button.family = "button";
	menu_button.trigger = function () {
		gameWorld.setScene(0);
	};
	menu_button.hover = function () {
		menu_sprite.frame = 1;
	};
	menu_button.unhover = function () {
		menu_sprite.frame = 0;
	};
	this.buttons.push(menu_button);
	this.bg.add(menu_button);

	this.bg.add(Object.create(SpriteFont).init(CONFIG.width / 2, 8, Resources.expire_font, "High Scores", {align: "center", spacing: -2}))

	this.layers.push(this.bg);
	this.layers.push(this.fg);

	this.menus = [];
	this.moving = 0;
	this.moveMenus = function (direction) {
		if (this.moving !== 0) return;
		else {
			this.moving = 1;
			if (direction == 1) {
				var m = this.menus.pop();
				this.menus.unshift(m);
			} else {
				var m = this.menus.shift();
				this.menus.push(m);
			}
			for (var i = 0; i < this.menus.length; i++) {
				for (var j = 0; j < this.menus[i].length; j++) {
					var theta = i * PI2 / gameWorld.difficulties.length;
					this.menus[i][j].lerp.goal = theta;
				}
			}
		}
	}

	var th = this;
	for (var i = 0; i < gameWorld.difficulties.length; i++) {
		(function () {
			var menu = [];
			var s = th.fg.add(Object.create(Sprite).init(CONFIG.width / 2, CONFIG.height / 2, Resources[gameWorld.difficulties[i].sprite]));
			s.scale = 4;
			s.opacity = 0.3;
			s.origin = {x: 0, y: CONFIG.height * 2};
			s.offset = {x: s.scale * s.w / 2, y: 0};
			s.angle = i * PI2 / gameWorld.difficulties.length;
			s.lerp = s.addBehavior(Lerp, {field: "angle", object: s, rate: 5, goal: s.angle});
			menu.push(s);
			var i2 = i;

			ngio.callComponent("ScoreBoard.getScores", {id: gameWorld.difficulties[i].board}, function (result) {
				scores = result.scores;

				for (var j = 0; j < 9; j++) {
					var name = j < scores.length ? scores[j].user.name : "[EMPTY]";
					var score_text = j < scores.length ? scores[j].value : "0";
					
					var t = th.fg.add(Object.create(SpriteFont).init(4, 22 + j * 7, Resources.expire_font, (j+ 1) + ": " + name, {align: "left", spacing: -2}));
					t.origin = {x: 0, y: CONFIG.height * 2};
					t.angle = i2 * PI2 / gameWorld.difficulties.length;
					t.lerp = t.addBehavior(Lerp, {field: "angle", object: t, rate: 5, goal: t.angle});
					menu.push(t);

					var t2 = th.fg.add(Object.create(SpriteFont).init(CONFIG.width - 4, 22 + j * 7, Resources.expire_font, score_text, {align: "right", spacing: -2}));
					t2.origin = {x: 0, y: CONFIG.height * 2};
					t2.angle = i2 * PI2 / gameWorld.difficulties.length;
					t2.lerp = t2.addBehavior(Lerp, {field: "angle", object: t2, rate: 5, goal: t2.angle});
					menu.push(t2);
				}
			});
			th.menus[i2] = menu;
		})();
	}

	var t = this;
	this.onClick = function (e) {
		var b = t.bg.onButton(e.x, e.y);
		if (b) {
			if (b.trigger) b.trigger();
			return;
		}
	}
	this.onMouseMove = function (e) {
	for (var i = 0; i < t.buttons.length; i++) {
		if (t.buttons[i].check(e.x, e.y)) {
			t.buttons[i].hover();
		} else {
			t.buttons[i].unhover();
		}
		}    
	}

	this.onKeyDown = function (e) {
		if (e.keyCode == 37) {
			t.moveMenus(1);
		} else if (e.keyCode == 39) {
			t.moveMenus(-1);
		}
	}

}

var onUpdate = function (dt) {
	if (this.moving > 0) this.moving -= dt;
	else this.moving = 0;
}

var onEnd = function () {
};

var onDraw = function (ctx) {
};
