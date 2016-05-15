var Behavior = {
	init: function (entity, config) {
		this.entity = entity;
		for (c in config) {
			this[c] = config[c];
		}
		return this;
	},
	start: function () {
	},
	update: function (dt) {
	},
	end: function () {
	},
	draw: function (ctx) {
	}
}

var Velocity = Object.create(Behavior);
Velocity.update = function (dt) {
	this.entity.x += dt * this.entity.velocity.x;
	this.entity.y += dt * this.entity.velocity.y;	
};

var Accelerate = Object.create(Behavior);
Accelerate.update = function (dt) {
	this.entity.velocity.x += dt * this.entity.acceleration.x;
	this.entity.velocity.y += dt * this.entity.acceleration.y;
	if (this.maxSpeed) {
		this.entity.velocity.x = clamp(this.entity.velocity.x, -this.maxSpeed, this.maxSpeed);
		this.entity.velocity.y = clamp(this.entity.velocity.y, -this.maxSpeed, this.maxSpeed);
	}
};

var Animate = Object.create(Behavior);
Animate.update = function (dt) {
	this.entity.frameDelay -= dt;
	if (this.entity.frameDelay <= 0) {
		this.entity.frameDelay = this.entity.maxFrameDelay;
		this.entity.frame = (this.entity.frame + 1) % this.entity.maxFrame;
	}
};

var Fade = Object.create(Behavior);
Fade.start = function () {
	if (this.entity.active) {
		this.entity.opacity = 0;
	}
	this.entity.activate = function () {
		this.entity.opacity = 0;
		this.entity.active = true;
	}
};
Fade.update = function (dt) {
	if (this.entity.opacity < 1) {
		this.entity.opacity += dt / (this.speed ? this.speed : 1);
	}
};

var Bound = Object.create(Behavior);
Bound.update = function (dt) {
	this.entity.x = clamp(this.entity.x, this.min.x, this.max.x);
	this.entity.y = clamp(this.entity.y, this.min.y, this.max.y);
};

var DrawHitBox = Object.create(Behavior);
DrawHitBox.draw = function (ctx) {
	ctx.fillStyle = "red";
	ctx.fillRect(this.entity.x - this.entity.w / 2, this.entity.y - this.entity.h / 2, this.entity.w, this.entity.h);
}


var Pathfind = Object.create(Behavior);
Pathfind.start = function () {
	// create grid, path
	var grid = [];
	var e = Object.create(Entity).init(this.bound.min.x + this.cell_size / 2, this.bound.min.y + this.cell_size / 2, this.cell_size, this.cell_size);
	e.family = "code";
	e.setCollision(Polygon);

	var objects = this.scene.entities.filter( function (e) { return (e.solid && e.family == "neutral"); });
	for (var i = this.bound.min.x + this.cell_size / 2; i < this.bound.max.x; i += this.cell_size) {
		e.x = i;
		for (var j = this.bound.min.y + this.cell_size / 2; j < this.bound.max.y; j += this.cell_size) {
			e.y = j;
			var distance = 1;
			var c = {x: Math.floor(i / this.cell_size), y: Math.floor(j / this.cell_size)};
			for (var k = 0; k < objects.length; k++) {
				if (e.collision.onCheck(e, objects[k])) {
					distance = 99999999;
					break;
				} else {
				}
			}
			if (grid[c.x]) {
				grid[c.x][c.y] = {x: c.x, y: c.y, cost: 999999, distance: distance};
			} else {
				grid[c.x] = [];
				grid[c.x][c.y] = {x: c.x, y: c.y, cost: 999999, distance: distance};
			}
		}
	}
	this.grid = grid;
}
Pathfind.draw = function (ctx) {
	if (this.grid) {
		ctx.globalAlpha = 0.3;
		ctx.fillStyle = this.route && this.route.length > 0 ? "green" : "yellow";
		for (var i = 0; i < this.grid.length; i++) {
			for (var j = 0; j < this.grid[i].length; j++) {
				if (this.grid[i][j].distance > 1)
					ctx.fillRect(this.bound.min.x + this.cell_size * i, this.bound.min.y + this.cell_size * j, this.cell_size, this.cell_size);
			}
		}
		ctx.globalAlpha = 1;
	} else {
	}
}
Pathfind.getNeighbors = function (node) {
	var x = node.x, y = node.y;
	var neighbors =[];
	for (var i = x - 1; i <= x + 1; i += 2) {
		if (this.grid[i] && this.grid[i][y])
			neighbors.push(this.grid[i][y]);
	}
	for (var j = y - 1; j <= y + 1; j += 2) {
		if (this.grid[x] && this.grid[x][j])
			neighbors.push(this.grid[x][j]);
	}
	//console.log('n', neighbors.length);
	return neighbors;
}
Pathfind.a_star = function (start, goals) {
  start.cost = 0;
	var checked = [];
  var fringe = [start];
  var index = 0
  
  while (fringe.length > 0 && index < 1000) {
  	index += 1;
    var f = fringe.sort( function (a, b) { return a.cost < b.cost; }).pop();
    if (goals.indexOf(f) != -1) {
      var route = [];
      //ai.searching = false;
      while (f.from) {
      	route.push({x: f.x - f.from.x, y: f.y - f.from.y});
        g = f.from;
        f.from = undefined;
        f = g;
      }
      return route;
    }
    checked.push(f);
    this.getNeighbors(f).forEach( function (nw) {
    	if (checked.indexOf(nw) == -1) {
      	var d = f.cost + nw.distance;
        if (d < nw.cost) {
        	nw.cost = d;
          nw.from = f;
          fringe.push(nw);
        }
      }
    });
  }
  console.log("not found (max fringe size reached)", index, fringe.length);
  return [];
}
Pathfind.resetCost = function () {
	if (this.grid) {
		for (var i = 0; i < this.grid.length; i++) {
			for (var j = 0; j < this.grid[i].length; j++) {
				this.grid[i][j].cost = 999999;
			}
		}
	}
}
Pathfind.update = function (dt) {
	if (this.grid) {
		if (this.route && this.route.length > 0) {
			if (this.next) {
				var dx = 0.1 * this.next.x, dy = 0.1 * this.next.y;
				this.entity.x += dx, this.entity.y += dy;
				this.next.x -= dx, this.next.y -= dy;
				if (Math.abs(this.next.x) < 0.1 * this.cell_size && Math.abs(this.next.y) < 0.1 * this.cell_size) {
					this.next = undefined;
				}
			} else {
				var next = this.route.pop();
				if (next) {
					this.next = {x: this.cell_size * next.x, y: this.cell_size * next.y};
				}
			}
		} else {
			var i = Math.floor(this.entity.x / this.cell_size), j = Math.floor(this.entity.y / this.cell_size);
			var ti = Math.floor(this.target.x / this.cell_size), tj = Math.floor(this.target.y / this.cell_size);
			if (this.grid[i] && this.grid[i][j] && this.grid[ti] && this.grid[ti][tj]) {
				this.resetCost();
				this.route = this.a_star(this.grid[i][j], [this.grid[ti][tj]]);
			}
		}
	}
	else {
		this.start();
	}
}

var SimpleAI = Object.create(Behavior);
SimpleAI.update = function (dt) {
	//console.log(this.target);
	//console.log(this.target.x, this.entity.x, (this.entity.x > this.target.x ? -1 : 1))
	// FIX ME: obviously, once the screep is wrapping, you need to factor that in too...
	this.entity.velocity = {
		x: clamp( (this.entity.x > this.target.x ? -1 : 1) * Math.abs(this.entity.x - this.target.x) / 2, - SPEED.ship / 2, SPEED.ship / 2),
		y: clamp( (this.entity.y > this.target.y ? -1 : 1) * Math.abs(this.entity.y - this.target.y) / 2, - SPEED.ship / 2, SPEED.ship / 2)
	}
	if (this.entity.health < 5) {
		this.entity.removeBehavior(this);
	}
}

var Wrap = Object.create(Behavior);
Wrap.update = function (dt) {
	if (this.entity.x > this.max.x) {
		this.entity.x = this.min.x + (this.entity.x - this.max.x);
	} else if (this.entity.x < this.min.x) {
		this.entity.x = this.max.x  - (this.min.x - this.entity.x);
	}
}

var Behaviors = {
	velocity: Velocity,
	accelerate: Accelerate,
	animate: Animate,
	fade: Fade,
	bound: Bound
}