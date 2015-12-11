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
					"text": ">< Starship Icarus IJ93.2 Mainframe Computer ><\n\n>>     <Access granted, what is your query?>\n\n>>     .  .  .  I've dropped some things - \n>>     -- on the surface on the sun.\n\n>>     - just bear with me  .  .  .\n\n>>     I have a plan.",
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
			"name": "first",
			"type": "level",
			"stage": "tutorial",
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
					"type": "box",
					"format": {
						"x": 130, "y": 60, "h": 30, "w": 280, "color": "rgba(255,255,255,0.6)", "delay": 500
					},
					"border" : {"color" : "#18140c", "w": 4},
					"contents": [
						{
							"gridX": 8,
							"gridY": 20,
							"text": "This is the view from above",
							"type": "text",
							"format": {
								"size": 16,
								"align": "left"
							}
						}
					]
				},
				{
					"type": "box",
					"format": {
						"x": 10, "y": 100, "h": 30, "w": 400, "color": "rgba(255,255,255,0.6)", "delay": 2000
					},
					"border" : {"color" : "#18140c", "w": 4},
					"contents": [
						{
							"gridX": 8,
							"gridY": 20,
							"text": "^ Press 'RUN' to send down the astronaut",
							"type": "text",
							"format": {
								"size": 16,
								"align": "left"
							}
						}
					]
				},
				{
					"type": "box",
					"format": {
						"x": 50, "y": 200, "h": 30, "w": 400, "color": "rgba(255,255,255,0.6)", "delay": 3200
					},
					"border" : {"color" : "#18140c", "w": 4},
					"contents": [
						{
							"gridX": 8,
							"gridY": 20,
							"text": "The platforms direct you THERE and BACK",
							"type": "text",
							"format": {
								"size": 16,
								"align": "left"
							}
						}
					]
				}
			]
		},
		{
			"name": "second",
			"type": "level",
			"stage": "habitation",
			"max": 4,
			"map": [								
			],
			"entities": [
				{
					"gridX": 4,
					"gridY": 5,
					"type": "character"
				},
				{
					"gridX": 8,
					"gridY": 3,
					"type": "collectable"
				},
				{
					"type": "box",
					"format": {
						"x": 100, "y": 192, "h": 30, "w": 370, "color": "rgba(255,255,255,0.6)", "delay": 2400
					},
					"border" : {"color" : "#18140c", "w": 4},
					"contents": [
						{
							"gridX": 362,
							"gridY": 20,
							"text": "To add a platform, CLICK and HOLD.",
							"type": "text",
							"format": {
								"size": 16,
								"align": "right"
							}
						}
					]
				},
				{
					"type": "box",
					"format": {
						"x": 10, "y": 232, "h": 30, "w": 370, "color": "rgba(255,255,255,0.6)", "delay": 4800
					},
					"border" : {"color" : "#18140c", "w": 4},
					"contents": [
						{
							"gridX": 8,
							"gridY": 20,
							"text": "A platform will move you TWO spaces.",
							"type": "text",
							"format": {
								"size": 16,
								"align": "left"
							}
						}
					]
				},
				{
					"type": "box",
					"format": {
						"x": 10, "y": 60, "h": 50, "w": 190, "color": "rgba(255,255,255,0.6)", "delay": 500
					},
					"border" : {"color" : "#18140c", "w": 4},
					"contents": [
						{
							"gridX": 8,
							"gridY": 20,
							"text": "Make a path to the\nOBJECT and BACK.",
							"type": "textblock",
							"format": {
								"size": 16,
								"align": "left"
							}
						}
					]
				},
				{
					"type": "box",
					"format": {
						"x": 360, "y": 120, "h": 30, "w": 100, "color": "rgba(255,255,255,0.6)", "delay": 1000
					},
					"border" : {"color" : "#18140c", "w": 4},
					"contents": [
						{
							"gridX": 8,
							"gridY": 20,
							"text": "^ (object)",
							"type": "text",
							"format": {
								"size": 16,
								"align": "left"
							}
						}
					]
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
					"type": "box",
					"format": {
						"x": 10, "y": 240, "h": 30, "w": 400, "color": "rgba(255,255,255,0.6)", "delay": 300
					},
					"border" : {"color" : "#18140c", "w": 4},
					"contents": [
						{
							"gridX": 8,
							"gridY": 20,
							"text": "RIGHT-CLICK to remove a platform.",
							"type": "text",
							"format": {
								"size": 16,
								"align": "left"
							}
						}
					]
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
					"gridX": 8,
					"gridY": 4,
					"type": "obstacle"
				}
			],
			"entities": [
				{
					"gridX": 7,
					"gridY": 4,
					"type": "character"
				},
				{
					"gridX": 9,
					"gridY": 4,
					"type": "collectable"
				},
				{
					"type": "box",
					"format": {
						"x": 10, "y": 60, "h": 50, "w": 260, "color": "rgba(255,255,255,0.6)", "delay": 200
					},
					"border" : {"color" : "#18140c", "w": 4},
					"contents": [
						{
							"gridX": 252,
							"gridY": 30,
							"text": " - this is an OBSTACLE",
							"type": "text",
							"format": {
								"size": 16,
								"align": "right"
							}
						},
						{
							"gridX": 0,
							"gridY": 0,
							"type": "obstacle"
						}
					]
				},
				{
					"type": "box",
					"format": {
						"x": 10, "y": 240, "h": 30, "w": 400, "color": "rgba(255,255,255,0.6)", "delay": 1600
					},
					"border" : {"color" : "#18140c", "w": 4},
					"contents": [
						{
							"gridX": 8,
							"gridY": 20,
							"text": "You will need to make a path AROUND it.",
							"type": "text",
							"format": {
								"size": 16,
								"align": "left"
							}
						}
					]
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
					"gridX":1,
					"gridY":4,
					"type": "obstacle"
				},
				{
					"gridX":6,
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
					"type": "box",
					"format": {
						"x": 10, "y": 180, "h": 50, "w": 400, "color": "rgba(255,255,255,0.6)", "delay": 300
					},
					"border" : {"color" : "#18140c", "w": 4},
					"contents": [
						{
							"gridX": 8,
							"gridY": 20,
							"text": "If there is an obstacle blocking a jump\nYou will only jump ONE space.",
							"type": "textblock",
							"format": {
								"size": 16,
								"align": "left"
							}
						}
					]
				},
				{
					"type": "box",
					"format": {
						"x": 210, "y": 60, "h": 30, "w": 260, "color": "rgba(255,255,255,0.6)", "delay": 2200
					},
					"border" : {"color" : "#18140c", "w": 4},
					"contents": [
						{
							"gridX": 252,
							"gridY": 20,
							"text": "Use this to adjust your path.",
							"type": "text",
							"format": {
								"size": 16,
								"align": "right"
							}
						}
					]
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
					"type": "box",
					"format": {
						"x": 70, "y": 220, "h": 50, "w": 400, "color": "rgba(255,255,255,0.6)", "delay": 500
					},
					"border" : {"color" : "#18140c", "w": 4},
					"contents": [
						{
							"gridX": 392,
							"gridY": 30,
							"text": " - this is an space with an UNDERTOW",
							"type": "text",
							"format": {
								"size": 16,
								"align": "right"
							}
						},
						{
							"type": "undertow",
							"gridX": 0,
							"gridY": 0
						}
					]
				},
				{
					"type": "box",
					"format": {
						"x": 10, "y": 60, "h": 70, "w": 105, "color": "rgba(255,255,255,0.6)", "delay": 1700
					},
					"border" : {"color" : "#18140c", "w": 4},
					"contents": [
						{
							"gridX": 8,
							"gridY": 20,
							"text": "It will turn\neach time\nyou JUMP",
							"type": "textblock",
							"format": {
								"size": 16,
								"align": "left"
							}
						}
					]
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
			"name": "when it's early days",
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
			"name": "when we're back again",
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
			"name": "when it's doubled",
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
			"name": "when you coordinate",
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
			"name": "when it isn't as complicated",
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
			"name": "when you follow the lead",
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
			"name": "when it goes around",
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
					"type": "box",
					"format": {
						"x": 10, "y": 60, "h": 50, "w": 240, "color": "rgba(255,255,255,0.6)", "delay": 200
					},
					"border" : {"color" : "#18140c", "w": 4},
					"contents": [
						{
							"gridX": 38,
							"gridY": 30,
							"text": " - this is a HOTSPOT",
							"type": "text",
							"format": {
								"size": 16,
								"align": "left"
							}
						},
						{
							"type": "hotspot",
							"gridX": 0,
							"gridY": 0
						}
					]
				},
				{
					"type": "box",
					"format": {
						"x": 10, "y": 220, "h": 50, "w": 360, "color": "rgba(255,255,255,0.6)", "delay": 1500
					},
					"border" : {"color" : "#18140c", "w": 4},
					"contents": [
						{
							"gridX": 8,
							"gridY": 20,
							"text": "A platform on a HOTSPOT turns into an\nOBSTACLE after being jumped on.",
							"type": "textblock",
							"format": {
								"size": 16,
								"align": "left"
							}
						}
					]
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
			"name": "interception",
			"type": "level",
			"stage": "medical",
			"max": 6,
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
					"gridX": 7,
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
					"gridX": 5,
					"gridY": 3,
					"type": "character"
				},
				{
					"gridX": 2,
					"gridY": 7,
					"type": "specimen",
					"direction": "northeast"
				},
				{
					"type": "box",
					"format": {
						"x": 10, "y": 240, "h": 30, "w": 280, "color": "rgba(255,255,255,0.6)", "delay": 500
					},
					"border" : {"color" : "#18140c", "w": 4},
					"contents": [
						{
							"gridX": 8,
							"gridY": 20,
							"text": "Specimen move when you do.",
							"type": "text",
							"format": {
								"size": 16,
								"align": "left"
							}
						}
					]
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
			"name": "rush",
			"type": "level",
			"stage": "medical",
			"max": 10,
			"map": [
				{
					"gridX": 3,
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
					"gridY": 5,
					"type": "obstacle"
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
					"gridX": 0,
					"gridY": 3,
					"type": "specimen",
					"direction": "east"
				},
				{
					"gridX": -2,
					"gridY": 5,
					"type": "specimen",
					"direction": "east"
				},
				{
					"gridX": -2,
					"gridY": 7,
					"type": "specimen",
					"direction": "east"
				}
			]
		},
		{
			"name": "scattershot",
			"type": "level",
			"stage": "medical",
			"max": 12,
			"map": [
				{
					"gridX": 5,
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
					"gridY": 4,
					"type": "obstacle"
				},
				{
					"gridX": 6,
					"gridY": 4,
					"type": "obstacle"
				},
				{
					"gridX": 4,
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
					"gridX": 5,
					"gridY": 7,
					"type": "obstacle"
				}
			],
			"entities": [
				{
					"gridX": 4,
					"gridY": 2,
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
			"name": "inside out",
			"type": "level",
			"stage": "medical",
			"max": 12,
			"map": [
				{
					"gridX": 1,
					"gridY": 4,
					"type": "obstacle"
				},
				{
					"gridX": 1,
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
					"gridX": 3,
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
					"gridX": 2,
					"gridY": 2,
					"type": "specimen",
					"direction": "southeast"
				},
				{
					"gridX": -3,
					"gridY": 8,
					"type": "specimen",
					"direction": "northeast"
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
		},
		{
			"name": "convergence",
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
			"name": "rain",
			"type": "level",
			"stage": "medical",
			"max": 12,
			"map": [
				{
					"gridX": 8,
					"gridY": 3,
					"type": "obstacle"
				},
				{
					"gridX": 1,
					"gridY": 4,
					"type": "obstacle"
				},
				{
					"gridX": 8,
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
				},
				{
					"gridX": 0,
					"gridY": 7,
					"type": "obstacle"
				},
				{
					"gridX": -1,
					"gridY": 8,
					"type": "obstacle"
				}
			],
			"entities": [
				{
					"gridX": 5,
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
					"gridX": 4,
					"gridY": 2,
					"type": "specimen",
					"direction": "southeast"
				}
			]
		},
		{
			"name": "coincidence",
			"type": "level",
			"stage": "medical",
			"max": 8,
			"map": [
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
					"gridX": 5,
					"gridY": 2,
					"type": "specimen",
					"direction": "southeast"
				},
				{
					"gridX": -2,
					"gridY": 9,
					"type": "specimen",
					"direction": "northeast"
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
			"name": "endscene",
			"type": "cutscene",
			"stage": "end",
			"map": [],
			"entities": []
		}
	]
}