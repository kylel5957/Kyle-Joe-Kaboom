import kaboom from "kaboom"

const k = kaboom()


//loading sprites
k.loadSprite("bean", "sprites/bean.png")
k.loadSprite("spike", "sprites/spike.png")
k.loadSprite("block", "sprites/block.png")
k.loadSprite("pov", "sprites/portal.jpg")


const SPEED = 400;
k.setGravity(1300);


const LEVELS = [
    [
        "@",

        "=  =  =  =  =  = >",
    ],
    [
        "@",
        " =   =   =   =   =  >",
    ],
	[
		"       /  $      $     ",
		" @                     ",
		"====================== ",
		"       /  $            ",
		"                       ",
		"  =======================",
		"         $$$$          ",
		"                   >   ",
		"====/========//========",

	],
	[
		"  $               $   ",
		"  =     $         =   ",
		"   @    =      $      ",
		"   =        $  =      ",
		"     $      =      >  ",
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
				sprite("bean"),
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
				sprite("portal"),
				area(),
				anchor("bot"),
			],

			"^": () => [
				sprite("pov"),
				area(),
				scale (0.3),
				pos(0, 200),
				anchor("bot"),
				"portal",
			],
			"/": () => [
				sprite("spike"),
				area(),
				anchor("bot"),
				scale(.2),
				"danger",
			],
		},
	})

	// Get the player object from tag
	const player = level.get("player")[0]

	// Movements
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

	player.onCollide("danger", () => {
		player.pos = level.tile2Pos(0, 0)
		// Go to "lose" scene when we hit a "danger"
		go("lose", { score: score })
	})



	// Fall death
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

	// Score counter text
	const scoreLabel = add([
		text(score),
		pos(12),
	])

})

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
	// Start with the "game" scene, with initial parameters
	go("game", {
		levelIdx: 0,
		score: 0,
	})
}

start()




// For future use:
// import kaboom from "kaboom"

// const k = kaboom()

// k.loadSprite("bean", "sprites/bean.png")

// k.add([
// 	k.pos(120, 80),
// 	k.sprite("bean"),
// ])

// k.onClick(() => k.addKaboom(k.mousePos()))
