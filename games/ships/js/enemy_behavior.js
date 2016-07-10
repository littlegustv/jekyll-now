var Frigate = Object.create(Behavior);
Frigate.update = function (dt) {
  if (!this.entity.shoot) this.start();
  if (Math.random() * 1000 < 1) {
    this.entity.shoot();
  }
}
Frigate.start = function () {
  this.entity.shoot = defaultShoot;
}

var Battleship = Object.create(Behavior);
Battleship.update = function (dt) {
  if (!this.entity.shoot) this.start();
  if (Math.random() * 1000 < 1) {
    this.entity.shoot();
  }
}
Battleship.start = function () {
  this.entity.shoot = doubleShoot;
}