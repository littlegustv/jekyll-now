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
	    			var ctx = c.getContext("2d");
	    			var x = this.x, y = this.y, opacity = this.opacity;
	    			this.x = this.w / 2, this.y = this.h / 2, this.opacity = 1;
	    			this.draw(ctx);
	    			this.imageData = ctx.getImageData(0, 0, this.w, this.h).data;
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
				if (m_data[my + mx] == 255 && n_data[ny + nx] == 255)
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
	}
}