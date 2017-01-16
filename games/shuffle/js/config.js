var CONFIG = {
  height: 360,
  width: 640,
  title: "The Jersey Shuffle",
  startScene: "menu",
  debug: false
};

//GLOBALS.scale = 3;

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

// check if n is between j and k
function between(n, j, k) {
  return ((n > j && n < k) || (n > k && n < j));
}

// push
function randomColor () {
  return "#" + ("000000" + Math.floor(Math.random() * (Math.pow(256, 3) - 1)).toString(16)).slice(-6);
}

// push
function normalize (x, y) {
  var d = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  return {x: x / d, y: y / d};
}

var gameWorld = Object.create(World).init('index.json');

gameWorld.difficulties = [
  {roadSpeed: 200, handling: 230, sprite: "roadster"},
  {roadSpeed: 260, handling: 300, sprite: "hatchback"},
  {roadSpeed: 320, handling: 360, sprite: "truck"},
]

gameWorld.difficulty = 1;
gameWorld.unlocked = 1;

// push
Scene.loadBehavior = function (script) {
  var s = document.createElement("script");
  s.type = "text/javascript";
  s.src = "scenes/" + script;
  s.id = this.name;

  var old = document.getElementById(this.name);
  if (old) {
    old.parentElement.removeChild(old);
  }
  document.body.appendChild(s);


  // FIX ME: cross browser support
  var t = this;
  s.onload = function () {
    t.onStart = onStart;
    t.onUpdate = onUpdate;
    t.onEnd = onEnd;
    t.onDraw = onDraw;
    t.loadProgress();
  };
}

function goalMessage (layer) {
  var b = Object.create(Entity).init(CONFIG.width / 2, 32, CONFIG.width, 64);
  b.color = "#333";
  b.addBehavior(FadeOut, {duration: 1, delay: 3, remove: true, maxOpacity: 1});
  b.addBehavior(FadeIn, {duration: 1});
  layer.add(b);

  var t = Object.create(Text).init(CONFIG.width / 2, 24, "Oh no! Your brakes have failed!" + (gameWorld.difficulty > 0 ? " (again)" : ""), {align: "center", color: "white", size: 36});
  t.addBehavior(FadeOut, {duration: 1, delay: 3, remove: true, maxOpacity: 1});
  t.addBehavior(FadeIn, {duration: 1});
  layer.add(t);

  var t2 = Object.create(Text).init(CONFIG.width / 2, 50, "Get to the rescue car!       , one mile <away!></away!>", {align: "center", color: "white", size: 36});
  t2.addBehavior(FadeOut, {duration: 1, delay: 3, remove: true, maxOpacity: 1});
  t2.addBehavior(FadeIn, {duration: 1, delay: 1, maxOpacity: 1});
  t2.opacity = 0;
  layer.add(t2);

  var s = Object.create(Sprite).init(CONFIG.width / 2 + 160, 32, Resources[gameWorld.difficulties[(gameWorld.difficulty + 1) % gameWorld.difficulties.length].sprite]);
  s.addBehavior(FadeOut, {duration: 1, delay: 3, remove: true, maxOpacity: 1});
  s.addBehavior(FadeIn, {duration: 1, delay: 1, maxOpacity: 1});
  s.opacity = 0;
  layer.add(s);
}

// custom behavior to handle 'passing' a car => unlocking that 'difficulty'
var Unlock = Object.create(Behavior);
Unlock.update = function (dt) {
  if (this.entity.x <= 0 && gameWorld.unlocked < this.level) {
    var b = Object.create(Entity).init(CONFIG.width / 2, 24, CONFIG.width, 48);
    b.color = "#333";
    b.addBehavior(FadeOut, {duration: 1, delay: 2, remove: true, maxOpacity: 1});
    b.addBehavior(FadeIn, {duration: 1});
    gameWorld.scene.ui.add(b);

    var t = Object.create(Text).init(CONFIG.width / 2, 32, "You unlocked    !", {align: "center", color: "white"});
    t.addBehavior(FadeOut, {duration: 1, delay: 2, remove: true, maxOpacity: 1});
    t.addBehavior(FadeIn, {duration: 1});
    gameWorld.scene.ui.add(t);

    var s = Object.create(Sprite).init(CONFIG.width / 2 + 112, 8, this.entity.sprite);
    s.addBehavior(FadeOut, {duration: 1, delay: 2, remove: true, maxOpacity: 1});
    s.addBehavior(FadeIn, {duration: 1});
    gameWorld.scene.ui.add(s);

    gameWorld.unlocked = this.level;
    this.entity.alive = false;
  }
}

var Locked = Object.create(Behavior);
Behavior.drawAfter = function (ctx) {
  if (this.entity.level > gameWorld.unlocked) {
    ctx.fillStyle = "#333";
    ctx.fillRect(this.entity.x - 32, this.entity.y, 64, 12);
    var t = Object.create(Text).init(this.entity.x, this.entity.y + 8, "LOCKED", {align: "center", size: 14, color: "white"});
    t.draw(ctx);
  }
}

var Delay = Object.create(Behavior);
Delay.start = function () {
  this.time = 0;
}
Delay.update = function (dt) {
  if (this.time == undefined) this.start();

  this.time += dt;
  if (this.time > this.duration) {
    this.callback();
    this.entity.removeBehavior(this);
  }
}

FadeIn.update = function (dt) {
    if (!this.time) this.start();

    if (this.delay && this.delay > 0) {
      this.delay -= dt;
      return;
    }
    
    this.time += dt;
    if (this.time < this.duration) {
      this.entity.opacity = clamp(this.maxOpacity * (this.time) / this.duration, 0, 1);      
    }
};

FadeOut.update = function (dt) {
    if (this.time === undefined) this.start();

    if (this.delay && this.delay > 0) {
      this.delay -= dt;
      return;
    }

    this.time += dt;
    if (this.time >= this.duration && this.remove) this.entity.alive = false;
    this.entity.opacity = clamp(this.maxOpacity * (this.duration - this.time) / this.duration, 0, 1);
};
FadeOut.start = function () {
  if (this.entity.collision) {
    this.entity.collision.onCheck = function (a, b) { return false };
  }
  this.maxOpacity = this.maxOpacity || this.entity.opacity;
  this.remove = this.remove === undefined ? true : this.remove;
  this.time = 0;
  this.delay = this.delay || 0;
  console.log('start', this);
}

Follow.update = function (dt) {
  if (this.offset.x !== false)
    this.entity.x = this.target.x + (this.offset.x || 0);
  if (this.offset.y !== false)
    this.entity.y = this.target.y + (this.offset.y || 0);
  if (this.offset.z !== false)
    this.entity.z = this.target.z + (this.offset.z || 0);
  if (this.target.alive == false) this.entity.alive = false;
}

World.setScene = function (n, reload) {
  if (reload === false) {}
  else if (this.scenes[n].reload) {
    this.scenes[n] = Object.create(Scene).init(this.scenes[n].name, true);
  }
  this.removeEventListeners(this.scene);
  this.scene = this.scenes[n];
  this.addEventListeners(this.scene);
}

// raindrop -> allow pausing of INDIVIDUAL layers (for n seconds)
Layer.update = function (dt) {
  if (this.paused > 0) {
    this.paused -= dt;
    return;
  }
  this.camera.update(dt);
  for (var i = 0; i < this.entities.length; i++) {
    this.entities[i].update(dt);
  }
  for (var i = 0; i < this.entities.length; i++) {
    this.entities[i].checkCollisions(i, this.entities);
  }
  for (var i = 0; i < this.entities.length; i++) {
    if (!this.entities[i].alive) {
      this.entities[i].end();
      this.entities.splice(i, 1);
    }
  }
}

/* some attempts at drawing performance improvements here...

fps drops have vanished ... we'll come back to this?

Entity.draw = function (ctx) {
  ctx.save();
  ctx.translate(this.x, this.y);
  ctx.translate(this.offset.x, this.offset.y);
  ctx.rotate(this.angle);
  if (this.blend) {
    ctx.globalCompositeOperation = this.blend;
  } else {
    ctx.globalCompositeOperation = "normal";
  }
  for (var i = 0; i < this.behaviors.length; i++) {
    this.behaviors[i].transform(ctx);
  }
  ctx.translate(-this.x, -this.y);
  ctx.globalAlpha = this.opacity;
  for (var i = 0; i < this.behaviors.length; i++) {
    this.behaviors[i].draw(ctx);
  }
  this.onDraw(ctx);
  for (var i = 0; i < this.behaviors.length; i++) {
    this.behaviors[i].drawAfter(ctx);
  }
  
  ctx.globalAlpha = 1;
  ctx.restore();
  this.drawDebug(ctx);
};*/