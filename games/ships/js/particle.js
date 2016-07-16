var Particles = Object.create(Entity);
Particles.init = function (x, y, createParticle, rate, max, random) {
  this.behaviors = [];
  this.particles = [];
  this.x = x, this.y = y, this.createParticle = createParticle;
  this.rate = rate, this.max = max || 0, this.random = random || 1;
  this.time = 0;
  this.count = 0;
  return this;
}
Particles.update = function (dt) {
  this.time += dt;
  if (this.max !== 0 && this.count > this.max ) {
    if (this.particles.length <= 0) this.alive = false;
  }
  else if (this.time > this.rate && Math.random() <= this.random) {
    this.particles.push(this.createParticle(this.x, this.y));
    this.count += 1;
    this.time = 0;
  }
  for (var i = 0; i < this.particles.length; i++) {
    this.particles[i].update(dt);
  }
  for (var i = 0; i < this.particles.length; i++) {
    if (!this.particles[i].alive) {
      this.particles.splice(i, 1);
    }
  }
  for (var i = 0; i < this.behaviors.length; i++) {
    this.behaviors[i].update(dt);
  }
}
Particles.onDraw = function (ctx) {
  for (var i = 0; i < this.particles.length; i++) {
    this.particles[i].draw(ctx);
  }
}