  var Cannon = Object.create(Sprite);
  Cannon.is_projectile = true;
  Cannon.setCollision(Polygon);
  Cannon.collision.onHandle = function (object, other) {
    if (other.no_collide || other.is_projectile) {
      return;
    }
    if (other.health > 0) {
      object.layer.add(smoke(other.x, other.y + GLOBALS.scale * 4));
      other.health -= 10;
      other.addBehavior(Flash, {duration: 0.4});
      gameWorld.playSound(Resources.hit)
    } 
    if (other.health <= 0 && other.family != "player") {
      combo += 1;
      score += combo * 10;
      comboTimer = 0;
      var t = Object.create(Text).init(
        other.x,
        other.y - GLOBALS.scale * 6,
        combo + "X",
      {color: "#FFFFFF", size: 54});
      t.addBehavior(FadeOut, {duration: 4});
      t.z = 20;
      var t2 = Object.create(Text).init(
        other.x - 3,
        other.y - GLOBALS.scale * 6 - 3,
        combo + "X",
      {color: "#000000", size: 54});
      t2.addBehavior(FadeOut, {duration: 4});
      t2.z = 19;
      other.layer.add(t);
      other.layer.add(t2);
    }
    object.alive = false;
  };
  Cannon.projectile_ignore = true;
  Cannon.setVertices([
    {x: 0, y: 2},
    {x: 2, y: 0},
    {x: 0, y: -2},
    {x: -2, y: 0},
  ]);

  var Button = Object.create(Entity);
  Button.behaviors = [];
  Button.family = 'button';
  Button.trigger = function () {};
  Button.hover = function () {};
  Button.check = function (x, y) {
    if (x > this.x - this.w / 2 && x < this.x + this.w / 2) {
      if (y > this.y - this.h / 2 && y < this.y + this.h / 2) {
        return true;
      }
    }
    return false;
  };
  Button.draw = function (ctx) {
    if (CONFIG.debug) {
      ctx.fillStyle = "green";
      ctx.fillRect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
    }
  }
  Button.init = function (x, y, w, h, object) {
    this.object = object;
    this.x = x, this.y = y, this.w = w, this.h = h;
    return this;
  }