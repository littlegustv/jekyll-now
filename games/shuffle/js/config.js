var CONFIG = {
  height: 360,
  width: 640,
  title: "The Jersey Shuffle",
  startScene: "menu",
  debug: false
};

window.onload = function () {

gameWorld.setScene = function (n) {
  if (this.scenes[n].reload) {
    this.scenes[n] = Object.create(Scene).init(this.scenes[n].name);
  }
  this.removeEventListeners(this.scene);
  this.scene = this.scenes[n];
  this.addEventListeners(this.scene);
}

gameWorld.removeEventListeners = function (scene) {
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

gameWorld.addEventListeners = function (scene) {
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