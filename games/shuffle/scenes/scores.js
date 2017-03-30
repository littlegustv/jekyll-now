var onStart = function () {
	this.buttons = [];

	this.bg = Object.create(Layer).init(320, 180);

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

}

var onUpdate = function (dt) {

}

var onEnd = function () {
};

var onDraw = function (ctx) {
};
