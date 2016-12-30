function normalize (x1, y1, x2, y2) {
	var d = distance(x1, y1, x2, y2);
	return {x: (x2 - x1) / d, y: (y2 - y1) / d};
}

var HexPathfind = Object.create(Pathfind);
// changed to check hex-grid based coordinates
HexPathfind.start = function () {
	var grid = [];
	var e = Object.create(Hex).init(this.bound.min.x + this.cell_size / 2, this.bound.min.y + this.cell_size / 2, this.cell_size / 2);
  console.log(e);
	e.family = "code";
	e.setCollision(Polygon);
	this.gridsize = {x: Math.floor(gameWorld.width / this.cell_size), y: Math.floor(gameWorld.height / (this.cell_size * 0.75))};
	var objects = this.layer.entities.filter( function (e) { return e.obstacle; });
  for (var i = 0; i < this.gridsize.y; i++) {
		e.y = i * 3 * this.cell_size / 4;
		for (var j = -i; j < this.gridsize.x; j++) {
			e.x = j * this.cell_size + i * this.cell_size / 2;
  		var distance = 1;
			var c = {x: j, y: i};
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
// changed to draw a Hexagon, and at the right place...
HexPathfind.draw = function (ctx) {
	if (!CONFIG.debug) return;
	if (this.grid) {
		ctx.globalAlpha = 0.3;
		ctx.fillStyle = this.route && this.route.length > 0 ? "green" : "yellow";
		for (var i = 0; i < this.grid.length; i++) {
			for (var j = 0; j < this.grid[i].length; j++) {
				if (this.grid[i][j].distance > 1) {
        	var h = Object.create(Hex).init(i * this.cell_size + j * this.cell_size / 2, j * this.cell_size * 0.75, this.cell_size / 2);
          h.opacity = 0.3;
          h.draw(ctx);
        }
			}
		}
    
		if (this.route) {
			ctx.fillStyle = "red";
			for (var i = 0; i < this.route.length; i++) {
				var h = Object.create(Hex).init(this.route[i].x * this.cell_size + this.route[i].y * this.cell_size / 2, this.route[i].y * this.cell_size * 0.75, 16);
        h.opacity = 0.5;
        h.draw(ctx);
			}
		}
		
		if (this.target) {
    	var h = Object.create(Hex).init(this.target.x, this.target.y, 16);
      h.color = "blue";
			h.draw(ctx);
		}

		ctx.globalAlpha = 1;
	} else {
	}
}
HexPathfind.resetCost = function () {
	if (this.grid) {
		for (var i = -20; i < this.grid.length; i++) {
    	if (this.grid[i]) {
      	for (var j = -20; j < this.grid[i].length; j++) {
          if (this.grid[i][j])
            this.grid[i][j].cost = 999999;
        }
      }			
		}
	}
}
HexPathfind.getNeighbors = function (node) {
	var x = node.x, y = node.y;
	var neighbors =[];
	var right = false, left = false;
	for (var i = -1; i <= 1; i++) {
  	var nx = x + i;
  	if (i != 0) {
      if (this.grid[nx] && this.grid[nx][y])
        neighbors.push(this.grid[nx][y]);
      if (this.grid[nx] && this.grid[nx][y - i])
        neighbors.push(this.grid[nx][y - i]);
    } else {
    	if (this.grid[nx] && this.grid[nx][y + 1])
        neighbors.push(this.grid[nx][y + 1]);
      if (this.grid[nx] && this.grid[nx][y - 1])
        neighbors.push(this.grid[nx][y - 1]);
    }
  }
	//console.log('n', neighbors.length);
	return neighbors;
}
HexPathfind.update = function (dt) {
	var rate = 5, desired_velocity = 100;
	if (!this.target) return;
	if (this.grid) {
		if (this.route && this.route.length > 0) {
			if (this.goal) {
				this.entity.animation = 1;
				var n = normalize(this.entity.x, this.entity.y, this.goal.x, this.goal.y);
				this.entity.velocity.x = n.x * desired_velocity;
				this.entity.velocity.y = n.y * desired_velocity;
				this.entity.angle = lerp(this.entity.angle, angle(this.entity.x, this.entity.y, this.goal.x, this.goal.y), 2 * rate * dt);

				if (distance(this.entity.x, this.entity.y, this.goal.x, this.goal.y) < 4) {
					this.entity.angle = angle(this.entity.x, this.entity.y, this.goal.x, this.goal.y);
					this.goal = undefined;
					this.entity.velocity = {x: 0, y: 0};
				}
				//console.log(this.goal);
			} else {
				var next = this.route.pop();
				if (next) {
					this.goal = {x: next.y * GLOBALS.width / 2 + next.x * GLOBALS.width, y: next.y * GLOBALS.height};
				}
			}
		} else {
			var i = toGrid(this.entity.x, this.entity.y);
      var t = toGrid(this.target.x, this.target.y);
			if (this.grid[i.x] && this.grid[i.x][i.y] && this.grid[t.x] && this.grid[t.x][t.y]) {
				this.resetCost();
				this.route = this.a_star(this.grid[i.x][i.y], [this.grid[t.x][t.y]]);
        if (!this.route) console.log(t);
			}
			else {
				this.entity.animation = 0;
			}
		} 
	}
	else {
		this.start();
	}
}