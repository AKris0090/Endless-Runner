class Party extends Phaser.Scene {
    constructor() {
        super('partyScene')
    }
 
    preload() {
        this.load.spritesheet('character2', './assets/spritesheets/Character_002.png', {
            frameWidth: 48,
            frameHeight: 48
        })
    }

    create() {
        
        this.cameras.main.setBackgroundColor(0xDDDDDD);

        this.player = this.physics.add.sprite(width / 2, height / 2, 'character2', 1).setScale(2);
        this.player.body.setCollideWorldBounds(true);
        this.player.body.setSize(32, 32).setOffset(8, 16);
        this.PLAYER_VELOCITY = 350;

        cursors = this.input.keyboard.createCursorKeys();

        playerDirection = 'down';

        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#AAAAAA',
            color: '#000',
            align: 'right',
            padding: {
              top: 1,
            },
        }

        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize, "partyScene - right click to switch", scoreConfig);
    }

    update() {
        if(!scene1flipflop) {
            let playerVector = new Phaser.Math.Vector2(0, 0)

            if(cursors.left.isDown) {
                playerVector.x = -1
                playerDirection = 'left'
            } else if (cursors.right.isDown) {
                playerVector.x = 1
                playerDirection = 'right'
            }
            if (cursors.up.isDown) {
                playerVector.y = -1
                playerDirection = 'up'
            } else if (cursors.down.isDown) {
                playerVector.y = 1
                playerDirection = 'down'
            }

            playerVector.normalize()

            // this.player.x += playerVector.x * this.PLAYER_VELOCITY
            // this.player.y += playerVector.y * this.PLAYER_VELOCITY

            this.player.setVelocity(this.PLAYER_VELOCITY * playerVector.x, this.PLAYER_VELOCITY * playerVector.y);

            let playerMovement
            playerVector.length() ? playerMovement = 'walk' : playerMovement = 'idle';
            this.player.play(playerMovement + '-' + playerDirection, true);
        }
    }
}