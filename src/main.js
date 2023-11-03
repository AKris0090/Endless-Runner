// Exercise 01: Normalized Movement
// Name: Arjun Krishnan
// Date: 10/20/2023

// Spritesheet by ElvGames: https://elv-games.itch.io/free-fantasy-dreamland-sprites

"use strict"

let config = {
    type: Phaser.AUTO,
    render: {
        pixelArt: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
    width: 800,
    height: 800,
    scene: [ Manager, Movement, Party ]
}

let game = new Phaser.Game(config)


let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

let cursors
let cursors2
let { height, width } = game.config

let playerDirection
let playerDirection2
let scene1flipflop = true;