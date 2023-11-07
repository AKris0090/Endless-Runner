/* 
Name: Arjun Krishnan
Date: 11/06/2023
Game Title: Final Flight
Time: 20 hrs
Mods:
    - DONE Use multiple Scene classes (dictated by your game's style) (1) --------- Menu Scene and Play Scene
    - DONE Properly transition between Scenes and allow the player to restart w/out having to reload the page (1)
    - DONE Include in-game instructions using text or other means (e.g., tooltips, tutorial, diagram, etc.) (1)
    - DONE Have some form of player input/control appropriate to your game design (1)
    - DONE Include one or more animated characters that use a texture atlas* (1)
    - DONE Simulate scrolling with a tileSprite (or equivalent means) (1)
    - DONE Implement proper collision detection (via Arcade Physics or a custom routine) (1)
    - DONE Have looping background music* (1)
    - DONE Use a minimum of four sound effects for key mechanics, UI, and/or significant events appropriate to your game design (1) ---------- Menu Start, Explosion, Gravity Up, Gravity Down
    - DONE Use randomness to generate escalating challenge, e.g. terrain, pickups, etc. (1)
    - DONE Include some metric of accomplishment that a player can improve over time, e.g., score, survival time, etc. (1)
    - DONE Be theoretically endless (1)
    - DONE Be playable for at least 15 seconds for a new player of low to moderate skill (1)
    - DONE Run without significant crashes or errors (1)
    - DONE Include in-game credits for all roles, assets, music, etc. (1)

Creative Tilt Justifications:
    - I spent almost half the time on this project creating the assets. From the UI to the parallaxing background to the rocket animation to the moving enemies to the particle trail to the difficulty 
      increase indicator, I am really proud of how they turned out. I painted each of these assets by hand and spent so much time getting the details perfect.

    - That being said, from a technical perspective, I think the controls that I implemented are pretty cool, where you switch the gravity to move and traverse the area. I also had to play a bit with the
      velocity, and figure out how to translate that into rotation. Then, I implemented a particle emitter for the explosions played on player death. I also spent a good amount of time researching local 
      storage, and I was really interested to find that each url has its own local storage. I learned about its dictionary-like capability, where you give it a key and a value to store, and looked into 
      the differences between localstorage and sessionstorage. I thought that it would be similar to browser cookies, but I found out that they are completely different things.
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

// constants and globals
const middle = game.config.width/2;
const key = "ER_HIGHSCORE";
// bug fix - ?
let sonido = null;

// reserve keyboard vars
let keyF, keyB, keyR, space;

let emitter = null;
let trail2 = null;
let music = null;

let cam = null;