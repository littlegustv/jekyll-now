var Behavior = {
	doVelocity: function (config) {
		return function (dt) {
			this.x += dt * this.velocity.x;
			this.y += dt * this.velocity.y;	
		};
	},
	doAcceleration: function (config) {
		return function (dt) {
			this.velocity.x += dt * this.acceleration.x;
			this.velocity.y += dt * this.acceleration.y;
		};
	},
	doAnimations: function (config) {
		return function (dt) {
			this.frameDelay -= dt;
			if (this.frameDelay <= 0) {
				this.frameDelay = this.maxFrameDelay;
				this.frame = (this.frame + 1) % this.maxFrame;
			}
		};
	},
	doFade: function (config) {
		return function (dt) {
			if (this.opacity < 1) {
				this.opacity += dt / (config && config.speed ? config.speed : 1);
			}
		}
	},
	doGrowth: function (config) {
		return function (dt) {
			this.h += dt / (config && config.speed ? config.speed : 1);
			this.w += dt / (config && config.speed ? config.speed : 1);
		}
	}
}