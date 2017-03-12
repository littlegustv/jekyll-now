Sprite.onDraw = function (ctx) {
  ctx.drawImage(this.sprite.image, 
    this.frame * this.sprite.w, this.animation * this.sprite.h, 
    this.sprite.w, this.sprite.h, 
    this.x - this.w, this.y - this.h / 2, this.w, this.h);
};

var CONFIG = {
  height: 90,
  width: 160,
  title: "The Jersey Shuffle",
  startScene: "menu",
  debug: false
};

var LANE_SIZE = 8, HANDLING = 57, THRESHOLD = 1.5, ROAD_SPEED = 50, CAR_SPEED = 55, LANE_OFFSET = CONFIG.height - 7 * LANE_SIZE;
var GOAL_DISTANCE = 400;//1320; // (one pixel = 4 feet)

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

World.filterEvent = function (event) {
  var w = this;
  return {
    x: event.offsetX / this.scale, 
    y: event.offsetY / this.scale, 
    keyCode: event.keyCode, 
    touch: event.changedTouches && event.changedTouches.length > 0 ? {x: event.changedTouches[0].pageX / w.scale, y: event.changedTouches[0].pageY / w.scale} : {}
  };
};


var EntityUp = Object.create(Entity);
EntityUp.onDraw = function (ctx) {
  ctx.fillStyle = this.color || "black";
  ctx.fillRect(this.x - this.w / 2, this.y - this.h, this.w, this.h);
};

var gameWorld = Object.create(World).init(160, 90, 'index.json');

gameWorld.difficulties = [
  {name: "red scare", roadSpeed: 50, handling: 58, sprite: "roadster", score: 0},
  {name: "mirage", roadSpeed: 65, handling: 75, sprite: "hatchback", score: 0},
  {name: "geist", roadSpeed: 80, handling: 90, sprite: "truck", score: 0},
  {name: "satsuma", roadSpeed: 95, handling: 105, sprite: "car3", score: 0},
  {name: "spectre", roadSpeed: 110, handling: 120, sprite: "car4", score: 0},
  {name: "gw bridge", roadSpeed: 110, handling: 120, sprite: "repair", score: 0}
]

gameWorld.difficulty = 1;
gameWorld.unlocked = 1;

if (localStorage) {
  if (!localStorage.shuffleData) {
    // new best score!
  }
  else {
    var data = JSON.parse(localStorage.shuffleData);
    for (var i = 0; i < gameWorld.difficulties.length; i++) {
      gameWorld.difficulties[i].score = data.scores[i].score;
    }
    gameWorld.unlocked = data.unlocked;
    gameWorld.difficulty = data.difficulty;
    gameWorld.muted = data.muted;
  }
}

function goalMessage (layer, again) {
  var goal_messages = [];
  var b = Object.create(Entity).init(CONFIG.width / 2, 92, CONFIG.width + 128, 64);
  b.color = "darkcyan";
  b.addBehavior(FadeOut, {duration: 1, delay: 3, remove: true, maxOpacity: 1});
  b.addBehavior(FadeIn, {duration: 0.5});
  b.angle = Math.PI / 36;
  layer.add(b);
  goal_messages.push(b);

  var t = Object.create(Text).init(CONFIG.width / 2, 100, "Oh no! Your brakes have failed!", {align: "center", color: "white", size: 36});
  t.angle = Math.PI / 36;
  t.addBehavior(FadeOut, {duration: 1, delay: 3, remove: true, maxOpacity: 1});
  t.addBehavior(FadeIn, {duration: 1});
  layer.add(t);
  goal_messages.push(t);

  var b = Object.create(Entity).init(CONFIG.width / 2, 192, CONFIG.width + 128, 64);
  b.color = "darksalmon";
  b.addBehavior(FadeOut, {duration: 1, delay: 3, remove: true, maxOpacity: 1});
  b.addBehavior(FadeIn, {duration: 1, delay: 1});
  b.opacity = 0;
  b.angle = - Math.PI / 72;
  layer.add(b);
  goal_messages.push(b);

  var t = Object.create(Text).init(CONFIG.width / 2, 200, "A rescue car is 1 mile away!       ", {align: "center", color: "white", size: 36});
  t.angle = - Math.PI / 72;
  t.opacity = 0;
  t.addBehavior(FadeOut, {duration: 1, delay: 3, remove: true, maxOpacity: 1});
  t.addBehavior(FadeIn, {duration: 1, delay: 1});
  layer.add(t);
  goal_messages.push(t);

  var s = Object.create(Sprite).init(CONFIG.width / 2 + 192, 180, Resources[gameWorld.difficulties[(gameWorld.difficulty + 1) % gameWorld.difficulties.length].sprite]);
  s.addBehavior(FadeOut, {duration: 1, delay: 3, remove: true, maxOpacity: 1});
  s.addBehavior(FadeIn, {duration: 0.5, delay: 1, maxOpacity: 1});
  s.angle = - Math.PI / 72;
  s.opacity = 0;
  layer.add(s);
  goal_messages.push(s);

  if (again) {
    var a = Object.create(Entity).init(CONFIG.width / 2 + 100, 140, 200, 32);
    a.addBehavior(FadeOut, {duration: 0.4, delay: 3, remove: true, maxOpacity: 1});
    a.addBehavior(FadeIn, {duration: 0.4, delay: 0.7});
    a.color = "tomato";
    a.opacity = 0;
    layer.add(a);
    goal_messages.push(a);

    var at = Object.create(Text).init(CONFIG.width / 2 + 100, 150, "(again!)", {align: "center", color: "white", size: 36});
    at.addBehavior(FadeOut, {duration: 0.4, delay: 3, remove: true, maxOpacity: 1});
    at.addBehavior(FadeIn, {duration: 0.4, delay: 0.7});
    at.opacity = 0;
    layer.add(at);
    goal_messages.push(at);
  }

  return goal_messages;
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
/*  if (this.entity.level > gameWorld.unlocked) {
    ctx.fillStyle = "#333";
    ctx.fillRect(this.entity.x - this.entity.w, this.entity.y, this.entity.w * 2, 8);
    var t = Object.create(Text).init(this.entity.x, this.entity.y + 2, "LOCKED", {align: "center", size: 6, color: "white"});
    t.draw(ctx);
  }*/
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
//  console.log('start', this);
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
  //if (reload === false) {}
  if (this.scenes[n].reload || reload === true) {
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

// todo: add alignment, scaling, etc?
var SpriteFont = Object.create(Sprite);
SpriteFont.characters = ['!', '"', '#', '$', '%', '&', '\'', '(', ')', '*', '+', ',', '-', '.', '/', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':', ';', '<', '=', '>', '?', '@', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '[', '\\', ']', '^', '_', '`', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',  'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '{', '|', '}', '~', 'ƒ'];
SpriteFont.oldInit = SpriteFont.init;
SpriteFont.init = function (x, y, sprite, text, options) {
  this.oldInit(x, y, sprite);
  this.text = text;
  this.align = options.align || "left";
  this.spacing = options.spacing || 0;
  return this;
}
SpriteFont.getX = function (n) {
  if (this.align == "center") {
    return this.w * (n - this.text.length / 2) - this.spacing * this.text.length / 2;
  } else if (this.align == "left") {
    return this.w * n;
  } else if (this.align == "right") {
    return this.w * (n - this.text.length);
  }
}
SpriteFont.draw = function (ctx) {
  for (var i = 0; i < this.text.length; i++) {
    var c = this.characters.indexOf(this.text[i]);
    var x = this.getX(i);
    if (c != -1) {
      ctx.drawImage(this.sprite.image, 
        c * this.sprite.w, 0, 
        this.sprite.w, this.sprite.h, 
        Math.round(this.x - this.w / 2) + x + this.spacing * i, this.y - Math.round(this.h / 2), this.w, this.h);          
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