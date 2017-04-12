var Shoot = Object.create(Behavior);
Shoot.update = function (dt) {
  if (this.cooldown <= 0) {
    gameWorld.playSound(Resources.laser);
    var e = Object.create(Sprite).init(this.entity.x - 2, this.entity.y - 2, Resources.projectile);
    e.color = "red";
    e.addBehavior(Velocity);
    e.setCollision(Polygon);
    e.family = "enemy";
    e.projectile = true;
    e.collision.onHandle = function (object, other) {
      if (other.family == "player") {
        other.health -= 1;
      }
      if (other.family != "enemy") object.alive = false;
    }
    var theta = angle(this.entity.x, this.entity.y, this.target.x, this.target.y);
    e.velocity = {x: 100 * Math.cos(theta), y: 100 * Math.sin(theta)};
    this.entity.layer.add(e);
    this.cooldown = randint(1,2);
  } else {
    this.cooldown -= dt;
  }
}

var Mortar = Object.create(Behavior);
Mortar.update = function (dt) {
  if (this.cooldown <= 0) {
    gameWorld.playSound(Resources.shoot);
    var e = Object.create(Sprite).init(this.entity.x - 2, this.entity.y - 2, Resources.bomb);
    e.addBehavior(Velocity);
    e.setCollision(Polygon);
    e.family = "enemy";
    e.projectile = true;
    e.collision.onHandle = function (object, other) {
      if (other.family == "player") {
        other.health -= 1;
      }
      if (other.family != "enemy") object.alive = false;
    }
    e.velocity = {x: 0, y: -90};
    this.entity.layer.add(e);
    this.cooldown = randint(1,3);
  } else {
    this.cooldown -= dt;
  }
}

var Damage = Object.create(Behavior);
Damage.update = function (dt) {
  if (Math.random() * 100 < (10 - this.entity.health)) {
    var c = Object.create(Sprite).init(this.entity.x, this.entity.y, Resources.smoke);
    //var c = Object.create(Entity).init(this.entity.x, this.entity.y, 8, 8);
    c.opacity = 1;
    c.addBehavior(FadeOut, {duration: 0.7});
    c.addBehavior(Velocity);
    c.z = this.entity.z - 1;
    c.velocity = {x: Math.random() * 32 - 16, y: -100};
    //c.addBehavior(Oscillate, {object: c.offset, field: "x", constant: 10, rate: 4, time: 0});
    this.layer.add(c);
  }
}

var gameWorld = Object.create(World).init(320, 180, "index.json");

/* MUSIC */
/* I was listeneing to GZA - labels, 4th chambers, and it does seem to fit? but maybe a lot of music would... */
/* also mos def... just listened to 'habitat' for the first time - not bad! 

  more to the point - the record-skip sound/effect works kinda nicely with the pause/unpause mechanic
  BUT also the beat is a little more.. driving maybe?  we'll see!
*/

/*
-add checks for pause/unpause
-create 5 new enemies with different attacks, patterns of movement
-implement AI 'store' (popup)
-add powerups, upgrades
-implement scrap/repair mechanic
-implement AI 'greedy' tractor beam for dropped powerups
-implement end goal -> barrier with 'salvage' cost
-implement AI combat behavior
-add more enemies, waves, environmental hazards [volvanic eruption? ion clouds? asteroids? lightning?], etc.
*/