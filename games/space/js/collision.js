var Collision = {
	doBox: function (object) {
		if (this.x + this.w > object.x && this.x < object.x + object.w) {
			if (this.y + this.h > object.y && this.y < object.y + object.h) {
				return true;
			}
		}
		return false;
	},
	doPixelPerfect: function (object) {
		//var o1 = m, o2 = n;

		// this is a weird/hacky/exciting thing... so if an entity has the 'doPixelPerfect' collision, it will check for imageData, and create and supply its own function if it isn't found.
		if (!this.getImageData) {
			this.getImageData = function () {
			if (!this.imageData) {
	    			var c = document.createElement("canvas");
	    			c.width = this.w;
	    			c.height = this.h;
	    			var ctx = c.getContext("2d");
	    			ctx.imageSmoothingEnabled = false;
	    			var x = this.x, y = this.y, opacity = this.opacity;
	    			this.x = this.w / 2, this.y = this.h / 2, this.opacity = 1;
	    			this.draw(ctx);
	    			this.ig = ctx.getImageData(0, 0, this.w, this.h);
	    			this.imageData = this.ig.data;
	    			this.x = x, this.y = y, this.opacity = opacity;
	       			return this.imageData;
	    		}
	    		else {
	    			return this.imageData;
	    		}
		    };
		}

		if (!this.getImageData || !object.getImageData) return false;
    	
    	var m = this, n = object;
    	var n_data = n.getImageData();
		var m_data = m.getImageData();

		// if either does not have an imageData field, cannot find collision

        m = {x: m.getBoundX(), y: m.getBoundY(), w: m.w, h: m.h};
        n = {x: n.getBoundX(), y: n.getBoundY(), w: n.w, h: n.h};
		if (m.x + m.w < n.x || m.x > n.x + n.w)
			return false;
		if (m.y + m.h < n.y || m.y > n.y + n.h)
			return false;

		// find intersection...
		var minX = Math.max(m.x, n.x), minY = Math.max(m.y, n.y);
		var maxX =  Math.min(m.x + m.w, n.x + n.w), maxY = Math.min(m.y + m.h, n.y + n.h);
		
/**					************************					**/
/**					Compare in overlap range					**/
/**					(Pixel by pixel, if not 					**/
/**					transparent i.e. 255)   					**/
/**					************************					**/

		for (var j = 0; j < maxY - minY; j++)
		{
			for (var i = 0; i < maxX - minX; i++)
			{
				var my = ((minY - m.y) + j) * m.w * 4,
					mx = ((minX - m.x) + i) * 4 + 3;
				var ny = ((minY - n.y) + j) * n.w * 4,
					nx = ((minX - n.x) + i) * 4 + 3;
				if (m_data[my + mx] != 0 && n_data[ny + nx] != 0)
				{
				
/**					************************					**/
/**					PUSH OUT FROM EACH OTHER					**/
/**					************************					**/
/*
					o1.x = m.x < n.x ? o1.x - 1 : o1.x + 1;
					o2.x = n.x < m.x ? o2.x - 1 : o2.x + 1;
					o1.y = m.y < n.y ? o1.y - 1 : o1.y + 1;
					o2.y = n.y < m.y ? o2.y - 1 : o2.y + 1;*/
					return true;
				}
			}
		}
		return false;
	},
	handleSolid: function (other) { 
		if (other.solid) {
			var dx = Math.abs(this.x - other.x);
			var d = distance(this.x, this.y, other.x, other.y);
			var cross = distance(other.x, other.y, other.getBoundX(), other.getBoundY());
			console.log(dx, d, 0.5 * other.w, cross);
			var bounce = (this.bounce || 0) + (other.bounce || 0);
			if (Math.abs(dx / d) < Math.abs(0.5 * other.w / cross)) {
				console.log('vertical');
				this.y += this.getBoundY() < other.getBoundY() ? -2 : 2;
        		this.velocity.y = this.getBoundY() < other.getBoundY() ? Math.min(-1 * bounce * this.velocity.y, this.velocity.y) : Math.max(-1 * bounce * this.velocity.y, this.velocity.y);
        		this.acceleration.y = this.getBoundY() < other.getBoundY() ? Math.min(0, this.acceleration.y) : Math.max(0, this.acceleration.y);
        	} else {
        		console.log('horizontal')
				this.x += this.getBoundX() < other.getBoundX() ? -2 : 2;
        		this.velocity.x = this.getBoundX() < other.getBoundX() ? Math.min(-1 * bounce * this.velocity.x, this.velocity.x) : Math.max(-1 * bounce * this.velocity.x, this.velocity.x);
        		this.acceleration.x = this.getBoundX() < other.getBoundX() ? Math.min(0, this.acceleration.x) : Math.max(0, this.acceleration.x);
        	}//this.velY *= -1;
		}
	}
}