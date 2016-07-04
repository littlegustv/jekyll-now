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

  var fg_camera = Object.create(Camera).init(0, 0);
  var fg = Object.create(Layer).init(fg_camera);

  var text = Object.create(Text).init(CONFIG.width / 2, CONFIG.height / 2, "Main Menu", {align: "center", color: "indigo"});
  fg.add(text);

  this.layers.push(fg);

  this.onTouchStart = function (e) {
    gameWorld.setScene(gameWorld.scenes[1]);
    if (!fullscreen) requestFullScreen();
  }
  this.onClick = function (e) {
    gameWorld.setScene(gameWorld.scenes[1]);
  };
  
}

var onUpdate = function (dt) { 
};

var onEnd = function () {
};

var onDraw = function (ctx) {
};