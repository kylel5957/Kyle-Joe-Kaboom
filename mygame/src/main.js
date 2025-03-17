import kaboom from "kaboom"

const k = kaboom()


//loading sprites
k.loadSprite("nerd", "sprites/nerd.png")
k.loadSprite("spike", "sprites/spike.png")
k.loadSprite("block", "sprites/block.png")
k.loadSprite("pov", "sprites/port2.png")


const SPEED = 400;
k.setGravity(1300);
setBackground(105, 105, 241);

const LEVELS = [
    [
        "@				  ",
		"				           > ",
        "=  =  =  =  =  = ",
    ],
	[
		" @        /      /    	",
		"=====================  ",
		"						",
		"        			    ",
		"       >  ///   ///    /     ",
		"       ================= ",


	],
	[
		"  /              /   ",
		"  =              =   ",
		"   @    =            ",
		"   =        /  =      ",
		"     /      =      >  ",
		"     =             =  ",
	],

]


scene("game", ({ levelIdx, score }) => {

	// Use the level passed, or first level
	const level = addLevel(LEVELS[levelIdx || 0], {
		tileWidth: 64,
		tileHeight: 64,
		pos: vec2(100, 200),
		tiles: {
			"@": () => [
				sprite("nerd"),
				area(),
				body(),
				anchor("bot"),
				"player",
			],
			"=": () => [
				sprite("block"),
				area(),
                scale(0.1),
                pos(0, 200),
                body({ isStatic: true }),
                anchor("bot"),
			],

			">": () => [
				sprite("pov"),
				area(),
				scale (0.13),
				pos(0, 220),
				anchor("bot"),
				"portal",
			],
			"/": () => [
				sprite("spike"),
				area(),
				anchor("bot"),
				scale(.3),
				pos(0, 250),
				"danger",
			],
		},
	})

	const player = level.get("player")[0]

	// userSprite Movements
	onKeyPress("space", () => {
		if (player.isGrounded()) {
			player.jump()
		}
	})

	onKeyDown("left", () => {
		player.move(-SPEED, 0)
	})

	onKeyDown("right", () => {
		player.move(SPEED, 0)
	})

	// Camera Tracking
	player.onUpdate(() => {
		camPos(player.worldPos())
	})

	player.onPhysicsResolve(() => {
		camPos(player.worldPos())
	})

	player.onCollide("danger", () => {
		player.pos = level.tile2Pos(0, 0)

		// Go to losing scene
		go("lose", { score: score })
	})


	// Death when userSprite reaches a certain position
	player.onUpdate(() => {
		if (player.pos.y >= 480) {
			go("lose", { score: score })
		}
	})

	// Enter the next level on portal
	player.onCollide("portal", () => {
		if (levelIdx < LEVELS.length - 1) {
			// If there's a next level, go() to the same scene but load the next level
			go("game", {
				levelIdx: levelIdx + 1,
				score: score + 1,
			})
		} else {
			// Otherwise we have reached the end of game, go to "win" scene!
			go("win", { score: score })
		}
	})

	// Score counter tracker
	const scoreLabel = add([
		text(score),
		pos(12,12),
		fixed(),
	])
})

	const scoreLabel = add([
		text(time()),
		pos(14,14),
		fixed(),
	])

scene("lose", ({ score }) => {

	add([
		text(`You beat ${score} level(s)... Try again!`),
		pos(12),


	])

	// Press any key to go back
	onKeyPress(start)

})

scene("win", ({ score }) => {

	add([
		text(`You beat ${score} levels!!!`, {
			width: width(),
		}),
		pos(12),
	])

	onKeyPress(start)

})

function start() {
	// Spawn at the game scene, beginning
	go("game", {
		levelIdx: 0,
		score: 0,
	})
}

start()

// Pause Menu
onKeyPress("p", () => {
	game.paused = !game.paused
	if (curTween) curTween.cancel()
	curTween = tween(
		pauseMenu.pos,
		game.paused ? center() : center().add(0, 700),
		1,
		(p) => pauseMenu.pos = p,
		easings.easeOutElastic,
	)
	if (game.paused) {
		pauseMenu.hidden = false
		pauseMenu.paused = false
	} else {
		curTween.onEnd(() => {
			pauseMenu.hidden = true
			pauseMenu.paused = true
		})
	}
})

const pauseMenu = add([
	rect(300, 400),
	color(255, 255, 255),
	outline(4),
	anchor("center"),
	pos(center().add(0, 700)),
])





// For future use:
// import kaboom from "kaboom"

// const k = kaboom()

// k.loadSprite("bean", "sprites/bean.png")

// k.add([
// 	k.pos(120, 80),
// 	k.sprite("bean"),
// ])

// k.onClick(() => k.addKaboom(k.mousePos()))
