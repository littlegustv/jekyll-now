var Frigate = Object.create(Behavior);
Frigate.update = function (dt) {
  if (Math.random() * 1000 < 1) {

    var exp = Object.create(Explosion).init(this.entity.x, this.entity.y - 1, 12 * GLOBALS.scale, 40, "rgba(255,255,255,0.2)");
    //exp.offset = {x: 0, y: GLOBALS.scale * 4};
    this.entity.layer.add(exp);

    gameWorld.playSound(Resources.cannon);

    addCannon(this.entity, {x: 0, y: -SPEED.ship});
  }
}

var Battleship = Object.create(Behavior);
Battleship.update = function (dt) {
  if (Math.random() * 1000 < 1) {

    var exp = Object.create(Explosion).init(this.entity.x, this.entity.y - 1, 12 * GLOBALS.scale, 40, "rgba(255,255,255,0.2)");
    this.entity.layer.add(exp);
    var exp = Object.create(Explosion).init(this.entity.x + 48, this.entity.y - 1, 12 * GLOBALS.scale, 40, "rgba(255,255,255,0.2)");
    this.entity.layer.add(exp);
    var exp = Object.create(Explosion).init(this.entity.x - 48, this.entity.y - 1, 12 * GLOBALS.scale, 40, "rgba(255,255,255,0.2)");
    this.entity.layer.add(exp);

    gameWorld.playSound(Resources.cannon);

    addCannon(this.entity, {x: 0, y: -SPEED.ship * 0.75});
    addCannon(this.entity, {x: 0, y: -SPEED.ship * 0.75}, {x: -48, y: 0});
    addCannon(this.entity, {x: 0, y: -SPEED.ship * 0.75}, {x: 48, y: 0});
  }
}