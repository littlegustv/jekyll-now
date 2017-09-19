var onStart =  function () {
	
	this.nullaries = [];
	this.negatives = [];
	this.primaries = [];
	this.secondaries = [];
	this.tertiaries = [];
	var s = this;

//	Resources.music = Resources.soundtrack;
	if (!gameWorld.soundtrack) {
		if (AudioContext) {
		  gameWorld.filter = gameWorld.audioContext.createBiquadFilter();
		  gameWorld.filter.connect(gameWorld.audioContext.destination);
		  gameWorld.filter.type = 'lowpass'; // Low-pass filter. See BiquadFilterNode docs
		  gameWorld.filter.frequency.value = 24000; // Set cutoff to 440 HZ
		}

		gameWorld.musicLoop = function () {
		  gameWorld.soundtrack = gameWorld.playSound(Resources.soundtrack, 1);
		  //gameWorld.soundtrack.connect(gameWorld.filter);
		  gameWorld.soundtrack.onended = gameWorld.musicLoop;
		}
		//gameWorld.musicLoop();
	}

	var colorize = this.addLayer(Object.create(Layer).init(1000, 1000));
	
	var c = colorize.add(Object.create(Entity).init(gameWorld.width / 2, gameWorld.height / 2, gameWorld.width, gameWorld.height));
	c.color = COLORS.negative;
	this.negatives.push(c);
	
	this.bg = this.addLayer(Object.create(Layer).init(gameWorld.width, gameWorld.height));
	this.bg.active = true;
	
	var back = this.bg.add(Object.create(Entity).init(gameWorld.width / 2, gameWorld.height / 2, gameWorld.width, gameWorld.height));
	back.color = COLORS.nullary;
	back.z = 0;
	this.nullaries.push(back);

	var title = this.bg.add(Object.create(SpriteFont).init(gameWorld.width / 2, gameWorld.height - 12, Resources.expire_font, "the field of mars", {spacing: -4, align: "center"}));
	//title.addBehavior(Oscillate, {field: "y", object: title, initial: gameWorld.height / 2, rate: 1, constant: 24});
	title.blend = "destination-out";
	title.scale = 2;
	title.z = 10;
	
	for (var i = 16; i < gameWorld.width; i += 32) {
		var h = randint(1,4) * 32;
		var b = this.bg.add(Object.create(TiledBackground).init(i, gameWorld.height - h / 2, 32, h, Resources.building));
		b.opacity = Math.random() / 2;
		b.blend = "destination-out";
		b.z = 9.5;
	}
	
	var ground = this.bg.add(Object.create(TiledBackground).init(gameWorld.width / 2, gameWorld.height - 4, gameWorld.width, 8, Resources.ground));
	ground.blend = "destination-out";
	ground.z = 10;
	
	var circle = this.bg.add(Object.create(Circle).init(gameWorld.width / 2, gameWorld.height, gameWorld.width / 2));
	circle.z = 9;
	circle.color = COLORS.primary;
	this.primaries.push(circle);
	
	for (var i = 0; i < 20; i++) {
		var w = randint(1, 4) * 4 + 4;
		var square = this.bg.add(Object.create(Entity).init(randint(0, gameWorld.width), randint(0, gameWorld.height), w, w));
		square.color = COLORS.secondary;
		square.z = 8;
		square.velocity = {x: 0, y: 20};
		square.addBehavior(Wrap, {min: {x: 0, y: 0}, max: {x: gameWorld.width, y: gameWorld.height}});
		square.addBehavior(Velocity);
		this.secondaries.push(square);
	}
	
	for (var i = 0; i < 20; i++) {
		var line = this.bg.add(Object.create(Entity).init(randint(0, gameWorld.width), randint(0, 2 * gameWorld.height / 3), randint(gameWorld.width / 2, gameWorld.width * 2), 2));
		line.color = COLORS.tertiary;
		line.z = 7;
		line.addBehavior(Velocity);
		line.velocity = {x: 10, y: 00};
		line.addBehavior(Wrap, {min: {x: -line.w / 2, y: 0}, max: {x: gameWorld.width + line.w / 2, y: gameWorld.height}});
		this.tertiaries.push(line);
	}
	var buttons = ["play", "mute", "credits", "achievements"];
	for (var i = 0; i < buttons.length; i++) {
		var b = this.bg.add(Object.create(SpriteFont).init(gameWorld.width / 2, gameWorld.height / 4 + i * 16, Resources.expire_font, buttons[i], {spacing: -2, align: "center"}));
		var button = this.bg.add(Object.create(Entity).init(gameWorld.width / 2, gameWorld.height / 4 + i * 16, gameWorld.width, 16));
		button.family = "button";
		b.blend = "destination-out";
		button.opacity = 0;
		button.text = b;
		button.hover = function () { this.text.scale = 2;};
		button.unhover = function () { this.text.scale = 1; };
		button.trigger = function () {
			gameWorld.setScene(1, true);
		}
	}
	
	var ship = this.bg.add(Object.create(Sprite).init(0, 3 * gameWorld.height / 4, Resources.viper));
	ship.addBehavior(Velocity);
	ship.velocity = {x: 40, y: 0};
	ship.addBehavior(Wrap, {min: {x: 0, y: 0}, max: {x: gameWorld.width, y: gameWorld.height}});
	ship.z = 12;
	ship.blend = "destination-out";

	this.colorize = function (i) {
		COLORS = SCHEMES[i];
		this.nullaries.forEach(function (e) { e.color = COLORS.nullary; });
		this.negatives.forEach(function (e) { e.color = COLORS.negative; });
		this.primaries.forEach(function (e) { e.color = COLORS.primary; });
		this.secondaries.forEach(function (e) { e.color = COLORS.secondary; });
		this.tertiaries.forEach(function (e) { e.color = COLORS.tertiary; });
	}

	this.onClick = function (e) {
		var b = s.bg.onButton(e.x, e.y);
		console.log('mm', b);
		if (b) {
			b.trigger();
		}
	}
	this.onMouseMove = function (e) {
		var buttons = s.bg.entities.filter(function (e) { return e.family === "button"; });
		var b = s.bg.onButton(e.x, e.y);
		for (var i = 0; i < buttons.length; i++) {
			if (b == buttons[i]) b.hover();
			else buttons[i].unhover();
		}
	}
	this.onTouchEnd = function (e) {
		if (!fullscreen) {
			requestFullScreen();
			return;
		} else {
			var b = s.bg.onButton(e.x, e.y);
			if (b) {
				b.trigger();
			}
		}
	}
}

var onUpdate = function () {
}