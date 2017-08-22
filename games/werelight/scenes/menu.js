var onStart = function () {
    console.log('problem?');
    this.bg = this.addLayer(Object.create(Layer).init(gameWorld.width, gameWorld.height));
    
    var water = this.bg.add(Object.create(Entity).init(gameWorld.width / 2, gameWorld.height / 2, gameWorld.width, gameWorld.height));
    water.color = "#999"; //"#cb3d44";
    water.z = -1;
    
    this.bg.add(Object.create(SpriteFont).init(gameWorld.width / 2, 10, Resources.expire_font, "wereLight", {align: "center", spacing: -2}));
    this.buttons = [];
    
    for (var i = 0; i < Resources.levels.levels.length; i++) {
        var b = this.bg.add(Object.create(Sprite).init(10 + i * 20, 32, Resources.empty));
        b.behaviors = [];
        b.family = "button";
        b.color = "#eeeeee";
        b.hover = function () {
            this.frame = 1;
        };
        b.unhover = function () {
            this.frame = 0;
        };
        b.index = i;
        b.z = 1;
        b.trigger = function () {
            current_level = this.index;
            gameWorld.setScene(1, true);
        };
        this.buttons.push(b);
    }
    var s = this;
    this.onClick = function (e) {
        var b = s.bg.onButton(e.x, e.y);
        if (b) {
            b.trigger();
        }
    }
    
    this.onMouseMove = function (e) {
        var b = s.bg.onButton(e.x, e.y);
        if (b) {
            b.hover();
        }
        for (var i = 0; i < s.buttons.length; i++) {
            if (s.buttons[i] != b) {
                s.buttons[i].unhover();
            }
        }
    }
}

var onUpdate = function () {
}