{
	"scenes": [
		{
			"name": "mainmenu",
			"type": "menu",
			"map": {},
			"entities": [
				{
					"gridX": 240,
					"gridY": 64,
					"text": "the floor is the\nSURFACE of the SUN",
					"type": "textblock",
					"speed": 25,
					"pause": 100,
					"format": {
						"size": 32,
						"align": "center"
					}
				}
			]
		},
		{
			"name": "credits",
			"type": "menu",
			"map": {},
			"entities": [
				{
					"gridX": 240,
					"gridY": 60,
					"text": "Credits",
					"type": "text",
					"speed": 100,
					"format": {
						"size": 44
					}
				},
				{
					"gridX": 240,
					"gridY": 110,
					"text": "developed by Benny Heller",
					"type": "text",
					"format": {}
				}
			]
		},
		{
			"name": "stagemenu",
			"type": "menu",
			"map": {},
			"entities": [
				{
					"gridX": 8,
					"gridY": 32,
					"text": "Stages",
					"type": "text",
					"speed": 100,
					"format": {
						"size": 32,
						"align": "left"
					}
				}
			]
		},
		{
			"name": "habitation cutscene",
			"type": "cutscene",
			"stage": "habitation",
			"map": [],
			"entities": [
				{
					"gridX": 24,
					"gridY": 24,
					"text": ">>     .  .  .  I've dropped some things  .  .  .\n>>     .  .  .  on the surface on the sun.\n\n>>     .  .  .  just bear with me  .  .  .\n\n>>     I have a plan.",
					"type": "textblock",
					"speed": 40,
					"pause": 1000,
					"format": {
						"size": 16,
						"align": "left"
					}
				}
			]
		},
		{
			"name": "simple enough",
			"type": "level",
			"stage": "habitation",
			"max": 2,
			"map": [
				{
					"gridX": 4,
					"gridY": 5,
					"type": "platform",
					"direction": "east"
				},
				{
					"gridX": 6,
					"gridY": 5,
					"type": "platform",
					"direction": "west"
				}								
			],
			"entities": [
				{
					"gridX": 4,
					"gridY": 5,
					"type": "character"
				},
				{
					"gridX": 6,
					"gridY": 5,
					"type": "collectable"
				},
				{
					"gridX": 24,
					"gridY": 216,
					"text": ">>     I've put down platforms to land on.\n>>     And there's a path to the object, and back.\n>>     Just press 'run' to send me down.",
					"type": "textblock",
					"speed": 40,
					"pause": 1000,
					"format": {
						"size": 16,
						"align": "left"
					}
				}

			]
		},
		{
			"name": "an inconvenience",
			"type": "level",
			"stage": "habitation",
			"max": 4,
			"map": [
				{
					"gridX": 4,
					"gridY": 4,
					"type": "obstacle"
				}
			],
			"entities": [
				{
					"gridX": 3,
					"gridY": 4,
					"type": "character"
				},
				{
					"gridX": 5,
					"gridY": 4,
					"type": "collectable"
				},
				{
					"gridX": 24,
					"gridY": 192,
					"text": ">>     Can you place the platforms this time?\n>>     Just CLICK and hold  .  .  .\n\n>>     Move the MOUSE to change direction.\n>>     Make sure the path gets there and back.",
					"type": "textblock",
					"speed": 40,
					"pause": 1000,
					"format": {
						"size": 16,
						"align": "left"
					}
				}
			]
		},
		{
			"name": "remove what's in the way",
			"type": "level",
			"stage": "habitation",
			"max": 2,
			"map": [
				{
					"gridX": 2,
					"gridY": 5,
					"type": "platform",
					"direction": "east"
				},
				{
					"gridX": 4,
					"gridY": 5,
					"type": "platform",
					"direction": "southwest"
				}								
			],
			"entities": [
				{
					"gridX": 2,
					"gridY": 5,
					"type": "character"
				},
				{
					"gridX": 4,
					"gridY": 3,
					"type": "collectable"
				},
				{
					"gridX": 24,
					"gridY": 216,
					"text": ">>     I already placed a couple platforms  .  .  .\n>>     But they're in the wrong place.\n>>     RIGHT-CLICK to remove any platform",
					"type": "textblock",
					"speed": 40,
					"pause": 1000,
					"format": {
						"size": 16,
						"align": "left"
					}
				}
			]
		},		
		{
			"name": "all lined up",
			"type": "level",
			"stage": "habitation",
			"max": 6,
			"map": [
				{
					"gridX":0,
					"gridY":4,
					"type": "obstacle"
				},
				{
					"gridX":7,
					"gridY":4,
					"type": "obstacle"
				}
			],
			"entities": [
				{
					"gridX":2,
					"gridY":4,
					"type": "character"
				},
				{
					"gridX":5,
					"gridY":4,
					"type": "collectable"
				},
				{
					"gridX": 24,
					"gridY": 192,
					"text": ">>     The platform will move me two spaces.\n>>     But if there is an obstacle in the way -\n>>     - it will only move me one space.\n\n>>     You can use this to adjust my movement.",
					"type": "textblock",
					"speed": 40,
					"pause": 1000,
					"format": {
						"size": 16,
						"align": "left"
					}
				}			
			]
		},
		{
			"name": "direction is important",
			"type": "level",
			"stage": "habitation",
			"max": 7,
			"map": [
				{
					"gridX":5,
					"gridY":3,
					"type": "obstacle"
				},
				{
					"gridX":4,
					"gridY":7,
					"type": "obstacle"
				}
			],
			"entities": [
				{
					"gridX":1,
					"gridY":5,
					"type": "character"
				},
				{
					"gridX":4,
					"gridY":5,
					"type": "collectable"
				}
			]
		},
		{
			"name": "don't waste time",
			"type": "level",
			"stage": "habitation",
			"max": 7,
			"map": [
				{
					"gridX":4,
					"gridY":3,
					"type": "obstacle"
				},
				{
					"gridX":1,
					"gridY":4,
					"type": "obstacle"
				},
				{
					"gridX":4,
					"gridY":4,
					"type": "obstacle"
				},
				{
					"gridX":7,
					"gridY":4,
					"type": "obstacle"
				},
				{
					"gridX":0,
					"gridY":5,
					"type": "obstacle"
				},
				{
					"gridX":7,
					"gridY":5,
					"type": "obstacle"
				},
				{
					"gridX":2,
					"gridY":6,
					"type": "obstacle"
				},
				{
					"gridX":6,
					"gridY":6,
					"type": "obstacle"
				},
				{
					"gridX":1,
					"gridY":7,
					"type": "obstacle"
				},
				{
					"gridX":3,
					"gridY":7,
					"type": "obstacle"
				},
				{
					"gridX":4,
					"gridY":7,
					"type": "obstacle"
				}
			],
			"entities": [
				{
					"gridX":2,
					"gridY":4,
					"type": "character"
				},
				{
					"gridX":5,
					"gridY":4,
					"type": "collectable"
				}
			]
		},
		{
			"name": "reverse to go forward",
			"type": "level",
			"stage": "habitation",
			"max": 8,
			"map": [
				{
					"gridX":2,
					"gridY":3,
					"type": "obstacle"
				},
				{
					"gridX":3,
					"gridY":3,
					"type": "obstacle"
				},
				{
					"gridX":5,
					"gridY":3,
					"type": "obstacle"
				},
				{
					"gridX":6,
					"gridY":3,
					"type": "obstacle"
				},
				{
					"gridX":3,
					"gridY":4,
					"type": "obstacle"
				},
				{
					"gridX":2,
					"gridY":6,
					"type": "obstacle"
				},
				{
					"gridX":2,
					"gridY":7,
					"type": "obstacle"
				}
			],
			"entities": [
				{
					"gridX":3,
					"gridY":5,
					"type": "character"
				},
				{
					"gridX":6,
					"gridY":5,
					"type": "collectable"
				}
			]
		},
		{
			"name": "you need space",
			"type": "level",
			"stage": "habitation",
			"max": 8,
			"map": [
				{
					"gridX":0,
					"gridY":4,
					"type": "obstacle"
				},
				{
					"gridX":-1,
					"gridY":5,
					"type": "obstacle"
				},
				{
					"gridX":1,
					"gridY":5,
					"type": "obstacle"
				},
				{
					"gridX":3,
					"gridY":5,
					"type": "obstacle"
				},
				{
					"gridX":5,
					"gridY":6,
					"type": "obstacle"
				},
				{
					"gridX":-1,
					"gridY":7,
					"type": "obstacle"
				},
				{
					"gridX":0,
					"gridY":7,
					"type": "obstacle"
				},
				{
					"gridX":1,
					"gridY":7,
					"type": "obstacle"
				},
				{
					"gridX":2,
					"gridY":7,
					"type": "obstacle"
				},
				{
					"gridX":3,
					"gridY":7,
					"type": "obstacle"
				},
				{
					"gridX":4,
					"gridY":7,
					"type": "obstacle"
				}
			],
			"entities": [
				{
					"gridX":0,
					"gridY":6,
					"type": "character"
				},
				{
					"gridX":3,
					"gridY":6,
					"type": "collectable"
				}
			]
		},
		{
			"name": "avoid the obvious",
			"type": "level",
			"stage": "habitation",
			"max": 8,
			"map": [
				{
					"gridX":2,
					"gridY":2,
					"type": "obstacle"
				},
				{
					"gridX":6,
					"gridY":2,
					"type": "obstacle"
				},
				{
					"gridX":2,
					"gridY":3,
					"type": "obstacle"
				},
				{
					"gridX":5,
					"gridY":3,
					"type": "obstacle"
				},
				{
					"gridX":0,
					"gridY":5,
					"type": "obstacle"
				},
				{
					"gridX":1,
					"gridY":5,
					"type": "obstacle"
				},
				{
					"gridX":0,
					"gridY":7,
					"type": "obstacle"
				},
				{
					"gridX":3,
					"gridY":7,
					"type": "obstacle"
				},
				{
					"gridX":-1,
					"gridY":8,
					"type": "obstacle"
				},
				{
					"gridX":3,
					"gridY":8,
					"type": "obstacle"
				}
			],
			"entities": [
				{
					"gridX":3,
					"gridY":5,
					"type": "character"
				},
				{
					"gridX":6,
					"gridY":5,
					"type": "collectable"
				}
			]
		},
		{
			"name": "establish order",
			"type": "level",
			"stage": "habitation",
			"max": 9,
			"map": [
				{
					"gridX":5,
					"gridY":1,
					"type": "obstacle"
				},
				{
					"gridX":2,
					"gridY":2,
					"type": "obstacle"
				},
				{
					"gridX":5,
					"gridY":2,
					"type": "obstacle"
				},
				{
					"gridX":1,
					"gridY":3,
					"type": "obstacle"
				},
				{
					"gridX":5,
					"gridY":3,
					"type": "obstacle"
				},
				{
					"gridX":0,
					"gridY":4,
					"type": "obstacle"
				},
				{
					"gridX":5,
					"gridY":4,
					"type": "obstacle"
				},
				{
					"gridX":-1,
					"gridY":5,
					"type": "obstacle"
				},
				{
					"gridX":7,
					"gridY":6,
					"type": "obstacle"
				},
				{
					"gridX":0,
					"gridY":7,
					"type": "obstacle"
				},
				{
					"gridX":6,
					"gridY":7,
					"type": "obstacle"
				},
				{
					"gridX":0,
					"gridY":8,
					"type": "obstacle"
				},
				{
					"gridX":5,
					"gridY":8,
					"type": "obstacle"
				},
				{
					"gridX":0,
					"gridY":9,
					"type": "obstacle"
				},
				{
					"gridX":4,
					"gridY":9,
					"type": "obstacle"
				}
			],
			"entities": [
				{
					"gridX":3,
					"gridY":5,
					"type": "character"
				},
				{
					"gridX":6,
					"gridY":5,
					"type": "collectable"
				},
				{
					"gridX":4,
					"gridY":6,
					"type": "collectable"
				}
			]
		},
		{
			"name": "make a good entrance",
			"type": "level",
			"stage": "habitation",
			"max": 15,
			"map": [
				{
					"gridX": 7,
					"gridY": 2,
					"type": "obstacle"
				},
				{
					"gridX": 8,
					"gridY": 2,
					"type": "obstacle"
				},
				{
					"gridX": 9,
					"gridY": 2,
					"type": "obstacle"
				},
				{
					"gridX": 6,
					"gridY": 3,
					"type": "obstacle"
				},
				{
					"gridX": 9,
					"gridY": 3,
					"type": "obstacle"
				},
				{
					"gridX": 1,
					"gridY": 4,
					"type": "obstacle"
				},
				{
					"gridX": 5,
					"gridY": 4,
					"type": "obstacle"
				},
				{
					"gridX": 9,
					"gridY": 4,
					"type": "obstacle"
				},
				{
					"gridX": 0,
					"gridY": 5,
					"type": "obstacle"
				},
				{
					"gridX": 5,
					"gridY": 5,
					"type": "obstacle"
				},
				{
					"gridX": 8,
					"gridY": 5,
					"type": "obstacle"
				},
				{
					"gridX": 0,
					"gridY": 6,
					"type": "obstacle"
				},
				{
					"gridX": 4,
					"gridY": 6,
					"type": "obstacle"
				},
				{
					"gridX": 6,
					"gridY": 6,
					"type": "obstacle"
				},
				{
					"gridX": 7,
					"gridY": 6,
					"type": "obstacle"
				},
				{
					"gridX": 5,
					"gridY": 7,
					"type": "obstacle"
				},
				{
					"gridX": "-1",
					"gridY": 7,
					"type": "obstacle"
				}
			],
			"entities": [
				{
					"gridX": 4,
					"gridY": 4,
					"type": "character"
				},
				{
					"gridX": 0,
					"gridY": 7,
					"type": "collectable"
				},
				{
					"gridX": 7,
					"gridY": 4,
					"type": "collectable"
				}
			]
		},
		{
			"name": "when repetition is unavoidable",
			"type": "level",
			"stage": "hydroponics",
			"max": 6,
			"map": [
				{
					"gridX":5,
					"gridY":2,
					"type": "obstacle"
				},
				{
					"gridX":6,
					"gridY":3,
					"type": "obstacle"
				},
				{
					"gridX":4,
					"gridY":4,
					"type": "undertow"
				},
				{
					"gridX":2,
					"gridY":5,
					"type": "obstacle"
				},
				{
					"gridX":5,
					"gridY":5,
					"type": "obstacle"
				},
				{
					"gridX":3,
					"gridY":6,
					"type": "obstacle"
				}
			],
			"entities": [
				{
					"gridX":2,
					"gridY":4,
					"type": "character"
				},
				{
					"gridX":6,
					"gridY":4,
					"type": "collectable"
				},
				{
					"gridX":4,
					"gridY":6,
					"type": "collectable"
				},
				{
					"gridX":242,
					"gridY":244,
					"text": "An undertow will turn a platform\neach time I jump.",
					"type": "textblock",
					"pause": 1000,
					"format": {
						"size": 16,
						"align": "center",
						"color": "#0000DD"
					}
				}
			]
		},
		{
			"name": "when space is tight",
			"type": "level",
			"stage": "hydroponics",
			"max": 8,
			"map": [
				{
					"gridX":4,
					"gridY":1,
					"type": "obstacle"
				},
				{
					"gridX":4,
					"gridY":2,
					"type": "obstacle"
				},
				{
					"gridX":3,
					"gridY":3,
					"type": "obstacle"
				},
				{
					"gridX":2,
					"gridY":4,
					"type": "obstacle"
				},
				{
					"gridX":3,
					"gridY":4,
					"type": "obstacle"
				},
				{
					"gridX":3,
					"gridY":5,
					"type": "undertow"
				},
				{
					"gridX":1,
					"gridY":6,
					"type": "obstacle"
				},
				{
					"gridX":1,
					"gridY":7,
					"type": "obstacle"
				},
				{
					"gridX":1,
					"gridY":8,
					"type": "obstacle"
				},
				{
					"gridX":2,
					"gridY":8,
					"type": "obstacle"
				},
				{
					"gridX":2,
					"gridY":9,
					"type": "obstacle"
				}
			],
			"entities": [
				{
					"gridX":1,
					"gridY":5,
					"type": "character"
				},
				{
					"gridX":4,
					"gridY":5,
					"type": "collectable"
				}
			]
		},
		{
			"name": "when you keep track",
			"type": "level",
			"stage": "hydroponics",
			"max": 8,
			"map": [
				{
					"gridX":5,
					"gridY":1,
					"type": "obstacle"
				},
				{
					"gridX":5,
					"gridY":2,
					"type": "obstacle"
				},
				{
					"gridX":5,
					"gridY":3,
					"type": "obstacle"
				},
				{
					"gridX":6,
					"gridY":3,
					"type": "obstacle"
				},
				{
					"gridX":4,
					"gridY":4,
					"type": "obstacle"
				},
				{
					"gridX":5,
					"gridY":5,
					"type": "undertow"
				},
				{
					"gridX": "10",
					"gridY":5,
					"type": "obstacle"
				},
				{
					"gridX":3,
					"gridY":6,
					"type": "obstacle"
				},
				{
					"gridX":3,
					"gridY":7,
					"type": "obstacle"
				},
				{
					"gridX":2,
					"gridY":8,
					"type": "obstacle"
				},
				{
					"gridX":3,
					"gridY":8,
					"type": "obstacle"
				},
				{
					"gridX":2,
					"gridY":9,
					"type": "obstacle"
				}
			],
			"entities": [
				{
					"gridX":3,
					"gridY":5,
					"type": "character"
				},
				{
					"gridX":6,
					"gridY":5,
					"type": "collectable"
				}
			]
		},
		{
			"name": "when you have to choose",
			"type": "level",
			"stage": "hydroponics",
			"max": 16,
			"map": [
				{
					"gridX":6,
					"gridY":3,
					"type": "undertow"
				},
				{
					"gridX":4,
					"gridY":5,
					"type": "obstacle"
				},
				{
					"gridX":3,
					"gridY":6,
					"type": "obstacle"
				},
				{
					"gridX":4,
					"gridY":6,
					"type": "obstacle"
				},
				{
					"gridX":3,
					"gridY":7,
					"type": "obstacle"
				},
				{
					"gridX":3,
					"gridY":8,
					"type": "obstacle"
				},
				{
					"gridX":3,
					"gridY":9,
					"type": "obstacle"
				}
			],
			"entities": [
				{
					"gridX":6,
					"gridY":1,
					"type": "character"
				},
				{
					"gridX":4,
					"gridY":7,
					"type": "collectable"
				},
				{
					"gridX": -1,
					"gridY":8,
					"type": "collectable"
				}
			]
		},
		{
			"name": "there and back again",
			"type": "level",
			"stage": "hydroponics",
			"max": 9,
			"map": [
				{
					"gridX": 2,
					"gridY": 3,
					"type": "obstacle"
				},
				{
					"gridX": 5,
					"gridY": 4,
					"type": "undertow"
				},
				{
					"gridX": 2,
					"gridY": 6,
					"type": "undertow"
				},
				{
					"gridX": 4,
					"gridY": 6,
					"type": "obstacle"
				},
				{
					"gridX": "-1",
					"gridY": 6,
					"type": "obstacle"
				},
				{
					"gridX": 0,
					"gridY": 8,
					"type": "obstacle"
				},
				{
					"gridX": 2,
					"gridY": 8,
					"type": "obstacle"
				}
			],
			"entities": [
				{
					"gridX": 4,
					"gridY": 4,
					"type": "character"
				},
				{
					"gridX": 7,
					"gridY": 4,
					"type": "collectable"
				}
			]
		},
		{
			"name": "early days",
			"type": "level",
			"stage": "hydroponics",
			"max": 8,
			"map": [
				{
					"gridX": 4,
					"gridY": 0,
					"type": "obstacle"
				},
				{
					"gridX": 4,
					"gridY": 2,
					"type": "obstacle"
				},
				{
					"gridX": 4,
					"gridY": 3,
					"type": "obstacle"
				},
				{
					"gridX": 4,
					"gridY": 4,
					"type": "obstacle"
				},
				{
					"gridX": 6,
					"gridY": 4,
					"type": "undertow"
				},
				{
					"gridX": 7,
					"gridY": 4,
					"type": "obstacle"
				},
				{
					"gridX": 4,
					"gridY": 5,
					"type": "obstacle"
				},
				{
					"gridX": 0,
					"gridY": 6,
					"type": "obstacle"
				},
				{
					"gridX": 2,
					"gridY": 6,
					"type": "undertow"
				},
				{
					"gridX": 4,
					"gridY": 7,
					"type": "obstacle"
				}
			],
			"entities": [
				{
					"gridX": 2,
					"gridY": 4,
					"type": "character"
				},
				{
					"gridX": 5,
					"gridY": 4,
					"type": "collectable"
				}
			]
		},
		{
			"name": "the go-around",
			"type": "level",
			"stage": "hydroponics",
			"max": 15,
			"map": [
				{
					"gridX": 3,
					"gridY": 5,
					"type": "undertow"
				},
				{
					"gridX": 4,
					"gridY": 2,
					"type": "obstacle"
				},
				{
					"gridX": 7,
					"gridY": 2,
					"type": "obstacle"
				},
				{
					"gridX": 3,
					"gridY": 3,
					"type": "obstacle"
				},
				{
					"gridX": 6,
					"gridY": 3,
					"type": "obstacle"
				},
				{
					"gridX": 2,
					"gridY": 4,
					"type": "obstacle"
				},
				{
					"gridX": 5,
					"gridY": 4,
					"type": "obstacle"
				},
				{
					"gridX": 3,
					"gridY": 6,
					"type": "obstacle"
				},
				{
					"gridX": 1,
					"gridY": 7,
					"type": "obstacle"
				},
				{
					"gridX": 3,
					"gridY": 7,
					"type": "obstacle"
				},
				{
					"gridX": 3,
					"gridY": 8,
					"type": "obstacle"
				}
			],
			"entities": [
				{
					"gridX": 5,
					"gridY": 5,
					"type": "character"
				},
				{
					"gridX": 8,
					"gridY": 5,
					"type": "collectable"
				},
				{
					"gridX": 0,
					"gridY": 8,
					"type": "collectable"
				}
			]
		},
		{
			"name": "doubled",
			"type": "level",
			"stage": "hydroponics",
			"max": 8,
			"map": [
				{
					"gridX": 6,
					"gridY": 2,
					"type": "obstacle"
				},
				{
					"gridX": 4,
					"gridY": 3,
					"type": "obstacle"
				},
				{
					"gridX": 2,
					"gridY": 4,
					"type": "obstacle"
				},
				{
					"gridX": 2,
					"gridY": 5,
					"type": "undertow"
				},
				{
					"gridX": 3,
					"gridY": 5,
					"type": "undertow"
				},
				{
					"gridX": 1,
					"gridY": 6,
					"type": "obstacle"
				},
				{
					"gridX": 3,
					"gridY": 6,
					"type": "obstacle"
				},
				{
					"gridX": 3,
					"gridY": 7,
					"type": "obstacle"
				},
				{
					"gridX": 3,
					"gridY": 8,
					"type": "obstacle"
				}
			],
			"entities": [
				{
					"gridX": 4,
					"gridY": 5,
					"type": "character"
				},
				{
					"gridX": 1,
					"gridY": 5,
					"type": "collectable"
				}
			]
		},
		{
			"name": "clue inplant",
			"type": "level",
			"stage": "hydroponics",
			"max": 17,
			"map": [
				{
					"gridX": 8,
					"gridY": 1,
					"type": "obstacle"
				},
				{
					"gridX": 7,
					"gridY": 2,
					"type": "obstacle"
				},
				{
					"gridX": 6,
					"gridY": 3,
					"type": "obstacle"
				},
				{
					"gridX": 8,
					"gridY": 3,
					"type": "obstacle"
				},
				{
					"gridX": 5,
					"gridY": 4,
					"type": "obstacle"
				},
				{
					"gridX": 6,
					"gridY": 4,
					"type": "obstacle"
				},
				{
					"gridX": 0,
					"gridY": 5,
					"type": "obstacle"
				},
				{
					"gridX": 1,
					"gridY": 5,
					"type": "obstacle"
				},
				{
					"gridX": 2,
					"gridY": 5,
					"type": "obstacle"
				},
				{
					"gridX": 3,
					"gridY": 5,
					"type": "obstacle"
				},
				{
					"gridX": 4,
					"gridY": 5,
					"type": "undertow"
				},
				{
					"gridX": 2,
					"gridY": 6,
					"type": "obstacle"
				},
				{
					"gridX": 4,
					"gridY": 6,
					"type": "undertow"
				},
				{
					"gridX": 0,
					"gridY": 7,
					"type": "obstacle"
				},
				{
					"gridX": 4,
					"gridY": 7,
					"type": "undertow"
				}
			],
			"entities": [
				{
					"gridX": 4,
					"gridY": 4,
					"type": "character"
				},
				{
					"gridX": 7,
					"gridY": 4,
					"type": "collectable"
				},
				{
					"gridX": 0,
					"gridY": 8,
					"type": "collectable"
				}
			]
		},
		{
			"name": "coordination",
			"type": "level",
			"stage": "hydroponics",
			"max": 11,
			"map": [
				{
					"gridX": 7,
					"gridY": 2,
					"type": "obstacle"
				},
				{
					"gridX": 6,
					"gridY": 3,
					"type": "obstacle"
				},
				{
					"gridX": 5,
					"gridY": 4,
					"type": "obstacle"
				},
				{
					"gridX": 6,
					"gridY": 4,
					"type": "undertow"
				},
				{
					"gridX": 6,
					"gridY": 5,
					"type": "obstacle"
				},
				{
					"gridX": 8,
					"gridY": 5,
					"type": "obstacle"
				},
				{
					"gridX": 4,
					"gridY": 6,
					"type": "undertow"
				},
				{
					"gridX": 5,
					"gridY": 6,
					"type": "obstacle"
				},
				{
					"gridX": 8,
					"gridY": 6,
					"type": "obstacle"
				},
				{
					"gridX": 4,
					"gridY": 7,
					"type": "obstacle"
				},
				{
					"gridX": 8,
					"gridY": 7,
					"type": "obstacle"
				}
			],
			"entities": [
				{
					"gridX": 4,
					"gridY": 4,
					"type": "character"
				},
				{
					"gridX": 7,
					"gridY": 4,
					"type": "collectable"
				}
			]
		},
		{
			"name": "simpler than it looks",
			"type": "level",
			"stage": "hydroponics",
			"max": 9,
			"map": [
				{
					"gridX": 5,
					"gridY": 1,
					"type": "obstacle"
				},
				{
					"gridX": 6,
					"gridY": 1,
					"type": "obstacle"
				},
				{
					"gridX": 4,
					"gridY": 2,
					"type": "obstacle"
				},
				{
					"gridX": 5,
					"gridY": 2,
					"type": "undertow"
				},
				{
					"gridX": 6,
					"gridY": 2,
					"type": "obstacle"
				},
				{
					"gridX": 3,
					"gridY": 4,
					"type": "undertow"
				},
				{
					"gridX": 5,
					"gridY": 4,
					"type": "undertow"
				},
				{
					"gridX": 2,
					"gridY": 5,
					"type": "obstacle"
				},
				{
					"gridX": 5,
					"gridY": 5,
					"type": "obstacle"
				},
				{
					"gridX": 1,
					"gridY": 6,
					"type": "obstacle"
				},
				{
					"gridX": 5,
					"gridY": 6,
					"type": "obstacle"
				}
			],
			"entities": [
				{
					"gridX": 4,
					"gridY": 4,
					"type": "character"
				},
				{
					"gridX": 7,
					"gridY": 4,
					"type": "collectable"
				},
				{
					"gridX": 1,
					"gridY": 4,
					"type": "collectable"
				}
			]
		},
		{
			"name": "can you learn?",
			"type": "level",
			"stage": "operations",
			"max": 7,
			"map": [
				{
					"gridX": 6,
					"gridY": 4,
					"type": "hotspot"
				},
				{
					"gridX": 3,
					"gridY": 6,
					"type": "hotspot"
				}
			],
			"entities": [
				{
					"gridX": 4,
					"gridY": 4,
					"type": "character"
				},
				{
					"gridX": 7,
					"gridY": 4,
					"type": "collectable"
				},
				{
					"gridX": 244,
					"gridY": 224,
					"text": "If a platform is on a 'hotspot'\nit can only be jumped on once.\nAfter that it becomes an Obstacle.",
					"type": "textblock",
					"pause": 1000,
					"format": {
						"size": 16,
						"align": "center",
						"color": "#0000DD"
					}
				}
			]
		},
		{
			"name": "can you get in the way?",
			"type": "level",
			"stage": "operations",
			"max": 6,
			"map": [
				{
					"gridX": 7,
					"gridY": 3,
					"type": "obstacle"
				},
				{
					"gridX": 2,
					"gridY": 4,
					"type": "obstacle"
				},
				{
					"gridX": 6,
					"gridY": 4,
					"type": "hotspot"
				},
				{
					"gridX": 9,
					"gridY": 4,
					"type": "obstacle"
				},
				{
					"gridX": 6,
					"gridY": 5,
					"type": "obstacle"
				}
			],
			"entities": [
				{
					"gridX": 4,
					"gridY": 4,
					"type": "character"
				},
				{
					"gridX": 7,
					"gridY": 4,
					"type": "collectable"
				}
			]
		},
		{
			"name": "can you make your own?",
			"type": "level",
			"stage": "operations",
			"max": 10,
			"map": [
				{
					"gridX": 3,
					"gridY": 2,
					"type": "obstacle"
				},
				{
					"gridX": 4,
					"gridY": 2,
					"type": "hotspot"
				},
				{
					"gridX": 5,
					"gridY": 2,
					"type": "hotspot"
				},
				{
					"gridX": 2,
					"gridY": 3,
					"type": "obstacle"
				},
				{
					"gridX": 4,
					"gridY": 3,
					"type": "hotspot"
				},
				{
					"gridX": 9,
					"gridY": 3,
					"type": "obstacle"
				},
				{
					"gridX": 10,
					"gridY": 3,
					"type": "obstacle"
				},
				{
					"gridX": 2,
					"gridY": 7,
					"type": "obstacle"
				},
				{
					"gridX": 3,
					"gridY": 7,
					"type": "obstacle"
				}
			],
			"entities": [
				{
					"gridX": 4,
					"gridY": 4,
					"type": "character"
				},
				{
					"gridX": 7,
					"gridY": 4,
					"type": "collectable"
				}
			]
		},
		{
			"name": "can you reduce?",
			"type": "level",
			"stage": "operations",
			"max": 10,
			"map": [
				{
					"gridX": 4,
					"gridY": 2,
					"type": "hotspot"
				},
				{
					"gridX": 7,
					"gridY": 2,
					"type": "obstacle"
				},
				{
					"gridX": 7,
					"gridY": 3,
					"type": "hotspot"
				},
				{
					"gridX": 5,
					"gridY": 4,
					"type": "obstacle"
				},
				{
					"gridX": 4,
					"gridY": 5,
					"type": "hotspot"
				},
				{
					"gridX": 3,
					"gridY": 6,
					"type": "obstacle"
				},
				{
					"gridX": 1,
					"gridY": 8,
					"type": "obstacle"
				}
			],
			"entities": [
				{
					"gridX": 4,
					"gridY": 4,
					"type": "character"
				},
				{
					"gridX": 7,
					"gridY": 4,
					"type": "collectable"
				}
			]
		},
		{
			"name": "can you plan to start and stop?",
			"type": "level",
			"stage": "operations",
			"max": 9,
			"map": [
				{
					"gridX": 4,
					"gridY": 1,
					"type": "obstacle"
				},
				{
					"gridX": 4,
					"gridY": 2,
					"type": "obstacle"
				},
				{
					"gridX": 5,
					"gridY": 2,
					"type": "hotspot"
				},
				{
					"gridX": 6,
					"gridY": 2,
					"type": "obstacle"
				},
				{
					"gridX": 3,
					"gridY": 3,
					"type": "hotspot"
				},
				{
					"gridX": 6,
					"gridY": 3,
					"type": "hotspot"
				},
				{
					"gridX": 1,
					"gridY": 4,
					"type": "obstacle"
				},
				{
					"gridX": 2,
					"gridY": 4,
					"type": "obstacle"
				},
				{
					"gridX": 3,
					"gridY": 4,
					"type": "hotspot"
				},
				{
					"gridX": 6,
					"gridY": 4,
					"type": "obstacle"
				},
				{
					"gridX": 2,
					"gridY": 5,
					"type": "hotspot"
				},
				{
					"gridX": 5,
					"gridY": 5,
					"type": "hotspot"
				},
				{
					"gridX": 2,
					"gridY": 6,
					"type": "obstacle"
				},
				{
					"gridX": 3,
					"gridY": 6,
					"type": "hotspot"
				},
				{
					"gridX": 4,
					"gridY": 6,
					"type": "obstacle"
				},
				{
					"gridX": 1,
					"gridY": 7,
					"type": "obstacle"
				}
			],
			"entities": [
				{
					"gridX": 4,
					"gridY": 4,
					"type": "character"
				},
				{
					"gridX": 7,
					"gridY": 4,
					"type": "collectable"
				}
			]
		},
		{
			"name": "trapdoor",
			"type": "level",
			"stage": "operations",
			"max": 14,
			"map": [
				{
					"gridX": "10",
					"gridY": 0,
					"type": "obstacle"
				},
				{
					"gridX": 9,
					"gridY": 1,
					"type": "obstacle"
				},
				{
					"gridX": 8,
					"gridY": 2,
					"type": "obstacle"
				},
				{
					"gridX": 7,
					"gridY": 3,
					"type": "obstacle"
				},
				{
					"gridX": 6,
					"gridY": 4,
					"type": "obstacle"
				},
				{
					"gridX": 5,
					"gridY": 5,
					"type": "hotspot"
				},
				{
					"gridX": 8,
					"gridY": 5,
					"type": "hotspot"
				},
				{
					"gridX": 5,
					"gridY": 6,
					"type": "obstacle"
				},
				{
					"gridX": 6,
					"gridY": 6,
					"type": "hotspot"
				},
				{
					"gridX": 7,
					"gridY": 6,
					"type": "hotspot"
				},
				{
					"gridX": 4,
					"gridY": 7,
					"type": "obstacle"
				},
				{
					"gridX": 3,
					"gridY": 8,
					"type": "obstacle"
				},
				{
					"gridX": 2,
					"gridY": 9,
					"type": "obstacle"
				}
			],
			"entities": [
				{
					"gridX": 4,
					"gridY": 4,
					"type": "character"
				},
				{
					"gridX": 7,
					"gridY": 4,
					"type": "collectable"
				}
			]
		},
		{
			"name": "3-point turn",
			"type": "level",
			"stage": "operations",
			"max": 10,
			"map": [
				{
					"gridX": 8,
					"gridY": 0,
					"type": "obstacle"
				},
				{
					"gridX": 7,
					"gridY": 1,
					"type": "obstacle"
				},
				{
					"gridX": 6,
					"gridY": 2,
					"type": "obstacle"
				},
				{
					"gridX": 7,
					"gridY": 2,
					"type": "hotspot"
				},
				{
					"gridX": 5,
					"gridY": 3,
					"type": "obstacle"
				},
				{
					"gridX": 6,
					"gridY": 3,
					"type": "hotspot"
				},
				{
					"gridX": 7,
					"gridY": 3,
					"type": "obstacle"
				},
				{
					"gridX": 8,
					"gridY": 3,
					"type": "obstacle"
				},
				{
					"gridX": 9,
					"gridY": 3,
					"type": "obstacle"
				},
				{
					"gridX": "10",
					"gridY": 3,
					"type": "obstacle"
				},
				{
					"gridX": 2,
					"gridY": 5,
					"type": "obstacle"
				},
				{
					"gridX": 3,
					"gridY": 5,
					"type": "obstacle"
				},
				{
					"gridX": 4,
					"gridY": 5,
					"type": "obstacle"
				},
				{
					"gridX": 5,
					"gridY": 5,
					"type": "obstacle"
				},
				{
					"gridX": 6,
					"gridY": 5,
					"type": "hotspot"
				},
				{
					"gridX": 7,
					"gridY": 5,
					"type": "obstacle"
				},
				{
					"gridX": 5,
					"gridY": 6,
					"type": "hotspot"
				},
				{
					"gridX": 6,
					"gridY": 6,
					"type": "obstacle"
				},
				{
					"gridX": 5,
					"gridY": 7,
					"type": "obstacle"
				},
				{
					"gridX": 4,
					"gridY": 8,
					"type": "obstacle"
				}
			],
			"entities": [
				{
					"gridX": 4,
					"gridY": 4,
					"type": "character"
				},
				{
					"gridX": 7,
					"gridY": 4,
					"type": "collectable"
				}
			]
		},
		{
			"name": "approach with care",
			"type": "level",
			"stage": "operations",
			"max": 15,
			"map": [
				{
					"gridX": 8,
					"gridY": 0,
					"type": "obstacle"
				},
				{
					"gridX": 7,
					"gridY": 1,
					"type": "obstacle"
				},
				{
					"gridX": 8,
					"gridY": 1,
					"type": "obstacle"
				},
				{
					"gridX": 7,
					"gridY": 2,
					"type": "obstacle"
				},
				{
					"gridX": 8,
					"gridY": 2,
					"type": "obstacle"
				},
				{
					"gridX": 6,
					"gridY": 3,
					"type": "hotspot"
				},
				{
					"gridX": 7,
					"gridY": 3,
					"type": "hotspot"
				},
				{
					"gridX": 5,
					"gridY": 4,
					"type": "obstacle"
				},
				{
					"gridX": 6,
					"gridY": 4,
					"type": "obstacle"
				},
				{
					"gridX": "-2",
					"gridY": 4,
					"type": "obstacle"
				},
				{
					"gridX": "-1",
					"gridY": 4,
					"type": "obstacle"
				},
				{
					"gridX": 4,
					"gridY": 5,
					"type": "obstacle"
				},
				{
					"gridX": "-2",
					"gridY": 5,
					"type": "obstacle"
				},
				{
					"gridX": "-1",
					"gridY": 5,
					"type": "obstacle"
				},
				{
					"gridX": 0,
					"gridY": 6,
					"type": "obstacle"
				},
				{
					"gridX": 1,
					"gridY": 6,
					"type": "obstacle"
				},
				{
					"gridX": 2,
					"gridY": 6,
					"type": "obstacle"
				},
				{
					"gridX": 3,
					"gridY": 6,
					"type": "hotspot"
				},
				{
					"gridX": 4,
					"gridY": 6,
					"type": "obstacle"
				},
				{
					"gridX": "-2",
					"gridY": 6,
					"type": "obstacle"
				},
				{
					"gridX": 0,
					"gridY": 7,
					"type": "obstacle"
				},
				{
					"gridX": 2,
					"gridY": 7,
					"type": "obstacle"
				},
				{
					"gridX": 3,
					"gridY": 7,
					"type": "hotspot"
				},
				{
					"gridX": "-1",
					"gridY": 7,
					"type": "obstacle"
				},
				{
					"gridX": 0,
					"gridY": 8,
					"type": "hotspot"
				}
			],
			"entities": [
				{
					"gridX": 4,
					"gridY": 4,
					"type": "character"
				},
				{
					"gridX": 5,
					"gridY": 5,
					"type": "collectable"
				},
				{
					"gridX": 1,
					"gridY": 7,
					"type": "collectable"
				}
			]
		},
		{
			"name": "bow and arrow",
			"type": "level",
			"stage": "operations",
			"max": 8,
			"map": [
				{
					"gridX": 8,
					"gridY": 0,
					"type": "obstacle"
				},
				{
					"gridX": 8,
					"gridY": 1,
					"type": "obstacle"
				},
				{
					"gridX": 5,
					"gridY": 2,
					"type": "obstacle"
				},
				{
					"gridX": 6,
					"gridY": 2,
					"type": "hotspot"
				},
				{
					"gridX": 7,
					"gridY": 2,
					"type": "obstacle"
				},
				{
					"gridX": 6,
					"gridY": 3,
					"type": "hotspot"
				},
				{
					"gridX": 5,
					"gridY": 5,
					"type": "hotspot"
				},
				{
					"gridX": 3,
					"gridY": 6,
					"type": "obstacle"
				},
				{
					"gridX": 4,
					"gridY": 6,
					"type": "hotspot"
				},
				{
					"gridX": 5,
					"gridY": 6,
					"type": "obstacle"
				},
				{
					"gridX": 5,
					"gridY": 7,
					"type": "obstacle"
				},
				{
					"gridX": 4,
					"gridY": 8,
					"type": "obstacle"
				}
			],
			"entities": [
				{
					"gridX": 4,
					"gridY": 4,
					"type": "character"
				},
				{
					"gridX": 7,
					"gridY": 4,
					"type": "collectable"
				}
			]
		},
		{
			"name": "'heist'",
			"type": "level",
			"stage": "operations",
			"max": 14,
			"map": [
				{
					"gridX": 3,
					"gridY": 1,
					"type": "obstacle"
				},
				{
					"gridX": 2,
					"gridY": 2,
					"type": "obstacle"
				},
				{
					"gridX": 1,
					"gridY": 3,
					"type": "obstacle"
				},
				{
					"gridX": 0,
					"gridY": 4,
					"type": "obstacle"
				},
				{
					"gridX": 1,
					"gridY": 4,
					"type": "hotspot"
				},
				{
					"gridX": 0,
					"gridY": 5,
					"type": "hotspot"
				},
				{
					"gridX": 1,
					"gridY": 5,
					"type": "hotspot"
				},
				{
					"gridX": 0,
					"gridY": 6,
					"type": "obstacle"
				},
				{
					"gridX": 0,
					"gridY": 7,
					"type": "obstacle"
				},
				{
					"gridX": 0,
					"gridY": 8,
					"type": "obstacle"
				},
				{
					"gridX": 0,
					"gridY": 9,
					"type": "obstacle"
				}
			],
			"entities": [
				{
					"gridX": 4,
					"gridY": 4,
					"type": "character"
				},
				{
					"gridX": -2,
					"gridY": 7,
					"type": "collectable"
				}
			]
		},
		{
			"name": "propeller",
			"type": "level",
			"stage": "operations",
			"max": 12,
			"map": [
				{
					"gridX": 6,
					"gridY": 1,
					"type": "obstacle"
				},
				{
					"gridX": 6,
					"gridY": 2,
					"type": "obstacle"
				},
				{
					"gridX": 6,
					"gridY": 3,
					"type": "obstacle"
				},
				{
					"gridX": 5,
					"gridY": 4,
					"type": "hotspot"
				},
				{
					"gridX": 6,
					"gridY": 4,
					"type": "hotspot"
				},
				{
					"gridX": 6,
					"gridY": 5,
					"type": "obstacle"
				},
				{
					"gridX": 4,
					"gridY": 6,
					"type": "obstacle"
				},
				{
					"gridX": 5,
					"gridY": 6,
					"type": "obstacle"
				},
				{
					"gridX": 5,
					"gridY": 7,
					"type": "obstacle"
				}
			],
			"entities": [
				{
					"gridX": 4,
					"gridY": 4,
					"type": "character"
				},
				{
					"gridX": 7,
					"gridY": 4,
					"type": "collectable"
				}
			]
		},
		{
			"name": "blank",
			"type": "level",
			"stage": "medical",
			"max": 3,
			"map": [],
			"entities": [
				{
					"gridX": 4,
					"gridY": 4,
					"type": "character"
				}
			]
		},
		{
			"name": "catch me",
			"type": "level",
			"stage": "medical",
			"max": 10,
			"map": [
				{
					"gridX": 6,
					"gridY": 3,
					"type": "obstacle"
				},
				{
					"gridX": 2,
					"gridY": 4,
					"type": "obstacle"
				},
				{
					"gridX": 3,
					"gridY": 5,
					"type": "obstacle"
				},
				{
					"gridX": 4,
					"gridY": 5,
					"type": "obstacle"
				},
				{
					"gridX": 2,
					"gridY": 6,
					"type": "obstacle"
				}
			],
			"entities": [
				{
					"gridX": 4,
					"gridY": 4,
					"type": "character"
				},
				{
					"gridX": 1,
					"gridY": 5,
					"type": "specimen"
				}
			]
		},
		{
			"name": "rendezvous",
			"type": "level",
			"stage": "medical",
			"max": 8,
			"map": [
				{
					"gridX": 1,
					"gridY": 2,
					"type": "obstacle"
				},
				{
					"gridX": 6,
					"gridY": 2,
					"type": "obstacle"
				},
				{
					"gridX": 1,
					"gridY": 3,
					"type": "obstacle"
				},
				{
					"gridX": 6,
					"gridY": 3,
					"type": "obstacle"
				},
				{
					"gridX": 0,
					"gridY": 4,
					"type": "obstacle"
				},
				{
					"gridX": 6,
					"gridY": 4,
					"type": "obstacle"
				},
				{
					"gridX": 2,
					"gridY": 6,
					"type": "obstacle"
				},
				{
					"gridX": 1,
					"gridY": 7,
					"type": "obstacle"
				},
				{
					"gridX": 2,
					"gridY": 7,
					"type": "obstacle"
				}
			],
			"entities": [
				{
					"gridX": 4,
					"gridY": 4,
					"type": "character"
				},
				{
					"gridX": 3,
					"gridY": 2,
					"type": "specimen",
					"direction": "southeast"
				}
			]
		},
		{
			"name": "blank",
			"type": "level",
			"stage": "medical",
			"max": 20,
			"map": [
				{
					"gridX": 5,
					"gridY": 4,
					"type": "obstacle"
				},
				{
					"gridX": 2,
					"gridY": 5,
					"type": "obstacle"
				},
				{
					"gridX": 3,
					"gridY": 5,
					"type": "obstacle"
				},
				{
					"gridX": 6,
					"gridY": 5,
					"type": "obstacle"
				},
				{
					"gridX": 4,
					"gridY": 6,
					"type": "obstacle"
				},
				{
					"gridX": 3,
					"gridY": 7,
					"type": "obstacle"
				},
				{
					"gridX": 5,
					"gridY": 7,
					"type": "obstacle"
				},
				{
					"gridX": 5,
					"gridY": 8,
					"type": "obstacle"
				}
			],
			"entities": [
				{
					"gridX": 4,
					"gridY": 3,
					"type": "character"
				},
				{
					"gridX": 3,
					"gridY": 3,
					"type": "specimen",
					"direction": "southeast"
				}
			]
		},
		{
			"name": "pisces",
			"type": "level",
			"stage": "medical",
			"max": 9,
			"map": [
				{
					"gridX": 7,
					"gridY": 2,
					"type": "obstacle"
				},
				{
					"gridX": 6,
					"gridY": 3,
					"type": "obstacle"
				},
				{
					"gridX": 1,
					"gridY": 6,
					"type": "obstacle"
				},
				{
					"gridX": 6,
					"gridY": 6,
					"type": "obstacle"
				},
				{
					"gridX": 1,
					"gridY": 7,
					"type": "obstacle"
				},
				{
					"gridX": 2,
					"gridY": 7,
					"type": "obstacle"
				},
				{
					"gridX": 6,
					"gridY": 7,
					"type": "obstacle"
				}
			],
			"entities": [
				{
					"gridX": 4,
					"gridY": 4,
					"type": "character"
				},
				{
					"gridX": -1,
					"gridY": 3,
					"type": "specimen",
					"direction": "east"
				},
				{
					"gridX": 7,
					"gridY": 5,
					"type": "specimen",
					"direction": "west"
				}
			]
		},
		{
			"name": "blank",
			"type": "level",
			"stage": "medical",
			"max": 14,
			"map": [
				{
					"gridX": 6,
					"gridY": 5,
					"type": "obstacle"
				},
				{
					"gridX": 5,
					"gridY": 6,
					"type": "obstacle"
				},
				{
					"gridX": 1,
					"gridY": 7,
					"type": "obstacle"
				},
				{
					"gridX": 2,
					"gridY": 7,
					"type": "obstacle"
				},
				{
					"gridX": 5,
					"gridY": 7,
					"type": "obstacle"
				},
				{
					"gridX": 2,
					"gridY": 8,
					"type": "obstacle"
				}
			],
			"entities": [
				{
					"gridX": 4,
					"gridY": 4,
					"type": "character"
				},
				{
					"gridX": 3,
					"gridY": 1,
					"type": "specimen",
					"direction": "southeast"
				},
				{
					"gridX": 8,
					"gridY": 1,
					"type": "specimen",
					"direction": "southwest"
				},
				{
					"gridX": -1,
					"gridY": 5,
					"type": "specimen",
					"direction": "east"
				}
			]
		},
		{
			"name": "invasion",
			"type": "level",
			"stage": "medical",
			"max": 5,
			"map": [
				{
					"gridX": 5,
					"gridY": 2,
					"type": "obstacle"
				},
				{
					"gridX": 6,
					"gridY": 2,
					"type": "obstacle"
				},
				{
					"gridX": 4,
					"gridY": 3,
					"type": "obstacle"
				},
				{
					"gridX": 2,
					"gridY": 4,
					"type": "obstacle"
				},
				{
					"gridX": 5,
					"gridY": 4,
					"type": "obstacle"
				},
				{
					"gridX": 6,
					"gridY": 4,
					"type": "obstacle"
				},
				{
					"gridX": 1,
					"gridY": 5,
					"type": "obstacle"
				},
				{
					"gridX": 6,
					"gridY": 5,
					"type": "obstacle"
				},
				{
					"gridX": 1,
					"gridY": 6,
					"type": "obstacle"
				},
				{
					"gridX": 4,
					"gridY": 6,
					"type": "obstacle"
				},
				{
					"gridX": 2,
					"gridY": 7,
					"type": "obstacle"
				},
				{
					"gridX": 4,
					"gridY": 7,
					"type": "obstacle"
				},
				{
					"gridX": 0,
					"gridY": 8,
					"type": "obstacle"
				},
				{
					"gridX": 1,
					"gridY": 8,
					"type": "obstacle"
				},
				{
					"gridX": 3,
					"gridY": 8,
					"type": "obstacle"
				}
			],
			"entities": [
				{
					"gridX": 3,
					"gridY": 5,
					"type": "character"
				},
				{
					"gridX": 3,
					"gridY": 1,
					"type": "specimen",
					"direction": "southeast"
				},
				{
					"gridX": 5,
					"gridY": 8,
					"type": "specimen",
					"direction": "northwest"
				}
			]
		}
	]
}