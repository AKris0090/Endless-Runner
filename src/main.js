/* 
Name: Arjun Krishnan
Mod Title: Rocket Patrol Re-imagined: The Endless Storm
Time: 7 hrs
Mods:
    - DONE Use multiple Scene classes (dictated by your game's style) (1)
    - DONE Properly transition between Scenes and allow the player to restart w/out having to reload the page (1)
    - DONE Include in-game instructions using text or other means (e.g., tooltips, tutorial, diagram, etc.) (1)
    - DONE Have some form of player input/control appropriate to your game design (1)
    - DONE Include one or more animated characters that use a texture atlas* (1)
    - DONE Simulate scrolling with a tileSprite (or equivalent means) (1)
    - Implement proper collision detection (via Arcade Physics or a custom routine) (1)
    - DONE Have looping background music* (1)
    - Use a minimum of four sound effects for key mechanics, UI, and/or significant events appropriate to your game design (1)
    - Use randomness to generate escalating challenge, e.g. terrain, pickups, etc. (1)
    - Include some metric of accomplishment that a player can improve over time, e.g., score, survival time, etc. (1)
    - DONE Be theoretically endless (1)
    - Be playable for at least 15 seconds for a new player of low to moderate skill (1)
    - DONE Run without significant crashes or errors (1)
    - DONE Include in-game credits for all roles, assets, music, etc. (1)
Citations:
    - 
*/

let config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
    pixelArt: true,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config);

game.settings = {
    spaceshipSpeed: 3,
    gameTimer: 60000
}

// reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT, space;

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

let emitter = null;
let trail2 = null;
let music = null;