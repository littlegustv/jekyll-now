var CONFIG = {
  height: 360,
  width: 640,
  title: "The Jersey Shuffle",
  startScene: "menu",
  debug: false
};

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

var gameWorld = Object.create(World).init('index.json');

gameWorld.difficulties = [
  {roadSpeed: 100, handling: 160, sprite: "porter cab"},
  {roadSpeed: 200, handling: 230, sprite: "figaro"},
  {roadSpeed: 260, handling: 300, sprite: "accent"},
]

gameWorld.difficulty = 0;

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