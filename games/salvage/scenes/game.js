var fullscreen = false;

function requestFullScreen () {
// we've made the attempt, at least
  fullscreen = true;
  var body = document.documentElement;
  if (body.requestFullscreen) {
    body.requestFullscreen();
  } else if (body.webkitRequestFullscreen) {
    body.webkitRequestFullscreen();
  } else if (body.mozRequestFullscreen) {
    body.mozRequestFullscreen();
  } else if (body.msRequestFullscreen) {
    body.msRequestFullscreen();
  }
}

var onStart = function () {
  var bg = this.addLayer(Object.create(Layer).init(320,240));
  var fg = this.addLayer(Object.create(Layer).init(320,240));

  bg.add(Object.create(TiledBackground).init(gameWorld.width / 2, gameWorld.height / 2, 10 * gameWorld.width, 10* gameWorld.height, Resources.bg));
  this.player = fg.add(Object.create(Sprite).init(gameWorld.width / 2, gameWorld.height / 2,Resources.viper));
  this.player.family = "player";
  this.player.addBehavior(Damage, {layer: bg});
  this.player.addBehavior(Velocity);
  this.player.health = 10;

  this.player.velocity = {x: 0, y: 0};
  this.player.cooldown = 0;
  var p = this.player;
  var player_dummy = bg.add(Object.create(Entity).init(p.x, p.y, p.w, p.h));
  player_dummy.color = "red";
  player_dummy.setCollision(Polygon);
  player_dummy.velocity = {x: 0, y: 0};
  player_dummy.acceleration = {x: 0, y: 0};
  player_dummy.opacity = 0;
  player_dummy.family = "player";
  player_dummy.collision.onHandle = function (object, other) {
    if (other.family == "enemy") {
      p.health -= 1;
    }

    if (p.health <= 0) {
      p.alive = false;
      gameWorld.playSound(Resources.hit);
    }
  }
  player_dummy.addBehavior(Follow, {target: p, offset: {angle: 0, x: 0, y: 0, z: 0}});
  
	var borders = [];
  borders.push(bg.add(Object.create(TiledBackground).init(gameWorld.width / 2, gameWorld.height - 4,gameWorld.width,8,Resources.ground)));
	borders.push(bg.add(Object.create(TiledBackground).init(-12, gameWorld.height / 2, 32, gameWorld.height, Resources.building2)));
  borders.push(bg.add(Object.create(TiledBackground).init(gameWorld.width + 12, gameWorld.height / 2, 32, gameWorld.height, Resources.building2)));
	borders.forEach(function (b) {
		b.obstacle = true;
  	b.setCollision(Polygon);  
  	b.solid = true;
	});
  
  bg.add(Object.create(Entity).init(160, 220, 320, 20));
  this.bg = bg;
  
  this.keydown = false;
  this.pause = function () {
    this.bg.paused = 10000;
    this.player.velocity = {x: 0, y: 0};
    this.player.animation = 0;
  }
  this.pause();
  
  fg.drawOrder = function () {
    return this.entities.sort(function (a, b) { 
      if (a.z && b.z && b.z != a.z) return a.z - b.z;
      else if (a.y && b.y && a.y != b.y) return a.y - b.y;
      else return a.x - b.x;
    });
  }
  var s = this;
  this.onMouseMove = function (e) {
    if (s.player.velocity.x === 0 && s.player.velocity.y === 0) {
      s.player.angle = angle(this.player.x, this.player.y, e.x, e.y) ;
    }
  }
  this.onMouseUp = function (e) {
    s.player.velocity = {x: 0, y: 0};
    if (s.player.cooldown <= 0) {
      s.pause();
    }
  }
  this.onMouseDown = function (e) {
    s.bg.paused = 0;
    s.player.animation = 1;
    s.player.velocity = {
      x: Math.cos( s.player.angle) * 100,
      y: Math.sin( s.player.angle) * 100
    }
  }
  this.onKeyPress = function (e) {
    if (e.keyCode == 122) {
      if (s.player.cooldown <= 0) {
        s.bg.paused = 0;
        var a = s.bg.add(Object.create(Sprite).init(s.player.x, s.player.y, Resources.projectile));
        a.setCollision(Polygon);
        gameWorld.playSound(Resources.laser);
        a.collision.onHandle = function (object, other) {
          if (other.family != "player" && !other.projectile) {
            object.alive = false;
          } if (other.family == "enemy" && other.die) {
            //other.alive = false;
            other.die();
          }
        };
        a.addBehavior(Velocity);
        a.velocity = {x: 100 * Math.cos(s.player.angle), y: 100 * Math.sin(s.player.angle)};
        s.player.cooldown = 0.3;
      }
    }
  }
  this.onTouchStart = function (e) {

		if (!fullscreen) requestFullScreen();
    s.pause();
	}
  this.onTouchEnd = function (e) {
    s.bg.paused = 0;
    s.player.velocity = {
      x: Math.cos( s.player.angle) * 100,
      y: Math.sin( s.player.angle) * 100
    }
  }
  this.onTouchMove = function (e) {
    s.player.angle = angle(this.player.x, this.player.y, e.touch.x, e.touch.y) ;
  }
}
var onUpdate = function (dt) {
  // should convert this into behavior, eventually
  if (this.bg.paused === 0) {
    if (this.player.cooldown >= 0) {
      this.player.cooldown -= dt;
    } else if (this.player.cooldown > -1) {
      if (this.player.velocity.x === 0 && this.player.velocity.y === 0) {
        this.pause();  
      }
      this.player.cooldown = -1;
      //this.player.cooldown = 0.3;
    }      
  }
  if (this.bg.paused === 0 && Math.random() * 100 < 2) {
    var c = Math.random() * 100;
    var enemy;
    if (c < 20) {  
      enemy = this.bg.add(Object.create(Sprite).init(randint(0,gameWorld.width), 0, Resources[choose(["asteroid", "bomber"])]));
      enemy.angle = Math.random() * PI / 6 + PI / 2 - PI / 12;              
      enemy.velocity = {x: Math.cos(enemy.angle) * 50, y: 50 * Math.sin(enemy.angle)}; 
    }
    else if (c < 30) {
      gameWorld.playSound(Resources.spawn);
      enemy = this.bg.add(Object.create(Sprite).init(randint(0,gameWorld.width), 0, Resources[choose(["saucer"])]));
      enemy.addBehavior(Shoot, {target: this.player, cooldown: 1});
      enemy.velocity = {x: 0, y: 10};
		} else if (c < 50) {			  
      enemy = this.bg.add(Object.create(Sprite).init(randint(0,gameWorld.width), 0, Resources[choose(["x"])]));
      enemy.angle = Math.random() * PI / 6 + PI / 2 - PI / 12;              
      enemy.velocity = {x: Math.cos(enemy.angle) * 50, y: 50 * Math.sin(enemy.angle), angle: PI}; 
			enemy.addBehavior(Bounce, {min: {x: 5, y: 0}, max: {x: gameWorld.width - 5, y: gameWorld.height - 16}});
		}	else if (c < 85) {
		  gameWorld.playSound(Resources.spawn);
      enemy = this.bg.add(Object.create(Sprite).init(randint(0,gameWorld.width), 0, Resources[choose(["drone"])]));
      enemy.addBehavior(Drone, {target: this.player, cooldown: 1, rate: 0.6, radius: 40, angle: Math.random() * PI2});
      enemy.velocity = {x: 0, y: 10};
    } else {
      // disable tanks for now...
      enemy = this.bg.add(Object.create(Sprite).init(choose([0, gameWorld.width]), gameWorld.height - 16, Resources[choose(["tank", "walker"])]));
      enemy.angle = 0;
      enemy.mirrored = enemy.x > 100;
      enemy.addBehavior(Flip);
      enemy.addBehavior(Mortar, {cooldown: 1});
      enemy.addBehavior(Crop, {min: {x: -1, y: -1}, max: {x: gameWorld.width + 1, y: gameWorld.height}})
      enemy.velocity = {x: enemy.x > 100 ? -20 : 20, y: 0};
    }

    enemy.addBehavior(Velocity);
    enemy.setCollision(Polygon);
    enemy.setVertices([
      {x: 0, y: -6},
      {x: -6, y: 0},
      {x: 0, y: 6},
      {x: 6, y: 0}
    ]);
    enemy.family = "enemy";
    enemy.collision.onHandle = function (object, other) {
      if (other.family != "enemy") {
      //console.log('die?');
        //object.alive = false;
        if (object.opacity >= 1)
          object.die();
      }        
    }
    enemy.die = function () {
      this.collision.onCheck = function (a, b) { return false; };
      this.velocity = {x: 0, y: 0};
      this.addBehavior(FadeOut, {duration: 0.5});
      var exp = this.layer.add(Object.create(Sprite).init(this.x, this.y, Resources.explosion));
      exp.addBehavior(FadeOut, {duration: 0.5, delay: 1});
      exp.z = this.z - 1;
      gameWorld.playSound(Resources.hit);
    }
    enemy.addBehavior(Crop, {min: {x: -10, y: -10}, max: {x: gameWorld.width + 10, y: gameWorld.height + 20}});
  }
}