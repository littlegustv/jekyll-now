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
Layer.drawOrder = function () {
	return this.entities.sort(function (a, b) { 
		if (a.z && b.z && b.z != a.z) return a.z - b.z;
		else if (a.y && b.y && a.y != b.y) return a.y - b.y;
		else return a.x - b.x;
	});
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
		ctx.strokeStyle = "white";
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

var TILESIZE = 20, OFFSET = {x: 90, y: 20};
var gameWorld = Object.create(World).init(320, 180, "index.json");