document.addEventListener( "DOMContentLoaded", function () {
	var canvas = document.getElementById("game");
	var ctx = canvas.getContext("2d");

  ctx.drawRotatedImage = function (image, x, y, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.drawImage(image, -image.width/2, -image.height/2);
    ctx.translate(-x, -y);
    ctx.restore();
  }

  var keys = {up: false, down: false, right: false, left: false};

	var shipImage = new Image();
	shipImage.src = "ship.png";

	var player = Object.create(Ship).init(shipImage, GAME.width/2,GAME.height/2, "player");
	player.speed = 200;
  entities.push(player);

	var camera = Object.create(Camera);
  camera.x = player.x, camera.y = player.y;

	canvas.addEventListener("click", function (e) {
    e.preventDefault();
    if (player.canShoot()) {
      var theta = player.angle;
			var b = Object.create(Projectile).init(player.getX(), player.getY(), theta, 1000, "player");
			entities.push(b);
      var b = Object.create(Projectile).init(player.getX(), player.getY(), theta + Math.PI / 12, 1000, "player");
			entities.push(b);
      var b = Object.create(Projectile).init(player.getX(), player.getY(), theta - Math.PI / 12, 1000, "player");
			entities.push(b);
			player.cooldown = 0.2;
			player.temperature += 45;
		}
	});

	document.addEventListener("keydown", function (e) {
		switch (e.keyCode) {
      case 65:
        keys.left = true;
        break;
      case 68:
        keys.right = true;
        break;
      case 83:
        keys.down = true;
        break;
      case 87:
        keys.up = true;
				break;
			case 32:
				player.shield = true;
			default:
				return;
		}
	});

	document.addEventListener("keyup", function (e) {
		switch (e.keyCode) {
      case 65:
        keys.left = false;
        break;
      case 68:
        keys.right = false;
        break;
      case 83:
        keys.down = false;
        break;
      case 87:
        keys.up = false;
				break;
      case 32:
				player.shield = false;
				return;
		}
	});

	var startTime = new Date();

  for (var i = 0; i < 3; i++ ) {
      var b = Object.create(Enemy).init(shipImage, Math.random() * GAME.width, 100, player);
      b.health = 15;
      b.angle = Math.PI / 2;
      entities.push(b);
    console.log(i, entities.length, "HI");
  }

	function step () {

		var newTime = new Date();
		var dt = (newTime - startTime) / 1000;
		startTime = newTime;

		ctx.clearRect(0,0,canvas.width,canvas.height);
		ctx.save();

		camera.update(dt);
		camera.draw(ctx);

    ctx.fillStyle = "gray";
    ctx.beginPath();
    for (var i = 0.5; i < GAME.width; i += 256) {
      for (var j = 0.5; j < GAME.height; j += 256) {
        if ((i + j - 1) % 512 == 0) {
          ctx.rect(i, j, 256, 256);
        }
      }
    }
    ctx.closePath();
    ctx.fill();

    if (keys.right) player.d_angle = Math.PI;
    else if (keys.left) player.d_angle = -1*Math.PI;
    else player.d_angle = 0;

    if (keys.up) player.acel = 100;
    //else if (keys.down) player.acel = -100;
    else player.acel = 0;

		for (var i = 0; i < entities.length; i++) {
			entities[i].update(dt);
		}
		for (var i = 0; i < entities.length; i++) {
			entities[i].draw(ctx);
		}
		//check collisions
		for (var i = 0; i < entities.length; i++) {
			for (var j = i + 1; j < entities.length; j++) {
        if (entities[i].collideable == false || entities[j].collideable == false) {
          continue;
        }
				else if (entities[i].team != entities[j].team && entities[i].type != entities[j].type) {
					checkCollision(entities[i], entities[j]);
				}
			}
		}

    var px = player.x - canvas.width/2 + Math.cos(player.angle) * canvas.width/2;
    var py = player.y - canvas.height/2 + Math.sin(player.angle) * canvas.height/2;
    var dp = distance(camera.x,camera.y,px,py);
    camera.speed = Math.min(300,6 * Math.floor(dp > 10 ? dp : 0));
		camera.angle = angle(camera.x, camera.y,px,py);

		ctx.restore();

		for (var i = 0; i < entities.length; i++) {
			if (entities[i].alive === false) {
				entities.splice(i, 1);
			}
		}

		//overlay (fixed position)

		ctx.fillStyle = "black";
		ctx.fillRect(10,10,108,28);
		ctx.fillRect(canvas.width - 118,10,108,28)

		ctx.fillStyle = "white"
		ctx.fillRect(14,14,player.temperature, 20);
		ctx.fillRect(canvas.width - 114, 14,player.health,20);

		window.requestAnimationFrame(step);

	}

  window.requestAnimationFrame(step);

}, false);
