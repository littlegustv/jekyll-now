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

window.onload = function () {

gameWorld.difficulties = [
  {roadSpeed: 100, handling: 160, sprite: "porter cab"},
  {roadSpeed: 200, handling: 230, sprite: "figaro"},
  {roadSpeed: 260, handling: 300, sprite: "accent"},
]

gameWorld.difficulty = 0;

World.setScene = function (n) {
  if (this.scenes[n].reload) {
    this.scenes[n] = Object.create(Scene).init(this.scenes[n].name);
  }
  this.removeEventListeners(this.scene);
  this.scene = this.scenes[n];
  this.addEventListeners(this.scene);
}

World.removeEventListeners = function (scene) {
  if (scene && scene.ready) {
    if (scene.onClick) this.canvas.removeEventListener('click', scene.onClick);
    if (scene.onMouseMove) this.canvas.removeEventListener('mousemove', scene.onMouseMove);
    if (scene.onMouseDown) this.canvas.removeEventListener('mousedown', scene.onMouseDown);
    if (scene.onMouseUp) this.canvas.removeEventListener('mouseup', scene.onMouseUp);
    if (scene.onKeyDown) document.removeEventListener('keydown', scene.onKeyDown);
    if (scene.onKeyUp) document.removeEventListener('keyup', scene.onKeyUp);
    if (scene.onKeyPress) document.removeEventListener('keypress', scene.onKeyPress);

    if (scene.onTouchStart) this.canvas.removeEventListener('touchstart', scene.onTouchStart);
    if (scene.onTouchEnd) this.canvas.removeEventListener('touchend', scene.onTouchEnd);
    if (scene.onTouchCancel) this.canvas.removeEventListener('touchcancel', scene.onTouchCancel);
    if (scene.onTouchMove) this.canvas.removeEventListener('touchmove', scene.onTouchMove);

  }
}

World.addEventListeners = function (scene) {
  if (scene.ready) {
    if (scene.onClick) this.canvas.addEventListener('click', scene.onClick);
    if (scene.onMouseMove) this.canvas.addEventListener('mousemove', scene.onMouseMove);
    if (scene.onMouseDown) this.canvas.addEventListener('mousedown', scene.onMouseDown);
    if (scene.onMouseUp) this.canvas.addEventListener('mouseup', scene.onMouseUp);
    if (scene.onKeyDown) document.addEventListener('keydown', scene.onKeyDown);
    if (scene.onKeyUp) document.addEventListener('keyup', scene.onKeyUp);
    if (scene.onKeyPress) document.addEventListener('keypress', scene.onKeyPress);

    if (scene.onTouchStart) this.canvas.addEventListener('touchstart', scene.onTouchStart);
    if (scene.onTouchEnd) this.canvas.addEventListener('touchend', scene.onTouchEnd);
    if (scene.onTouchCancel) this.canvas.addEventListener('touchcancel', scene.onTouchCancel);
    if (scene.onTouchMove) this.canvas.addEventListener('touchmove', scene.onTouchMove);

  } else {
    var t = this;
    // fix me: is there maybe a more elegant way of checking whether the scene is loaded?
    setTimeout(function () { t.addEventListeners(scene), 500});
  }
}

}

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