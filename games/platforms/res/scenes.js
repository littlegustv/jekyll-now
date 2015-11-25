{
	"scenes": [
		{
			"name": "mainmenu",
			"type": "menu",
			"map": {},
			"entities": [
				{
					"gridX": 16,
					"gridY": 64,
					"text": "The\nMyth\nOf\nIcarus",
					"type": "textblock",
					"speed": 50,
					"pause": 100,
					"format": {
						"size": 72,
						"align": "left"
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
					"gridX": 48,
					"gridY": 56,
					"text": "^ click PLAY to run mission",
					"type": "text",
					"format": {
						"size": 18,
						"align": "left",
						"color": "#0000DD"
					}
				},
				{
					"gridX": 240,
					"gridY": 240,
					"text": "Collect the object and get back to the start",
					"type": "text",
					"format": {
						"size": 18,
						"align": "center",
						"color": "#0000DD"
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
					"gridY": 6,
					"type": "obstacle"
				}
			],
			"entities": [
				{
					"gridX": 3,
					"gridY": 6,
					"type": "character"
				},
				{
					"gridX": 5,
					"gridY": 6,
					"type": "collectable"
				},
				{
					"gridX": 24,
					"gridY": 100,
					"text": " - click to add a new platform",
					"type": "text",
					"format": {
						"size": 18,
						"align": "left",
						"color": "#0000DD"
					}
				},
				{
					"gridX": 24,
					"gridY": 120,
					"text": " - hold & drag mouse to change direction",
					"type": "text",
					"format": {
						"size": 18,
						"align": "left",
						"color": "#0000DD"
					}
				},
				{
					"gridX": 24,
					"gridY": 140,
					"text": " - avoid the obstacle",
					"type": "text",
					"format": {
						"size": 18,
						"align": "left",
						"color": "#0000DD"
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
					"gridY": 240,
					"text": " - right-click to remove a platform",
					"type": "text",
					"format": {
						"size": 18,
						"align": "left",
						"color": "#0000DD"
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
					"gridX":244,
					"gridY":180,
					"text": "Normally you jump two spaces.\nIf there is an obstacle in the way,\nyou will only jump one space.\n\nUse this to your advantage.",
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
			"name": "order can be key",
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
			"max": 14,
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
					"text": "An undertow will turn a platform\neach time you jump.",
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
			"max": 9,
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
					"gridX": 6,
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
					"gridX": 0,
					"gridY": 5,
					"type": "obstacle"
				},
				{
					"gridX": 3,
					"gridY": 6,
					"type": "hotspot"
				},
				{
					"gridX": "-1",
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
					"gridX": 9,
					"gridY": 0,
					"type": "obstacle"
				},
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
				},
				{
					"gridX": "-1",
					"gridY": "10",
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
			"name": "el nino",
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
					"gridX": 5,
					"gridY": 3,
					"type": "hotspot"
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
					"type": "hotspot"
				},
				{
					"gridX": 6,
					"gridY": 4,
					"type": "hotspot"
				},
				{
					"gridX": 4,
					"gridY": 5,
					"type": "hotspot"
				},
				{
					"gridX": 5,
					"gridY": 5,
					"type": "hotspot"
				},
				{
					"gridX": 6,
					"gridY": 5,
					"type": "hotspot"
				},
				{
					"gridX": 4,
					"gridY": 6,
					"type": "hotspot"
				},
				{
					"gridX": 6,
					"gridY": 5,
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
			"name": "center cannot hold",
			"type": "level",
			"stage": "operations",
			"max": 20,
			"map": [
				{
					"gridX": 1,
					"gridY": 4,
					"type": "obstacle"
				},
				{
					"gridX": "10",
					"gridY": 4,
					"type": "obstacle"
				},
				{
					"gridX": 1,
					"gridY": 5,
					"type": "obstacle"
				},
				{
					"gridX": 5,
					"gridY": 5,
					"type": "hotspot"
				},
				{
					"gridX": 9,
					"gridY": 5,
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
					"type": "hotspot"
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
					"gridX": 8,
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
				}
			]
		},
		{
			"name": "rethinking what you know",
			"type": "level",
			"stage": "operations",
			"max": 11,
			"map": [
				{
					"gridX": 3,
					"gridY": 3,
					"type": "obstacle"
				},
				{
					"gridX": 4,
					"gridY": 3,
					"type": "obstacle"
				},
				{
					"gridX": 5,
					"gridY": 3,
					"type": "obstacle"
				},
				{
					"gridX": 6,
					"gridY": 3,
					"type": "obstacle"
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
					"gridX": 2,
					"gridY": 4,
					"type": "hotspot"
				},
				{
					"gridX": 9,
					"gridY": 4,
					"type": "hotspot"
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
					"gridX": 5,
					"gridY": 5,
					"type": "obstacle"
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
			"name": "it'll come to you",
			"type": "level",
			"stage": "medical",
			"max": 2,
			"map": [],
			"entities": [
				{
					"gridX": 4,
					"gridY": 4,
					"type": "character"
				},
				{
					"gridX": 6,
					"gridY": 4,
					"type": "specimen"
				},
				{
					"gridX": 244,
					"gridY": 244,
					"text": "Specimen move when you do.",
					"type": "text",
					"speed": 50,
					"delay": 100,
					"format": {
						"size": 16,
						"align": "center",
						"color": "#0000DD"
					}
				}
			]
		},
		{
			"name": "wait for it",
			"type": "level",
			"stage": "medical",
			"max": 7,
			"map": [
				{
					"gridX": 4,
					"gridY": 1,
					"type": "obstacle"
				},
				{
					"gridX": 2,
					"gridY": 3,
					"type": "obstacle"
				},
				{
					"gridX": 4,
					"gridY": 3,
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
					"gridX": 6,
					"gridY": 4,
					"type": "specimen"
				}
			]
		},
		{
			"name": "meet you halfway",
			"type": "level",
			"stage": "medical",
			"max": 10,
			"map": [
				{
					"gridX": 3,
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
					"type": "obstacle"
				},
				{
					"gridX": 2,
					"gridY": 5,
					"type": "obstacle"
				},
				{
					"gridX": 6,
					"gridY": 5,
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
					"type": "specimen"
				}
			]
		},
		{
			"name": "what stays the same, changes",
			"type": "level",
			"stage": "medical",
			"max": 7,
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
					"gridY": 4,
					"type": "obstacle"
				},
				{
					"gridX": 2,
					"gridY": 4,
					"type": "obstacle"
				},
				{
					"gridX": 6,
					"gridY": 5,
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
					"gridX": 6,
					"gridY": 4,
					"type": "specimen"
				},
				{
					"gridX": 7,
					"gridY": 4,
					"type": "specimen"
				}
			]
		},
		{
			"name": "understanding cycles",
			"type": "level",
			"stage": "medical",
			"max": 11,
			"map": [
				{
					"gridX": 4,
					"gridY": 1,
					"type": "obstacle"
				},
				{
					"gridX": 5,
					"gridY": 1,
					"type": "obstacle"
				},
				{
					"gridX": 5,
					"gridY": 2,
					"type": "obstacle"
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
					"type": "specimen"
				},
				{
					"gridX": 3,
					"gridY": 7,
					"type": "specimen"
				}
			]
		},
		{
			"name": "only one approach",
			"type": "level",
			"stage": "medical",
			"max": 8,
			"map": [
				{
					"gridX": 8,
					"gridY": 2,
					"type": "obstacle"
				},
				{
					"gridX": 6,
					"gridY": 3,
					"type": "obstacle"
				},
				{
					"gridX": 7,
					"gridY": 3,
					"type": "obstacle"
				},
				{
					"gridX": 9,
					"gridY": 4,
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
					"type": "obstacle"
				},
				{
					"gridX": 5,
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
					"type": "specimen"
				}
			]
		},
		{
			"name": "in step",
			"type": "level",
			"stage": "medical",
			"max": 13,
			"map": [
				{
					"gridX": 6,
					"gridY": 3,
					"type": "obstacle"
				},
				{
					"gridX": 7,
					"gridY": 3,
					"type": "obstacle"
				},
				{
					"gridX": 5,
					"gridY": 4,
					"type": "obstacle"
				},
				{
					"gridX": 7,
					"gridY": 4,
					"type": "obstacle"
				},
				{
					"gridX": 3,
					"gridY": 6,
					"type": "obstacle"
				},
				{
					"gridX": 2,
					"gridY": 7,
					"type": "obstacle"
				},
				{
					"gridX": 2,
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
					"gridX": 4,
					"gridY": 4,
					"type": "character"
				},
				{
					"gridX": 5,
					"gridY": 4,
					"type": "specimen"
				},
				{
					"gridX": 3,
					"gridY": 6,
					"type": "specimen"
				}
			]
		},
		{
			"name": "patience",
			"type": "level",
			"stage": "medical",
			"max": 10,
			"map": [
				{
					"gridX": 4,
					"gridY": 2,
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
					"type": "obstacle"
				},
				{
					"gridX": 1,
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
					"gridX": 4,
					"gridY": 8,
					"type": "obstacle"
				},
				{
					"gridX": 4,
					"gridY": 9,
					"type": "obstacle"
				},
				{
					"gridX": -1,
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
					"gridX": 4,
					"gridY": 7,
					"type": "specimen"
				},
				{
					"gridX": 1,
					"gridY": 7,
					"type": "specimen"
				}
			]
		},
		{
			"name": "snail shell",
			"type": "level",
			"stage": "medical",
			"max": 11,
			"map": [
				{
					"gridX": 6,
					"gridY": 4,
					"type": "obstacle"
				},
				{
					"gridX": 7,
					"gridY": 4,
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
					"gridX": 5,
					"gridY": 3,
					"type": "specimen"
				},
				{
					"gridX": 6,
					"gridY": 4,
					"type": "specimen"
				},
				{
					"gridX": 5,
					"gridY": 5,
					"type": "specimen"
				}
			]
		},
		{
			"name": "triangulation",
			"type": "level",
			"stage": "medical",
			"max": 11,
			"map": [
				{
					"gridX": 2,
					"gridY": 2,
					"type": "obstacle"
				},
				{
					"gridX": 8,
					"gridY": 2,
					"type": "obstacle"
				},
				{
					"gridX": 1,
					"gridY": 3,
					"type": "obstacle"
				},
				{
					"gridX": 2,
					"gridY": 3,
					"type": "obstacle"
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
					"gridX": 3,
					"gridY": 6,
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
					"gridX": 5,
					"gridY": 2,
					"type": "specimen"
				},
				{
					"gridX": 2,
					"gridY": 5,
					"type": "specimen"
				},
				{
					"gridX": 5,
					"gridY": 5,
					"type": "specimen"
				}
			]
		},
		{
			"name": "all of them",
			"type": "level",
			"stage": "medical",
			"max": 13,
			"map": [
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
					"gridX": 7,
					"gridY": 5,
					"type": "obstacle"
				},
				{
					"gridX": 3,
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
					"gridX": 3,
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
					"gridX": 4,
					"gridY": 5,
					"type": "specimen"
				},
				{
					"gridX": 5,
					"gridY": 5,
					"type": "specimen"
				},
				{
					"gridX": 4,
					"gridY": 6,
					"type": "specimen"
				},
				{
					"gridX": 3,
					"gridY": 6,
					"type": "specimen"
				}
			]
		}
	]
}