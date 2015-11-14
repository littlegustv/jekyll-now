{
	"scenes": [
		{
			"name": "mainmenu",
			"type": "menu",
			"map": {},
			"entities": [
				{
					"gridX": 240,
					"gridY": 160,
					"text": "Main Menu",
					"type": "text",
					"speed": 100,
					"format": {
						"size": 44
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
			"map": [],
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
					"gridX": 240,
					"gridY": 164,
					"text": "Click to place a platform here >>",
					"type": "text",
					"speed": 50,
					"format": {
						"size": 16,
						"align": "right"
					}
				},
				{
					"gridX": 64,
					"gridY": 64,
					"text": "^ Click this button to run the level",
					"type": "text",
					"speed": 50,
					"delay": 2000,
					"format": {
						"size": 16,
						"align": "left"
					}
				},
				{
					"gridX": 244,
					"gridY": 244,
					"text": "Use the platforms to get to the object and back.",
					"type": "text",
					"speed": 50,
					"delay": 4000,
					"format": {
						"size": 16,
						"align": "center"
					}
				},
				{
					"gridX": 244,
					"gridY": 260,
					"text": "Right-click to remove a platform.",
					"type": "text",
					"speed": 50,
					"delay": 7000,
					"format": {
						"size": 16,
						"align": "center"
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
					"gridX": 244,
					"gridY": 244,
					"text": "You can't go over obstacles.  Find a way around.",
					"type": "text",
					"speed": 50,
					"delay": 100,
					"format": {
						"size": 16,
						"align": "center"
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
					"gridX": 2,
					"gridY": 4,
					"type": "obstacle"
				},
				{
					"gridX": 9,
					"gridY": 4,
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
					"gridX": 244,
					"gridY": 180,
					"text": "Normally you jump two spaces.",
					"type": "text",
					"speed": 50,
					"delay": 100,
					"format": {
						"size": 16,
						"align": "center"
					}
				},
				{
					"gridX": 244,
					"gridY": 200,
					"text": "If there is an obstacle in the way, you will only jump one space.",
					"type": "text",
					"speed": 50,
					"delay": 2000,
					"format": {
						"size": 16,
						"align": "center"
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
					"gridX": 8,
					"gridY": 2,
					"type": "obstacle"
				},
				{
					"gridX": 7,
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
			"name": "don't waste time going in the wrong direction",
			"type": "level",
			"stage": "habitation",
			"max": 7,
			"map": [
				{
					"gridX": 6,
					"gridY": 3,
					"type": "obstacle"
				},
				{
					"gridX": 3,
					"gridY": 4,
					"type": "obstacle"
				},
				{
					"gridX": 6,
					"gridY": 4,
					"type": "obstacle"
				},
				{
					"gridX": 9,
					"gridY": 4,
					"type": "obstacle"
				},
				{
					"gridX": 2,
					"gridY": 5,
					"type": "obstacle"
				},
				{
					"gridX": 9,
					"gridY": 5,
					"type": "obstacle"
				},
				{
					"gridX": 4,
					"gridY": 6,
					"type": "obstacle"
				},
				{
					"gridX": 8,
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
					"gridX": 7,
					"gridY": 4,
					"type": "collectable"
				}
			]
		},
		{
			"name": "sometimes you have to reverse to go forward",
			"type": "level",
			"stage": "habitation",
			"max": 8,
			"map": [
				{
					"gridX": 3,
					"gridY": 2,
					"type": "obstacle"
				},
				{
					"gridX": 4,
					"gridY": 2,
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
					"type": "obstacle"
				},
				{
					"gridX": 4,
					"gridY": 3,
					"type": "obstacle"
				},
				{
					"gridX": 3,
					"gridY": 5,
					"type": "obstacle"
				},
				{
					"gridX": 3,
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
			"name": "it might take longer, but sometimes you need space",
			"type": "level",
			"stage": "habitation",
			"max": 8,
			"map": [
				{
					"gridX": 4,
					"gridY": 2,
					"type": "obstacle"
				},
				{
					"gridX": 3,
					"gridY": 3,
					"type": "obstacle"
				},
				{
					"gridX": 5,
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
					"type": "obstacle"
				},
				{
					"gridX": 7,
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
			"name": "avoid the obvious",
			"type": "level",
			"stage": "habitation",
			"max": 8,
			"map": [
				{
					"gridX": 3,
					"gridY": 1,
					"type": "obstacle"
				},
				{
					"gridX": 7,
					"gridY": 1,
					"type": "obstacle"
				},
				{
					"gridX": 3,
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
					"gridY": 4,
					"type": "obstacle"
				},
				{
					"gridX": 2,
					"gridY": 4,
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
					"gridX": 0,
					"gridY": 7,
					"type": "obstacle"
				},
				{
					"gridX": 4,
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
			"name": "not sure about this one, to be honest",
			"type": "level",
			"stage": "habitation",
			"max": 10,
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
					"gridX": 5,
					"gridY": 2,
					"type": "obstacle"
				},
				{
					"gridX": 7,
					"gridY": 2,
					"type": "obstacle"
				},
				{
					"gridX": 2,
					"gridY": 3,
					"type": "obstacle"
				},
				{
					"gridX": 1,
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
					"gridX": 3,
					"gridY": 6,
					"type": "obstacle"
				},
				{
					"gridX": 5,
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
					"gridX": 7,
					"gridY": 4,
					"type": "collectable"
				}
			]
		},
		{
			"name": "the order you approach things matters",
			"type": "level",
			"stage": "habitation",
			"max": 10,
			"map": [
				{
					"gridX": 7,
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
					"gridX": 3,
					"gridY": 3,
					"type": "obstacle"
				},
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
					"gridX": 7,
					"gridY": 4,
					"type": "obstacle"
				},
				{
					"gridX": 1,
					"gridY": 5,
					"type": "obstacle"
				},
				{
					"gridX": 9,
					"gridY": 6,
					"type": "obstacle"
				},
				{
					"gridX": 2,
					"gridY": 7,
					"type": "obstacle"
				},
				{
					"gridX": 8,
					"gridY": 7,
					"type": "obstacle"
				},
				{
					"gridX": 2,
					"gridY": 8,
					"type": "obstacle"
				},
				{
					"gridX": 7,
					"gridY": 8,
					"type": "obstacle"
				},
				{
					"gridX": 2,
					"gridY": 9,
					"type": "obstacle"
				},
				{
					"gridX": 6,
					"gridY": 9,
					"type": "obstacle"
				},
				{
					"gridX": 2,
					"gridY": "10",
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
					"gridX": 6,
					"gridY": 8,
					"type": "collectable"
				}
			]
		},
		{
			"name": "entrance is important",
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
					"gridX": 2,
					"gridY": 5,
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
					"gridX": 7,
					"gridY": 2,
					"type": "obstacle"
				},
				{
					"gridX": 8,
					"gridY": 3,
					"type": "obstacle"
				},
				{
					"gridX": 6,
					"gridY": 4,
					"type": "undertow"
				},
				{
					"gridX": 4,
					"gridY": 5,
					"type": "obstacle"
				},
				{
					"gridX": 7,
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
					"gridX": 8,
					"gridY": 4,
					"type": "collectable"
				},
				{
					"gridX": 6,
					"gridY": 6,
					"type": "collectable"
				},
				{
					"gridX": 244,
					"gridY": 244,
					"text": "Where there's a strong undertow, platforms behave differently.",
					"type": "text",
					"speed": 50,
					"delay": 100,
					"format": {
						"size": 16,
						"align": "center"
					}
				},
				{
					"gridX": 244,
					"gridY": 270,
					"text": "Each time you jump, the platform turns.",
					"type": "text",
					"speed": 50,
					"delay": 4000,
					"format": {
						"size": 16,
						"align": "center"
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
					"gridX": 7,
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
					"gridX": 6,
					"gridY": 4,
					"type": "undertow"
				},
				{
					"gridX": 4,
					"gridY": 5,
					"type": "obstacle"
				},
				{
					"gridX": 4,
					"gridY": 6,
					"type": "obstacle"
				},
				{
					"gridX": 4,
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
			"name": "keep track of how many jumps",
			"type": "level",
			"stage": "hydroponics",
			"max": 9,
			"map": [
				{
					"gridX": 6,
					"gridY": 0,
					"type": "obstacle"
				},
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
					"gridX": 7,
					"gridY": 2,
					"type": "obstacle"
				},
				{
					"gridX": 5,
					"gridY": 3,
					"type": "obstacle"
				},
				{
					"gridX": 6,
					"gridY": 4,
					"type": "undertow"
				},
				{
					"gridX": "10",
					"gridY": 4,
					"type": "obstacle"
				},
				{
					"gridX": 4,
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
					"gridX": 4,
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
			"name": "when you have to choose",
			"type": "level",
			"stage": "hydroponics",
			"max": 16,
			"map": [
				{
					"gridX": 4,
					"gridY": 3,
					"type": "undertow"
				},
				{
					"gridX": 2,
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
					"gridX": 1,
					"gridY": 7,
					"type": "obstacle"
				},
				{
					"gridX": 1,
					"gridY": 8,
					"type": "obstacle"
				},
				{
					"gridX": 1,
					"gridY": 9,
					"type": "obstacle"
				},
				{
					"gridX": 2,
					"gridY": 9,
					"type": "obstacle"
				},
				{
					"gridX": 1,
					"gridY": "10",
					"type": "obstacle"
				}
			],
			"entities": [
				{
					"gridX": 4,
					"gridY": 1,
					"type": "character"
				},
				{
					"gridX": 2,
					"gridY": 7,
					"type": "collectable"
				},
				{
					"gridX": -1,
					"gridY": 8,
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
			"name": "the go-around",
			"type": "level",
			"stage": "hydroponics",
			"max": 16,
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
			"name": "not always so complicated ... should be earlier",
			"type": "level",
			"stage": "hydroponics",
			"max": 7,
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
			"name": "clue in planted",
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
			"max": 20,
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
			"name": "learning",
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
					"gridY": 244,
					"text": "If a platform is on a 'hotspot', it can only be jumped on once.",
					"type": "text",
					"speed": 50,
					"delay": 100,
					"format": {
						"size": 16,
						"align": "center"
					}
				}
			]
		},
		{
			"name": "they can be obstacles as well",
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
			"name": "make your own level",
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
			"name": "reduce what you need",
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
			"name": "plan how to start and how to stop",
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
			"max": 17,
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
						"align": "center"
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
			"name": "blank",
			"type": "level",
			"stage": "medical",
			"max": 20,
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
			"name": "blank",
			"type": "level",
			"stage": "medical",
			"max": 20,
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
			"name": "blank",
			"type": "level",
			"stage": "medical",
			"max": 20,
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
			"name": "blank",
			"type": "level",
			"stage": "medical",
			"max": 20,
			"map": [],
			"entities": [
				{
					"gridX": 4,
					"gridY": 4,
					"type": "character"
				}
			]
		}
	]
}