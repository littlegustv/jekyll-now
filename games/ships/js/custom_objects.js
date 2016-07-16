  var Cannon = Object.create(Sprite);
  Cannon.setCollision(Polygon);
  Cannon.collision.onHandle = function (object, other) {
    if (other.health > 0) {
      object.layer.add(smoke(other.x, other.y + GLOBALS.scale * 4));

      other.health -= 10;
      gameWorld.playSound(Resources.hit)
    } 
    if (other.health <= 0) {
      combo += 1;
      score += combo * 10;
      comboTimer = 0;
    }
    object.alive = false;
  };
  Cannon.setVertices([
    {x: 0, y: -10},
    {x: 2, y: -12},
    {x: 0, y: -14},
    {x: -2, y: -12},
  ]);
  Cannon.z = 15;

  var Bullet = Object.create(Entity);
  Bullet.setCollision(Polygon);
  Bullet.collision.onHandle = function (object, other) {
    console.log('a hit!');
    if (other.health > 0) {
      other.health -= 1;
      gameWorld.playSound(Resources.hit)
    } 
    if (other.health <= 0) {
      combo += 1;
      comboTimer = 0;
      score += combo * 10;
    }
    object.alive = false;
  };

  var Button = Object.create(Sprite);
  Button.behaviors = [];
  Button.family = 'button';
  Button.highlight = function () { this.frame = 1 };
  Button.select = function () { this.frame = 2; };
  Button.super_init = Button.init;
  Button.init = function (x, y, sprite) {
    this.super_init(x, y, sprite);
    this.behaviors = [];
    this.addBehavior(HighLight, {duration: 0.5});
    return this;
  }