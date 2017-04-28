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
var GOAL_DISTANCE = 1320; // (one pixel = 4 feet)

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


Lerp.update = function (dt) {
  if (this.field == "angle")
    this.object[this.field] = lerp_angle(this.object[this.field], this.goal, this.rate * dt);
  else
    this.object[this.field] = lerp(this.object[this.field], this.goal, this.rate * dt);
  if (this.object[this.field] == this.goal && this.callback) this.callback(); 
};

Entity.draw = function (ctx) {
  for (var i = 0; i < this.behaviors.length; i++) {
    this.behaviors[i].draw(ctx);
  }
  ctx.save();
  ctx.translate(this.x, this.y);
  ctx.translate(this.offset.x, this.offset.y);
  if (this.origin) ctx.translate(this.origin.x, this.origin.y);
  ctx.rotate(this.angle);
  if (this.origin) ctx.translate(-this.origin.x, -this.origin.y);
  if (this.scale !== undefined) {
    ctx.scale(this.scale, this.scale);
  }
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
  this.onDraw(ctx);

  ctx.globalAlpha = 1;
  ctx.restore();
  for (var i = 0; i < this.behaviors.length; i++) {
    this.behaviors[i].drawAfter(ctx);
  }
  this.drawDebug(ctx);
};

var EntityUp = Object.create(Entity);
EntityUp.onDraw = function (ctx) {
  ctx.fillStyle = this.color || "black";
  ctx.fillRect(this.x - this.w / 2, this.y - this.h, this.w, this.h);
};

var EntityRight = Object.create(Entity);
EntityRight.onDraw = function (ctx) {
  ctx.fillStyle = this.color || "black";
  ctx.fillRect(this.x, this.y - this.h / 2, this.w, this.h);
};

var gameWorld = Object.create(World).init(160, 90, 'index.json');

gameWorld.difficulties = [
 // {name: "red scare", roadSpeed: 50, handling: 58, sprite: "roadster", score: 0},
  {name: "mirage", board: 7592, roadSpeed: 65, handling: 75, sprite: "hatchback", score: 0, last: 0, primary: "#42e546", secondary: "#1dce21"},
  {name: "style", board: 7593, roadSpeed: 80, handling: 90, sprite: "truck", score: 0, last: 0, primary: "#07dfff", secondary: "#007c8e"},
  {name: "satsuma", board: 7594, roadSpeed: 95, handling: 105, sprite: "car3", score: 0, last: 0, primary: "#ff8700", secondary: "#f75700"},
  {name: "spectre", board: 7595, roadSpeed: 110, handling: 120, sprite: "car4", score: 0, last: 0, primary: "#6900b0", secondary: "#3c0065"},
  {name: "bridge repair", board: 7596, roadSpeed: 170, handling: 180, sprite: "repair", score: 0, last: 0, primary: "#ffec00", secondary: "#ff4f00"}
]

gameWorld.difficulty = 0;
gameWorld.unlocked = 0;

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

var Locked = Object.create(Behavior);
Locked.drawAfter = function (ctx) {
  if (this.entity.level > gameWorld.unlocked) {
    ctx.globalAlpha = this.entity.opacity;
    ctx.drawImage(Resources.lock.image, this.entity.x - this.entity.scale * this.entity.w, this.entity.y - 12, this.entity.scale * this.entity.w, this.entity.scale * this.entity.h);
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
SpriteFont.onDraw = function (ctx) {
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

var ngio, scoreboards, medals;
window.addEventListener("DOMContentLoaded", function () {

  ngio = new Newgrounds.io.core("45796:ekIHZEAA", "Nmg+7HXypANBgdE5kxFPgw==");

  ngio.getValidSession(function() {
    if (ngio.user) {
        /* 
         * If we have a saved session, and it has not expired, 
         * we will also have a user object we can access.
         * We can go ahead and run our onLoggedIn handler here.
         */
      console.log('logged in');
    //    onLoggedIn();
    } else {
        /*
         * If we didn't have a saved session, or it has expired
         * we should have been given a new one at this point.
         * This is where you would draw a 'sign in' button and
         * have it execute the following requestLogin function.
         */
      console.log('not logged in');
    }

  });

  /* vars to record any medals and scoreboards that get loaded */

  /* handle loaded medals */
  function onMedalsLoaded(result) {
    if (result.success) medals = result.medals;
  }

  /* handle loaded scores */
  function onScoreboardsLoaded(result) {
    if (result.success) scoreboards = result.scoreboards;
  }



  /* load our medals and scoreboards from the server */
  ngio.queueComponent("Medal.getList", {}, onMedalsLoaded);
  //ngio.queueComponent("ScoreBoard.getBoards", {}, onScoreboardsLoaded);
  ngio.executeQueue();
});