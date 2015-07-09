var buttonCooldown = 0;

function doGamePads (player) {

	var gamepads = navigator.getGamepads();

    for (var i = 0; i < gamepads.length; ++i)
    {
        var pad = gamepads[i];
        if (pad)
        {		
			if (gamestate == undefined) return;
			
			if (gamestate == "menu") {
				if (pad.buttons[9].pressed) gamestate = "play";				
			}
		
			if (gamestate == "play") {

				//if (pad.buttons[1].pressed) { 
					//player.acel = ACEL;
				//}
			
				// RB
				if (pad.buttons[5].pressed) {
					player.equipment.weapon.attacks[0](player);
				}
				else if (pad.buttons[7].pressed) {
					player.equipment.weapon.attacks[1](player);
				}
				
				
				//Start
				if (pad.buttons[9].pressed && buttonCooldown <= 0) {
					menu = !menu;
					buttonCooldown = 1;
				}
				
				//Back
				if (pad.buttons[8].pressed) {
					gamestate = "menu";
				}
				
				// Shield controls
				if (pad.buttons[4].pressed) {
					if (player.equipment.shield.active == false) player.equipment.shield.angle = player.angle;
					player.equipment.shield.active = true;
				}
				else player.equipment.shield.active = false;
				
				if (player.equipment.shield.active == true) {
					player.equipment.shield.angle = player.angle + (Math.abs(pad.axes[2]) > 0.5 ? pad.axes[2] / 2 : 0) * Math.PI / 2;
				}
				
				//player.acel = - ACEL * (Math.abs(pad.axes[1]) > 0.5 ? 2 * (pad.axes[1] - 0.5) : 0);
				player.d_angle = ((1.2 * MAX_SPEED - player.speed) / MAX_SPEED) * Math.PI * (Math.abs(pad.axes[0]) > 0.5 ? (pad.axes[0] / 2) : 0);
				if (player.equipment.engine.timer <= 0 && pad.buttons[6].pressed)
						player.equipment.engine.timer = player.equipment.engine.boost;
			}
			

        }
    }
	buttonCooldown -= 0.1;
}