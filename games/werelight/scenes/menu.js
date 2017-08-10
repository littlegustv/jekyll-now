var onStart = function () {
    console.log('problem?');
    this.bg = this.addLayer(Object.create(Layer).init(gameWorld.width, gameWorld.height));
    
    var water = this.bg.add(Object.create(Entity).init(gameWorld.width / 2, gameWorld.height / 2, gameWorld.width, gameWorld.height));
    water.color = "#cb3d44";
    water.z = -1;
    
    this.bg.add(Object.create(SpriteFont).init(gameWorld.width / 2, 10, Resources.expire_font, "wereLight", {align: "center", spacing: -2}));
    
    for (var i = 0; i < Resources.levels.levels.length; i++) {
        var b = this.bg.add(Object.create(Entity).init(10 + i * 20, 32, 14, 14));
        b.family = "button";
        b.color = "#eeeeee";
        b.index = i;
        b.z = 1;
        b.label = this.bg.add(Object.create(SpriteFont).init(b.x, b.y, Resources.expire_font, "" + (i + 1), {align: "center", spacing: -4}));
        b.border = this.bg.add(Object.create(Sprite).init(b.x, b.y, Resources.keys));
        b.border.behaviors = [];
        b.border.frame = 0;
        b.border.animation = 1;
        b.label.z = 2;
        b.trigger = function () {
            current_level = this.index;
            gameWorld.setScene(1);
        };
    }
    
    this.onClick = function (e) {
        var b = this.bg.onButton(e.x, e.y);
        if (b) {
            b.trigger();
        }
    }
}

var onUpdate = function () {
}