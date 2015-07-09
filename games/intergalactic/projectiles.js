var Projectile = Object.create(Entity);
Projectile.init = function (x, y, angle, speed, team) {
  this.x = x, this.y = y, this.angle = angle, this.speed = speed;
  this.team = team, this.radius = 4, this.type = "bullet";
  this.duration = 10;
  return this;
}
Projectile.checkBounds = function () {
  if (this.x > GAME.width || this.x < 0 || this.y > GAME.height || this.y < 0) {
    this.alive = false;
  }
}
Projectile.handleCollision = function (obj) {
  this.alive = false;
  var e = Object.create(Explosion).init(this.x, this.y, 2 * this.radius, "rgba(200,100,45,0.7");
  entities.push(e);
}
Projectile.draw = function (ctx) {
	ctx.lineWidth = 1;
	ctx.strokeStyle = "black";
  ctx.beginPath();
  ctx.arc(this.getX(), this.getY(), this.radius, 0, Math.PI * 2, true);
  ctx.stroke();
}

var Missile = Object.create(Projectile);
Missile.init = function (x, y, angle, speed, team) {
  this.x = x, this.y = y, this.angle = angle, this.speed = speed;
  this.team = team, this.radius = 4, this.type = "bullet";
  this.duration = 5;
  return this;
}
Missile.update = function (dt) {
	var t = this;
	var targets = entities.filter( function (e) { return t.team != e.team && t.type != e.type; });
	var target = targets.sort( function (a, b) { return distance(t.x, t.y, a.x, a.y) - distance(t.x, t.y, b.x, b.y); })[0];
	if (target != undefined) {
	  if (clockwise(this.angle, angle(this.x, this.y, target.x, target.y))) {
		this.d_angle = -Math.PI/2;
	  } else { this.d_angle = Math.PI/2; }

	  this.angle += this.d_angle * dt;		
	}
    this.x += dt * this.speed * Math.cos(this.angle);
    this.y += dt * this.speed * Math.sin(this.angle);
    this.checkBounds();
	this.duration -= dt;
	if (this.duration < 0) this.alive = false;
}
Missile.draw = function (ctx) {
	ctx.lineWidth = 1;
	ctx.strokeStyle = "black";
  ctx.beginPath();
  ctx.moveTo(this.getX() + 8 * Math.cos(this.angle), this.getY() + 8 * Math.sin(this.angle));
  ctx.lineTo(this.getX() + 8 * Math.cos(this.angle + 2.7), this.getY() + 8 * Math.sin(this.angle + 2.7));
  ctx.lineTo(this.getX() + 8 * Math.cos(this.angle - 2.7), this.getY() + 8 * Math.sin(this.angle - 2.7));
  ctx.closePath();
  ctx.stroke();
}

var Bullet = Object.create(Projectile);
Bullet.init = function (x, y, angle, speed, team) {
  this.x = x, this.y = y, this.angle = angle, this.speed = speed;
  this.team = team, this.radius = 1, this.type = "bullet";
  this.duration = 1;
  return this;
}