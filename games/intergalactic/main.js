document.addEventListener( "DOMContentLoaded", function () {
	var canvas = document.getElementById("game");
	var ctx = canvas.getContext("2d");
console.log(ctx.imageSmoothingEnabled);
	ctx.imageSmoothingEnabled = false;
	
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
	player.equipment.weapon = Object.create(Gun).init("basic", 100, 100, 100);
	player.equipment.engine = Object.create(Engine).init("basic", 100, 100, 1.0);
  entities.push(player);
 
	var s1 = Object.create(Shield).init("new", 100, 100, 100).position(GAME.width/2 + 400, GAME.height / 2 - 200);
	var w1 = Object.create(Weapon).init("new", 100, 100, 100).position(GAME.width/2 + 400, GAME.height / 2 - 400);
	var e1 = Object.create(Engine).init("new", 100, 100, 100).position(GAME.width/2 + 400, GAME.height / 2 - 300);
	entities.push(s1, w1);
	entities.push(e1);
 
  for (var i = 0; i < GAME.height; i += 100) {
	entities.push(Object.create(Solid).init(GAME.width/2, i, Math.random() * 50 + 100, "#114466"));
  }
  for (var i = 0; i < GAME.height; i += 80) {
	entities.push(Object.create(Solid).init(GAME.width/2, i, Math.random() * 50 + 80, "#335577"));
  }
  
  
	var camera = Object.create(Camera);
  camera.x = player.x, camera.y = player.y;

	canvas.addEventListener("click", function (e) {
		e.preventDefault();
		player.equipment.weapon.attacks[0](player);
	});
	/*
	canvas.addEventListener("dblclick", function (e) {
		//fullscreen?
		if (canvas.requestFullscreen) {
		  canvas.requestFullscreen();
		} else if (canvas.msRequestFullscreen) {
		  canvas.msRequestFullscreen();
		} else if (canvas.mozRequestFullScreen) {
		  canvas.mozRequestFullScreen();
		} else if (canvas.webkitRequestFullscreen) {
		  canvas.webkitRequestFullscreen();
		}
	});*/
	
	canvas.addEventListener("contextmenu", function (e) {
		e.preventDefault();
		player.equipment.weapon.attacks[1](player);
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

	window.addEventListener("focus", function () { startTime = new Date(); });
	
  for (var i = 0; i < 3; i++ ) {
      var b = Object.create(Enemy).init(shipImage, Math.random() * GAME.width, 100, player);
      b.health = 15;
      b.angle = Math.PI / 2;
      entities.push(b);
    //console.log(i, entities.length, "HI");
  }

	function step () {

		var newTime = new Date();
		var dt = (newTime - startTime) / 1000;
		startTime = newTime;

		ctx.clearRect(0,0,canvas.width,canvas.height);
		
		doGamePads(player);
		
		if (gamestate == "menu") {
			ctx.textAlign = "center";
			ctx.font = "45px Stardos Stencil";
			ctx.fillText("Press START", canvas.width / 2, canvas.height / 2);
		}
		
		if (gamestate == "play") {
			ctx.save();

			camera.update(dt);
			camera.draw(ctx);

			ctx.fillStyle = "rgba(100,100,100,0.4)";
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

			var px = player.x - canvas.width/2 + Math.cos(player.angle) * canvas.width/3;
			var py = player.y - canvas.height/2 + Math.sin(player.angle) * canvas.height/3;
			var dp = distance(camera.x,camera.y,px,py);
			camera.speed = Math.min(300,6 * Math.floor(dp));
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
			ctx.fillRect(14,14,Math.min(player.temperature, 100), 20);
			ctx.fillRect(canvas.width - 114, 14,Math.max(0, player.health),20);
			
			if (menu) {
								
				ctx.fillStyle = "rgba(255,255,255,0.6)";
				ctx.fillRect(20,20,canvas.width - 40, canvas.height - 40);
				
				ctx.fillStyle = "black";
				ctx.fillText("Inventory", canvas.width / 2, 60);
				
				for (var i = 0; i < player.inventory.length; i++) {
					ctx.fillStyle = player.inventory[i].color;
					ctx.fillRect(100, 100 + i * 50, 40, 40);
					ctx.fillStyle = "black";
					ctx.fillText(player.inventory[i].name, canvas.width/2, 130 + i * 50)
					ctx.fillRect(canvas.width/2 - canvas.width/4, 134 + i * 50, canvas.width/2, 3);
				}
				
			}
		}
		
		window.requestAnimationFrame(step);

	}

  window.requestAnimationFrame(step);

}, false);
