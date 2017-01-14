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

gameWorld.difficulty = 0;
gameWorld.unlocked = 0;

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

// custom behavior to handle 'passing' a car => unlocking that 'difficulty'
var Unlock = Object.create(Behavior);
Unlock.update = function (dt) {
  if (this.entity.x <= 0) {
    // create some text
    var b = Object.create(Entity).init(CONFIG.width / 2, 24, CONFIG.width, 48);
    b.color = "#333";
    // fix me: add 'delay' to fadeout, yeah?
    b.addBehavior(FadeOut, {duration: 2, delay: 4});
    b.addBehavior(FadeIn, {duration: 2});
    gameWorld.scene.ui.add(b);

    var t = Object.create(Text).init(CONFIG.width / 2, 32, "You unlocked    !", {align: "center", color: "white"});
    t.addBehavior(FadeOut, {duration: 2, delay: 4});
    t.addBehavior(FadeIn, {duration: 2});
    gameWorld.scene.ui.add(t);

    var s = Object.create(Sprite).init(CONFIG.width / 2 + 112, 8, this.entity.sprite);
    s.addBehavior(FadeOut, {duration: 2, delay: 4});
    s.addBehavior(FadeIn, {duration: 2});
    gameWorld.scene.ui.add(s);

    gameWorld.unlocked = this.level;
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

FadeOut.update = function (dt) {
    if (!this.time) this.start();
    this.time += dt;

    if (this.time >= this.duration && this.remove) this.entity.alive = false;
    this.entity.opacity = clamp(this.maxOpacity * (this.duration - this.time) / this.duration, 0, 1);
};
FadeOut.start = function () {
  if (this.entity.collision) {
    this.entity.collision.onCheck = function (a, b) { console.log(2);  return false };
  }
  this.maxOpacity = this.entity.opacity;
  this.remove = this.remove === undefined ? true : this.remove;
  this.time = 0;
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