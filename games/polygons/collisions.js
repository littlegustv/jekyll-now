function distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function angle(x1, y1, x2, y2) {
  return Math.atan2(y2 - y1, x2 - x1);
}

function dot (v1, v2) {
	return v1[0] * v2[0] + v1[1] * v2[1];
}

function rotatePoint(cx, cy, angle, px, py)
{
  var s = sin(angle);
  var c = cos(angle);

  // translate point back to origin:
  px -= cx;
  py -= cy;

  // rotate point
  var xnew = px * c - py * s;
  var ynew = px * s + py * c;

  // translate point back:
  px = xnew + cx;
  py = ynew + cy;
  return [px, py];
}

function project(axes, object) {
	var min = dot(axes, object.vertices[0])
	var max = min;
	for (var i = 0; i < object.sides; i++) {
		var p = dot(axes, object.vertices[i]);
		if (p < min) min = p;
		else if (p > max) max = p;
	}
	return [min, max];
}

function overlap(p1, p2) {
    if ((p1[0] > p2[0] && p1[0] < p2[1]) || (p1[1] > p2[0] && p1[1] < p2[1])) {
        return true;
	}
    if ((p2[0] > p1[0] && p2[0] < p1[1]) || (p2[1] > p2[0] && p2[1] < p1[1])) {
        return true;
	}
    else {
        return false;
	}
}

function checkCollisions(o1, o2) {

	if (o1.team == o2.team) return false;
	else if (o1 == o2) return false;
	else if (o1.nohit > 0 || o2.nohit > 0) return false;
	
	var a1 = [];
	for (var i = 0; i < o1.vertices.length; i++) {
		a1.push([-1 *(o1.vertices[i][1] - o1.vertices[(i+1)%o1.sides][1]), o1.vertices[i][0] - o1.vertices[(i+1)%o1.sides][0]]);
	}
	var a2 = [];
	for (var i = 0; i < o2.vertices.length; i++) {
		a2.push([-1 *(o2.vertices[i][1] - o2.vertices[(i+1)%o2.sides][1]), o2.vertices[i][0] - o2.vertices[(i+1)%o2.sides][0]]);
	}
		
	var separate = false;
	
	for (var i = 0; i < a2.length; i++) {
		var p1 = project(a2[i], o1);
		var p2 = project(a2[i], o2);
		
		if (!overlap(p1, p2)) separate = true;
	}

	for (var i = 0; i < a1.length; i++) {
		var p1 = project(a1[i], o1);
		var p2 = project(a1[i], o2);
		
		if (!overlap(p1, p2)) separate = true;
	}
	
	return !separate;
	
}