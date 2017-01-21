{
	"scenes": [
		{
			"name": "mainmenu",
			"type": "menu",
			"map": {},
			"entities": [
				{
					"type": "box",
					"format": {
						"x": -10, "y": 60, "h": 75, "w": 500, "color": "rgba(255,255,255,0.0)", "delay": 10
					},
					"border" : {"color" : "rgba(255,255,255,0.0)", "w": 0},
					"contents": [					
						{
							"gridX": 250,
							"gridY": 8,
							"text": "the",
							"type": "text",
							"format": {
								"size": 48,
								"align": "center",
								"color": "white"
							}
						},
						{
							"gridX": 250,
							"gridY": 32,
							"text": "floor",
							"type": "text",
							"format": {
								"size": 64,
								"align": "center",
								"color": "white"
							}
						},
						{
							"gridX": 250,
							"gridY": 52,
							"text": "is the",
							"type": "text",
							"format": {
								"size": 48,
								"align": "center",
								"color": "white"
							}
						},				
						{
							"gridX": 250,
							"gridY": 80,
							"text": "surface",
							"type": "text",
							"format": {
								"size": 64,
								"align": "center",
								"color": "white"
							}
						},					
						{
							"gridX": 250,
							"gridY": 100,
							"text": "of the sun",
							"type": "text",
							"format": {
								"size": 48,
								"align": "center",
								"color": "white"
							}
						}
					]
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
					"format": {"size": 16}
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
			"name": "for you",
			"type": "level",
			"stage": "tutorial",
			"walkthrough": "",
			"max": 4,
			"map": [
				{
					"gridX": 4,
					"gridY": 5,
					"type": "platform",
					"direction": "northeast"
				},
				{
					"gridX": 6,
					"gridY": 3,
					"type": "platform",
					"direction": "east"
				},
				{
					"gridX": 8,
					"gridY": 3,
					"type": "platform",
					"direction": "southwest"
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
					"gridX": 8,
					"gridY": 3,
					"type": "collectable"
				},
				{
					"type": "box",
					"format": {
						"x": -10, "y": 70, "h": 30, "w": 180, "color": "rgba(255,255,255,0.8)", "delay": 0
					},
					"border" : {"color" : "#18140c", "w": 4},
					"contents": [
						{
							"gridX": 18,
							"gridY": 20,
							"text": "^ press 'RUN'",
							"type": "text",
							"format": {
								"size": 28,
								"align": "left"
							}
						}
					]
				}
			]
		},
		{
			"name": "make a path",
			"type": "level",
			"stage": "tutorial",
			"walkthrough": "",			
			"max": 4,
			"map": [
				{
					"gridX": 0,
					"gridY": 3,
					"type": "platform",
					"direction": "southeast"
				},
				{
					"gridX": 2,
					"gridY": 5,
					"type": "platform",
					"direction": "northwest"
				},
				{
					"gridX": 2,
					"gridY": 3,
					"type": "platform",
					"direction": "west"
				},
				{
					"gridX": 0,
					"gridY": 5,
					"type": "highlight"
				}								
			],
			"entities": [
				{
					"gridX": 0,
					"gridY": 3,
					"type": "character"
				},
				{
					"gridX": 2,
					"gridY": 3,
					"type": "collectable"
				},
				{
					"type": "box",
					"format": {
						"x": 100, "y": 188, "h": 30, "w": 400, "color": "rgba(255,255,255,0.8)", "delay": 100
					},
					"border" : {"color" : "#18140c", "w": 4},
					"contents": [
						{
							"gridX": 8,
							"gridY": 20,
							"text": "^ add platform: CLICK HERE",
							"type": "text",
							"format": {
								"size": 28,
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
			"stage": "tutorial",
			"walkthrough": "",
			"max": 3,
			"map": [
				{
					"gridX": 2,
					"gridY": 5,
					"type": "platform",
					"direction": "southeast"
				},
				{
					"gridX": 4,
					"gridY": 5,
					"type": "platform",
					"direction": "northwest"
				},
				{
					"gridX": 4,
					"gridY": 3,
					"type": "platform",
					"direction": "southwest"
				}									
			],
			"entities": [
				{
					"gridX": 4,
					"gridY": 5,
					"type": "character"
				},
				{
					"gridX": 4,
					"gridY": 3,
					"type": "collectable"
				},
				{
					"gridX": 2,
					"gridY": 5,
					"type": "highlight"
				},
				{
					"type": "box",
					"format": {
						"x": 172, "y": 192, "h": 30, "w": 380, "color": "rgba(255,255,255,0.8)", "delay": 100
					},
					"border" : {"color" : "#18140c", "w": 4},
					"contents": [
						{
							"gridX": 8,
							"gridY": 20,
							"text": "^ remove: RIGHT-CLICK",
							"type": "text",
							"format": {
								"size": 28,
								"align": "left"
							}
						}
					]
				}
			]
		},	
		{
			"name": "turning & turning",
			"type": "level",
			"stage": "tutorial",
			"walkthrough": "",
			"max": 3,
			"map": [
				{
					"gridX": 7,
					"gridY": 4,
					"type": "platform",
					"direction": "west"
				},
				{
					"gridX": 7,
					"gridY": 2,
					"type": "platform",
					"direction": "southeast"
				}
			],
			"entities": [
				{
					"gridX": 5,
					"gridY": 4,
					"type": "character"
				},
				{
					"gridX": 7,
					"gridY": 2,
					"type": "collectable"
				},
				{
					"type": "box",
					"format": {
						"x": 100, "y": 192, "h": 30, "w": 460, "color": "rgba(255,255,255,0.8)", "delay": 100
					},
					"border" : {"color" : "#18140c", "w": 4},
					"contents": [
						{
							"gridX": 8,
							"gridY": 20,
							"text": "move MOUSE to TURN platform",
							"type": "text",
							"format": {
								"size": 28,
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
			"walkthrough": "",
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
						"x": -10, "y": 100, "h": 50, "w": 300, "color": "rgba(255,255,255,0.8)", "delay": 200
					},
					"border" : {"color" : "#18140c", "w": 4},
					"contents": [
						{
							"gridX": 280,
							"gridY": 30,
							"text": "  avoid OBSTACLES",
							"type": "text",
							"format": {
								"size": 28,
								"align": "right"
							}
						},
						{
							"gridX": 1,
							"gridY": 0,
							"type": "obstacle"
						}
					]
				}
			]
		},
		{
			"name": "closed in",
			"type": "level",
			"stage": "habitation",
			"walkthrough": "",
			"max": 2,
			"map": [
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
					"gridY":6,
					"type": "obstacle"
				},
				{
					"gridX":4,
					"gridY":5,
					"type": "obstacle"
				},
				{
					"gridX":4,
					"gridY":4,
					"type": "obstacle"
				},
				{
					"gridX":3,
					"gridY":4,
					"type": "obstacle"
				},
				{
					"gridX":2,
					"gridY":5,
					"type": "obstacle"
				},
				{
					"gridX":1,
					"gridY":6,
					"type": "obstacle"
				}
			],
			"entities": [
				{
					"gridX":2,
					"gridY":6,
					"type": "character"
				},
				{
					"gridX":3,
					"gridY":5,
					"type": "collectable"
				},
				{
					"type": "box",
					"format": {
						"x": 90, "y": 60, "h": 30, "w": 480, "color": "rgba(255,255,255,0.8)", "delay": 100
					},
					"border" : {"color" : "#18140c", "w": 4},
					"contents": [
						{
							"gridX": 8,
							"gridY": 20,
							"text": "use OBSTACLE to shorten jumps",
							"type": "text",
							"format": {
								"size": 28,
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
			"walkthrough": "https://youtu.be/OU7yr5dV5HI?t=43s",
			"max": 4,
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
					"gridX":3,
					"gridY":4,
					"type": "collectable"
				}			
			]
		},
		{
			"name": "star",
			"type": "level",
			"stage": "habitation",
			"walkthrough": "",
			"max": 4,
			"map": [
				{
					"gridX":1,
					"gridY":4,
					"type": "obstacle"
				},
				{
					"gridX":3,
					"gridY":3,
					"type": "obstacle"
				},
				{
					"gridX":3,
					"gridY":6,
					"type": "obstacle"
				},
				{
					"gridX":0,
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
					"gridX":3,
					"gridY":4,
					"type": "collectable"
				}			
			]
		},
		{
			"name": "direction is important",
			"type": "level",
			"stage": "habitation",
			"walkthrough": "https://youtu.be/OU7yr5dV5HI?t=54s",
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
				},
				{
					"type": "box",
					"format": {
						"x": 320, "y": 60, "h": 30, "w": 350, "color": "rgba(255,255,255,0.8)", "delay": 400
					},
					"border" : {"color" : "#18140c", "w": 4},
					"contents": [
						{
							"gridX": 8,
							"gridY": 20,
							"text": "Good luck!",
							"type": "text",
							"format": {
								"size": 28,
								"align": "left"
							}
						}
					]
				}
			]
		},
		{
			"name": "don't waste time",
			"type": "level",
			"stage": "habitation",
			"walkthrough": "https://youtu.be/OU7yr5dV5HI?t=1m8s",
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
			"walkthrough": "https://youtu.be/OU7yr5dV5HI?t=1m23s",
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
			"walkthrough": "https://youtu.be/OU7yr5dV5HI?t=1m40s",
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
			"walkthrough": "https://youtu.be/OU7yr5dV5HI?t=1m58s",
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
			"walkthrough": "https://youtu.be/OU7yr5dV5HI?t=2m16s",
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
			"walkthrough": "https://youtu.be/OU7yr5dV5HI?t=2m35s",
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
			"walkthrough": "https://youtu.be/rQpYy6tYv_M?t=3s",
			"max": 6,
			"map": [
				{
					"gridX":8,
					"gridY":2,
					"type": "obstacle"
				},
				{
					"gridX":9,
					"gridY":3,
					"type": "obstacle"
				},
				{
					"gridX":7,
					"gridY":4,
					"type": "undertow"
				},
				{
					"gridX":5,
					"gridY":5,
					"type": "obstacle"
				},
				{
					"gridX":8,
					"gridY":5,
					"type": "obstacle"
				},
				{
					"gridX":6,
					"gridY":6,
					"type": "obstacle"
				}
			],
			"entities": [
				{
					"gridX":5,
					"gridY":4,
					"type": "character"
				},
				{
					"gridX":9,
					"gridY":4,
					"type": "collectable"
				},
				{
					"gridX":7,
					"gridY":6,
					"type": "collectable"
				},
				{
					"type": "box",
					"format": {
						"x": 0, "y": 220, "h": 50, "w": 500, "color": "rgba(255,255,255,0.8)", "delay": 500
					},
					"border" : {"color" : "#18140c", "w": 4},
					"contents": [
						{
							"gridX": 442,
							"gridY": 30,
							"text": "an UNDERTOW spins your platform",
							"type": "text",
							"format": {
								"size": 28,
								"align": "right"
							}
						},
						{
							"type": "undertow",
							"gridX": 0,
							"gridY": 0
						}
					]
				}			
			]
		},
		{
			"name": "when you keep track",
			"type": "level",
			"stage": "hydroponics",
			"walkthrough": "https://youtu.be/rQpYy6tYv_M?t=24s",
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
			"walkthrough": "https://youtu.be/rQpYy6tYv_M?t=44s",
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
			"walkthrough": "https://youtu.be/rQpYy6tYv_M?t=1m12s",
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
			"walkthrough": "https://youtu.be/rQpYy6tYv_M?t=1m42s",
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
			"walkthrough": "https://youtu.be/rQpYy6tYv_M?t=2m02s",
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
			"walkthrough": "https://youtu.be/rQpYy6tYv_M?t=2m26s",
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
			"walkthrough": "https://youtu.be/rQpYy6tYv_M?t=2m58s",
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
			"walkthrough": "https://youtu.be/rQpYy6tYv_M?t=4m15s",
			"max": 14,
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
			"walkthrough": "https://youtu.be/rQpYy6tYv_M?t=4m46s",
			"max": 15,
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
			"walkthrough": "https://youtu.be/rQpYy6tYv_M?t=5m37s",
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
			"walkthrough": "https://youtu.be/rzOZPSBn2I0?t=1s",
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
						"x": 0, "y": 224, "h": 50, "w": 500, "color": "rgba(255,255,255,0.8)", "delay": 200
					},
					"border" : {"color" : "#18140c", "w": 4},
					"contents": [
						{
							"gridX": 38,
							"gridY": 30,
							"text": "  a HOTSPOT turns a    to ",
							"type": "text",
							"format": {
								"size": 28,
								"align": "left"
							}
						},
						{
							"type": "hotspot",
							"gridX": 0,
							"gridY": 0
						},
						{
							"type": "platform",
							"gridX": 8,
							"gridY": 0,
							"direction": "west"
						},
						{
							"type": "obstacle",
							"gridX": 10,
							"gridY": 0
						}
					]
				}
			]
		},
		{
			"name": "can you get in the way?",
			"type": "level",
			"stage": "operations",
			"walkthrough": "https://youtu.be/rzOZPSBn2I0?t=23s",
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
			"walkthrough": "https://youtu.be/rzOZPSBn2I0?t=41s",
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
			"walkthrough": "https://youtu.be/rzOZPSBn2I0?t=1m28s",
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
			"walkthrough": "https://youtu.be/rzOZPSBn2I0?t=1m51s",
			"max": 8,
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
			"walkthrough": "https://youtu.be/rzOZPSBn2I0?t=2m14s",
			"max": 13,
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
			"walkthrough": "https://youtu.be/rzOZPSBn2I0?t=2m55s",
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
			"walkthrough": "https://youtu.be/rzOZPSBn2I0?t=3m23s",
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
			"walkthrough": "https://youtu.be/rzOZPSBn2I0?t=3m47s",
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
			"walkthrough": "https://youtu.be/rzOZPSBn2I0?t=4m20s",
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
				},
				{
					"gridX": 5,
					"gridY": 8,
					"type": "obstacle"
				},
				{
					"gridX": 5,
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
			"name": "approach with care",
			"type": "level",
			"stage": "operations",
			"walkthrough": "https://youtu.be/rzOZPSBn2I0?t=4m50s",
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
			"walkthrough": "https://youtu.be/_UQiBITjXlg?t=1s",
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
						"x": 0, "y": 240, "h": 30, "w": 500, "color": "rgba(255,255,255,0.8)", "delay": 500
					},
					"border" : {"color" : "#18140c", "w": 4},
					"contents": [
						{
							"gridX": 8,
							"gridY": 20,
							"text": "Specimen move when you do.",
							"type": "text",
							"format": {
								"size": 28,
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
			"walkthrough": "https://youtu.be/_UQiBITjXlg?t=16s",
			"max": 12,
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
			"walkthrough": "https://youtu.be/_UQiBITjXlg?t=48s",
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
			"walkthrough": "https://youtu.be/_UQiBITjXlg?t=1m8s",
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
			"walkthrough": "https://youtu.be/_UQiBITjXlg?t=1m33s",
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
			"walkthrough": "https://youtu.be/_UQiBITjXlg?t=2m5s",
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
			"walkthrough": "https://youtu.be/_UQiBITjXlg?t=3m8s",
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
			"walkthrough": "https://youtu.be/_UQiBITjXlg?t=3m28s",
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
			"walkthrough": "https://youtu.be/_UQiBITjXlg?t=3m43s",
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
			"walkthrough": "https://youtu.be/_UQiBITjXlg?t=4m15s",
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
			"walkthrough": "https://youtu.be/_UQiBITjXlg?t=4m47s",
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
		}
	]
}