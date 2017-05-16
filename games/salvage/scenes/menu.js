var onStart =  function () {
	this.bg = this.addLayer(Object.create(Layer).init(gameWorld.width, gameWorld.height));
	this.bg.active = true;
	this.fg = this.addLayer(Object.create(Layer).init(gameWorld.width, gameWorld.height));
	this.fg.active = true;

	this.bg.camera.scale = 0.5;
	this.bg.camera.x = -gameWorld.width / 4;
	this.bg.camera.y = -gameWorld.height / 4;
	var bg = this.bg;
	
	bg.add(Object.create(Entity).init(0, 0, 10 * gameWorld.width, 10 * gameWorld.height)).color = "#C13160";
	
	for (var i = 0; i < 100; i++) {
		bg.add(Object.create(Entity).init(randint(0, gameWorld.width * 2), randint(0, gameWorld.height * 2), 1, 1)).color = "white";
	}
	
	var atmosphere = bg.add(Object.create(Atmosphere).init(gameWorld.width / 2, gameWorld.height / 2 + 60, 240, 2, PI / 8, "#e91e63"));
	atmosphere.addBehavior(Velocity);
	atmosphere.velocity = {x: 0, y: 0, angle: PI / 180};
	atmosphere.addBehavior(Oscillate, {object: atmosphere, field: "amplitude", initial: 2, constant: 1, rate: 4});
	atmosphere.z = -2;
	
	// smaller
  //var atmosphere = bg.add(Object.create(Sprite).init(gameWorld.width / 2, gameWorld.height / 2 + 60, Resources.atmosphere));
	var atmosphere = bg.add(Object.create(Atmosphere).init(gameWorld.width / 2, gameWorld.height / 2 + 60, 236, 2, PI / 2, "aliceblue"));
	atmosphere.addBehavior(Velocity);
	atmosphere.angle = Math.random() * PI2;
	atmosphere.velocity = {x: 0, y: 0, angle: PI / 180};
	atmosphere.addBehavior(Oscillate, {object: atmosphere, field: "amplitude", initial: 2, constant: 1, rate: 4});
	atmosphere.z = -2;
	
	var planet = this.bg.add(Object.create(Sprite).init(gameWorld.width / 2, gameWorld.height / 2 + 60, Resources.planet));
	var title = this.fg.add(Object.create(Sprite).init(gameWorld.width / 2, gameWorld.height / 2, Resources.title));
	title.addBehavior(Oscillate, {field: "y", object: title, initial: gameWorld.height / 2, rate: 1, constant: 24});

	this.onClick = function () {
		gameWorld.setScene(1, true);
	}
}

var onUpdate = function () {
}