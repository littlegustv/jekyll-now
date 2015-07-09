document.addEventListener("DOMContentLoaded", function () {

	var canvas = document.getElementById("webgl");
	var gl = canvas.getContext("experimental-webgl");

	var vertex_shader = createShaderFromScriptElement(gl, "2d-vertex-shader");
	var fragment_shader = createShaderFromScriptElement(gl, "2d-fragment-shader");

	var program = createProgram(gl, [vertex_shader, fragment_shader]);
	gl.useProgram(program);

	var Polygon = {
		alive: true,
		nohit: 0,
		team: 'e1',
		init: function (x, y, radius, sides, direction, speed) {
			this.x = x, this.y = y, this.radius = radius, this.sides = sides, this.direction = direction, this.speed = speed != undefined ? speed : 0;
			this.color = [Math.random(), Math.random(), Math.random(), 0.5], this.angle = 0;
			this.vertices = [];
			this.type = "polygon";
			this.update(0);
			//console.log("WTF", this.vertices);
			return this;
		},
		draw: function (gl) {
			var v = [];
			for (var i = 0; i < this.sides; i++) {
				var v = v.concat([this.x, this.y, this.vertices[i][0], this.vertices[i][1], this.vertices[(i+1)%this.sides][0], this.vertices[(i+1)%this.sides][1]]);
			}
			
			gl.uniform4f(colorLocation, this.color[0], this.color[1], this.color[2], this.color[3]);
			gl.uniform1f(flickerLocation, this.nohit);
			
			gl.bufferData(
				gl.ARRAY_BUFFER, 
				new Float32Array(v), 
				gl.STATIC_DRAW);
			
			gl.drawArrays(gl.TRIANGLES, 0, 3*this.sides);
		},
		update: function (dt) {
			if (this.nohit > 0) { this.nohit -= dt; }
			this.angle += dt * Math.PI / 4;
			this.x += this.speed * Math.cos(this.direction) * dt;
			this.y += this.speed * Math.sin(this.direction) * dt;
			var theta = 2 * Math.PI / this.sides;
			this.vertices = [];
			for (var i = 0; i < this.sides; i++) {
				var x = this.x + this.radius * Math.cos(this.angle + i * theta);
				var y = this.y + this.radius * Math.sin(this.angle + i * theta);
				this.vertices.push([x, y]);
			}
			if (this.x < 0) {	this.x = 0;		this.direction = Math.PI - this.direction;			}
			else if (this.x > canvas.width) {	this.x = canvas.width;		this.direction = Math.PI - this.direction;			}
			else if (this.y < 0) {	this.y = 0;		this.direction = 2*Math.PI - this.direction;			}
			else if (this.y > canvas.height) {	this.y = canvas.height;		this.direction = 2*Math.PI - this.direction;			}			
		},
		collide: function (other) {
			if (other.team != this.team) {
				this.nohit = 1.5;
				if (other.type == "shard" && this.type == "polygon") {
					console.log(this.vertices, this.vertices[0], this.vertices[0][0]);
					//console.log("here");
					var mx = other.x, my = other.y;
					var theta = angle(this.x, this.y, mx, my);
					var closest = this.vertices.sort(function (a, b) { return distance(a[0], a[1], mx, my) - distance(b[0], b[1], mx, my); });
					var v = [closest[0], closest[1], closest[2]];
					var c = this.color;
					var o = Object.create(Fragment).init(v, c, theta, 0);
					o.team = this.team;
					console.log(o, o.vertices[0], o.x, o.y);
					polygons.push(o);
					
					//console.log(o.type, o.vertices, v, closest, this.vertices);

					//console.log(polygons, o);
				}
				this.sides -= 1;
			}
		}
	}
	var Shard = Object.create(Polygon);
	Shard.init = function (vertices, color, direction, speed) {
		this.vertices = vertices, this.color = color, this.direction = direction, this.speed = speed;
		this.x = (this.vertices[0][0] + this.vertices[1][0] + this.vertices[2][0] ) /3;
		this.y = (this.vertices[0][1] + this.vertices[1][1] + this.vertices[2][1] ) /3;
		this.radius = 2 * distance(this.x, this.y, this.vertices[0][0], this.vertices[0][1]);
		this.sides = 3;
		this.type = "shard";
		this.angle = 0;
		return this;
	};
	Shard.draw = function (gl) {
		gl.uniform4f(colorLocation, this.color[0], this.color[1], this.color[2], this.color[3]);
			gl.uniform1f(flickerLocation, this.nohit);

		gl.bufferData(
			gl.ARRAY_BUFFER, 
			new Float32Array(this.vertices[0].concat(this.vertices[1]).concat(this.vertices[2])), 
			gl.STATIC_DRAW);
		
		gl.drawArrays(gl.TRIANGLES, 0, 3);
	};
	Shard.update = function (dt) {
		if (this.nohit > 0) this.nohit -= dt;
		for (var i = 0; i < this.vertices.length; i++) {
			this.vertices[i][0] += this.speed * Math.cos(this.direction) * dt;
			this.vertices[i][1] += this.speed * Math.sin(this.direction) * dt;
		}
	};
	var Fragment = Object.create(Shard);
	Fragment.type = "fragment";
	Fragment.update = function (dt) {
		this.angle += dt * Math.PI / 4;
		if (this.nohit > 0) this.nohit -= dt;
		for (var i = 0; i < this.vertices.length; i++) {
			var c = Math.cos(dt * Math.PI / 4);
			var s = Math.sin(dt * Math.PI / 4);
			
			var xnew = this.vertices[i][0] - this.x;
			var ynew = this.vertices[i][1] - this.y;
			
			this.vertices[i][0] = this.x + xnew * c + ynew * s;
			this.vertices[i][1] = this.y + xnew * s + ynew * c;
		}
	};

	var positionLocation = gl.getAttribLocation(program, "a_position");
	var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
	gl.uniform2f(resolutionLocation, canvas.width, canvas.height);


	var buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.enableVertexAttribArray(positionLocation);
	gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

	var colorLocation = gl.getUniformLocation(program, "u_color");
	var flickerLocation = gl.getUniformLocation(program, "u_flicker");

	var test = Object.create(Polygon).init(600,450,60,6,Math.PI / 12,300);
	
	var player = Object.create(Polygon).init(400,200,60,10,0,50);
	player.team = "p1";
	var polygons = [test,player, Object.create(Shard).init([[10,10],[100,10],[10,100]],[1,0,0,0.5],0,100)];

	canvas.addEventListener("click", function (e) {
		if (player.sides > 3) {
			var mx = e.offsetX, my = canvas.height - e.offsetY;
			var theta = angle(player.x, player.y, mx, my);
			var closest = player.vertices.sort(function (a, b) { return distance(a[0], a[1], mx, my) - distance(b[0], b[1], mx, my); });
			var v = [closest[0], closest[1], closest[2]];
			var c = player.color;
			var o = Object.create(Shard).init(v, c, theta, 500);
			o.team = "p1";
			polygons.push(o);
			player.sides -= 1;			
		}
	}, false);

	window.addEventListener("focus", function () {
		startTime = new Date();
	});
	
	window.addEventListener("keydown", function (e) {
		if (e.keyCode == 65) { player.direction += Math.PI / 36; }
		else if (e.keyCode == 68) { player.direction -= Math.PI / 36; }
	});

	var startTime = new Date();

	function step () {

		var newTime = new Date();
		var dt = (newTime - startTime) / 1000;
		startTime = newTime;
		
		gl.clearColor(0.0, 0.0, 0.0, 0.0);
		gl.clear(gl.COLOR_BUFFER_BIT);
		for (var i = 0; i < polygons.length; i++) {
			polygons[i].update(dt);
		}
		for (var i = 0; i < polygons.length; i++) {
			polygons[i].draw(gl);
		}
		for (var i = 0; i < polygons.length; i++) {
			for (var j = i + 1; j < polygons.length; j++) {
				if (checkCollisions(polygons[i], polygons[j])) {
					polygons[i].collide(polygons[j]);
					polygons[j].collide(polygons[i]);
				}
			}
		}
		
		for (var i = 0; i < polygons.length; i++) {
			if (polygons[i].sides < 3) {
				polygons.splice(i, 1);
			}
		}
		
		gl.flush();
		
		window.requestAnimationFrame(step);

	}

	window.requestAnimationFrame(step);

}, false);