var onStart = function () {
	var scene = this;
	this.bg = this.add(Object.create(Layer).init(game.w, game.h));
	this.bg.add(Object.create(TiledBackground).init(Resources.floor).set({x: game.w / 2, y: game.h / 2, w: game.w, h: game.h, z: 1}))
	var witch = this.bg.add(Object.create(Sprite).init(Resources.witch).set({x: game.w / 2 - 16, y: game.h / 2 + 12, z: 2}));

	var yourturn = true;
	var enemies = [];
	var move = function () {
		yourturn = false;
		witch.add(Delay, {duration: 0.5, callback: function () {
			for (var i = 0; i < enemies.length; i++) {
				enemies[i].x += 32;
			}
			enemies.push(scene.bg.add(Object.create(Sprite).init(Resources.monster).set({x: 16, y: choose([0,1,2,3,4,5]) * 32 + 16, z: 3})));
			yourturn = true;
			this.entity.remove(this);
		}});
	}

	this.onKeyDown = function (e) {
		if (yourturn) {
			switch(e.keyCode) {
				case 37:
					witch.x -= 32;
					break;
				case 38:
					witch.y -= 32;
					break;
				case 39:
					witch.x += 32;
					break;
				case 40:
					witch.y += 32;
					break;
				case 32:
					witch.animation = 1;
					witch.frame = 0;
					witch.frameDelay = 0;
					break;
			}
			if ([37,38,39,40,32].indexOf(e.keyCode) !== -1) {
				move();
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