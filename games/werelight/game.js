//push to raindrop
Layer.update = function (dt) {
  if (this.paused === true) {
  	return;
  } else if (this.paused > 0) {
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
};
// raindrop push
Layer.drawOrder = function () {
    var t = this;
    return this.entities.sort(function (a, b) {
      if (a.z < b.z) return -1;
      else if (a.z === b.z && a.y < b.y) return -1;
      else return 1;
    });
};
Layer.draw = function (ctx) {
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.ctx.save();
  this.camera.draw(this.ctx);

  if (this.drawOrder) {
    var entities = this.drawOrder();
  } else {
    var entities = this.entities;
  }

  for (var i = 0; i < entities.length; i++) {
    entities[i].draw(this.ctx);
  }
  this.ctx.restore();
};

// tilesize, min, rate, max... grid
var Grid = Object.create(Behavior);
Grid.update = function (dt) {
	if (this.target) {
  	this.entity.x = lerp(this.entity.x, this.target.x, dt * this.rate);
  	this.entity.y = lerp(this.entity.y, this.target.y, dt * this.rate);
    if (this.entity.x === this.target.x && this.entity.y === this.target.y) {
    	if (this.callback) this.callback();
      this.target = undefined;
    }
  }
}
Grid.toXY = function (coord) {
	return {x: coord.x * this.tilesize + this.min.x, y: coord.y * this.tilesize + this.min.y};
}
Grid.toGrid = function (coord) {
  //console.log(coord.x, coord.y, this.tilesize);
	return {
  	x: Math.round((coord.x - this.min.x) / this.tilesize),
  	y: Math.round((coord.y - this.min.y) / this.tilesize)
  }
}
Grid.possible = function (coord) {
	if (this.solid(coord)) return false;
  else return this.available(coord);
}
Grid.solid = function (coord) {
	var g = this.toGrid(coord);
  if (this.grid[g.x] && this.grid[g.x][g.y]) return this.grid[g.x][g.y].solid;
  else return false;
}
Grid.available = function (coord) { 
	return between(coord.x, this.min.x, this.max.x) && between(coord.y, this.min.y,this.max.y);
};
Grid.select = function (coord) {
  var t = this.toXY(this.toGrid(coord));
  if (this.possible(t)) this.target = t;
}
Grid.draw = function (ctx) {
	if (this.show) {
		ctx.strokeStyle = "black";
		ctx.lineWidth = 4;
  	for (var i = this.min.x; i <= this.max.x; i += this.tilesize) {
    	for (var j = this.min.y; j <= this.max.y; j += this.tilesize) {
      	if (this.possible({x: i, y: j})) {
        	ctx.strokeRect(i - this.tilesize / 2, j - this.tilesize / 2, this.tilesize, this.tilesize);
        }
      }
    }
  }
}

var Pawn = Object.create(Grid); // pawn, king
Pawn.available = function (coord) {
	var t = this.toXY(this.toGrid(this.entity));
	return between(coord.x, t.x - this.tilesize, t.x + this.tilesize) && between(coord.y, t.y - this.tilesize, t.y + this.tilesize);
};

var Bishop = Object.create(Grid);
Bishop.available = function (coord) {
	var t = this.toGrid(this.entity), c = this.toGrid(coord);
  return (t.x + t.y) % 2 == (c.x + c.y) % 2;
};

var Rook = Object.create(Grid);
Rook.available = function (coord) {
	var t = this.toGrid(this.entity), c = this.toGrid(coord);
  return (t.x === c.x) || (t.y === c.y);
};

var Knight = Object.create(Grid);
Knight.visited = function (coord) {
	var g = this.toGrid(coord);
  if (this.grid[g.x] && this.grid[g.x][g.y]) return this.grid[g.x][g.y].visited;
  else return false;
}
Knight.possible = function (coord) {
	if (this.solid(coord)) return false;
	if (this.visited(coord)) return ALLOW_VISITED;
  else return this.available(coord);
}
Knight.available = function (coord) {
	var t = this.toGrid(this.entity), c = this.toGrid(coord);
  return ((Math.abs(c.x - t.x) + Math.abs(c.y - t.y)) === 3) && (Math.abs(c.x - t.x) < 3 && Math.abs(c.y - t.y) < 3);
};

var Hungry = Object.create(Behavior);
Hungry.setTarget = function () {
 if (this.entity.grid) {
  	var x = this.target.x - this.entity.x, y = this.target.y - this.entity.y;
    if (Math.abs(x) > Math.abs(y)) {
    	this.entity.grid.select({x: this.entity.x + this.entity.grid.tilesize * sign(x), y: this.entity.y});
    } else {
    	this.entity.grid.select({x: this.entity.x, y: this.entity.y + this.entity.grid.tilesize * sign(y)});
    }
  }
}

// push to raindrop:: add closure to loadresources to avoid confusing names, loaded data...
World.loadResources = function () {
  if (!this.gameInfo.resources) return;
  //this.setupControls();
  this.initAudio();

  this.resourceLoadCount = 0;
  this.resourceCount = this.gameInfo.resources.length;
  this.ctx.fillStyle = "gray";
  this.ctx.fillRect(this.width / 2 - 25 * this.resourceCount + i * 50, this.height / 2 - 12, 50, 25);      
  this.ctx.fillText("loading...", this.width / 2, this.height / 2 - 50);
  var w = this;

  for (var i = 0; i < this.gameInfo.resources.length; i++ ) {
    (function () {
      var res = w.gameInfo.resources[i].path;
      var e = res.indexOf(".");
      var name = res.substring(0, e);
      var ext = res.substring(e, res.length);
      if (ext == ".png") {
        Resources[name] = {image: new Image(), frames: w.gameInfo.resources[i].frames || 1, speed: w.gameInfo.resources[i].speed || 1, animations: w.gameInfo.resources[i].animations || 1 };
        Resources[name].image.src = "res/" + res;
        Resources[name].image.onload = function () {
          w.progressBar();
        }
      }
      else if (ext == ".ogg") {
        w.loadOGG(res, name);
  /*        Resources[name] = {sound: new Audio("res/" + res, streaming=false)};
        w.progressBar();
        Resources[name].sound.onload = function () {
          console.log("loaded sound");
        }*/
      }
      else if (ext == ".wav") {
        w.loadOGG(res, name);
      }
      else if (ext == ".js") {
        var request = new XMLHttpRequest();
        request.open("GET", "res/" + res, true);
        request.onload = function () {
          w.sceneInfo = request.response;
          w.progressBar();
        };
        request.send();
      }
      else if (ext == ".json") {
        var request = new XMLHttpRequest();
        request.open("GET", "res/" + res, true);
        request.onload = function () {
          Resources[name] = JSON.parse(request.response);
          w.progressBar();
        };
        request.send();
      }
    })();
  }
};

function btn_hover () {
  if (this.color !== "#999")
  {
    this.oldColor = this.color;
    this.color = "#999";
  }
}
function btn_unhover () {
  if (this.color !== this.oldColor && this.oldColor !== undefined) {
    this.color = this.oldColor;
    this.oldColor = undefined;
  }
}
// fix me: add this to layer, replace 'on-button'
function select (layers, e, family) {
  for (var i = 0; i < layers.length; i++) {
    for (var j = 0; j <layers[i].entities.length; j++) {
      var entity = layers[i].entities[j];
      if (family && entity.family !== family) {}
      else if (e.x >= entity.x - entity.w/2 && e.x <= entity.x + entity.w/2 && e.y >= entity.y - entity.h/2 && e.y <= entity.y + entity.h/2) {
        return entity;
      }
    }
  }
}

var ALLOW_SOLID = false, ALLOW_VISITED = false, TILESIZE = 16, OFFSET = {x: 0, y: 0}, WIDTH = 320, HEIGHT = 180, COLUMNS = Math.ceil(WIDTH / TILESIZE), ROWS = Math.ceil(HEIGHT / TILESIZE);

var current_level = 0;

var gameWorld = Object.create(World).init(320, 180, "index.json");