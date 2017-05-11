var onStart =  function () {
	this.bg = this.addLayer(Object.create(Layer).init(gameWorld.width, gameWorld.height));
	this.bg.active = true;
	this.fg = this.addLayer(Object.create(Layer).init(gameWorld.width, gameWorld.height));
	this.fg.active = true;

	this.bg.camera.scale = 0.5;
	this.bg.camera.x = -gameWorld.width / 4;
	this.bg.camera.y = -gameWorld.height / 4;

	this.bg.add(Object.create(Entity).init(0, 0, 10 * gameWorld.width, 10 * gameWorld.height)).color = "#222255";
	
	var atmosphere = this.bg.add(Object.create(Sprite).init(gameWorld.width / 2, gameWorld.height / 2 + 60, Resources.atmosphere));
	
	var planet = this.bg.add(Object.create(Sprite).init(gameWorld.width / 2, gameWorld.height / 2 + 60, Resources.planet));
	var title = this.fg.add(Object.create(Sprite).init(gameWorld.width / 2, gameWorld.height / 2, Resources.title));
	title.addBehavior(Oscillate, {field: "y", object: title, initial: gameWorld.height / 2, rate: 1, constant: 24});

	this.onClick = function () {
		gameWorld.setScene(1, true);
	}
}

var onUpdate = function () {
}