var onStart = function () {
    console.log('problem?');
    this.bg = this.addLayer(Object.create(Layer).init(gameWorld.width, gameWorld.height));
    
    var water = this.bg.add(Object.create(Entity).init(gameWorld.width / 2, gameWorld.height / 2, gameWorld.width, gameWorld.height));
    water.color = "#cb3d44";
    water.z = -1;
    
    this.bg.add(Object.create(SpriteFont).init(gameWorld.width / 2, 10, Resources.expire_font, "wereLight", {align: "center", spacing: -2}));
    
    this.onClick = function (e) {
        gameWorld.setScene(1);
    }
}

var onUpdate = function () {
}