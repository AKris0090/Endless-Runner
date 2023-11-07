class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.gravDown = true;
    }

    create() {
        this.gravity = 1500;
        this.inputEnabled = true;
        this.prevYAccel = 0;

        // place tile sprite
        this.background1 = this.add.tileSprite(0, 0, 1200, 600, '1').setOrigin(0, 0);
        this.background2 = this.add.tileSprite(0, 0, 1200, 600, '2').setOrigin(0, 0);
        this.background3 = this.add.tileSprite(0, 0, 1200, 600, '3').setOrigin(0, 0);
        this.background4 = this.add.tileSprite(0, 0, 1200, 600, '4').setOrigin(0, 0);

        // add rocket (p1)
        this.p1Rocket = this.physics.add.sprite(this.sys.game.config.width/3, this.sys.game.config.height/6, 'rocket').setVelocity(0, 0);
        this.p1Rocket.setCollideWorldBounds(true);
        this.p1Rocket.setGravity(0, this.gravity);
        // draw order (for trail)
        this.p1Rocket.depth = 2;

        // set physics collider properly
        this.p1Rocket.body.setBoundsRectangle()

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        // init score
        this.p1Score = 0;


        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
              top: 5,
              bottom: 5,
            },
            fixedWidth: 100
        }

        let timeConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
              top: 5,
              bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(0, 0, this.p1Score, scoreConfig);

        this.timeRight = this.add.text(this.game.config.width - this.scoreLeft.width, 0, game.settings.gameTimer, timeConfig);

        // GAME OVER flag
        this.gameOver = false;

        this.p1Rocket.body.onWorldBounds=true;
        this.physics.world.on('worldbounds', (body, up, down, left, right) =>
            {
                if(left){
                    this.explodePlayer(this.p1Rocket);
                    this.gameOver = true;
                }
            });

        // // 60-second play clock
        // scoreConfig.fixedWidth = 0;
        // this.clock = this.time.delayedCall(10000, () => {
        //     this.add.text(game.config.width / 2, game.config.height / 2, 'GAME OVER', scoreConfig).setOrigin(0.5);
        //     this.add.text(game.config.width / 2, game.config.height / 2 + 64, 'Press (R) to Restart or <- for Menu', scoreConfig).setOrigin(0.5);
        //     this.gameOver = true;
        // }, null, this);

        // create emitter object
        emitter = this.add.particles(0, 0, 'emitterexplosion', {
            frame: ['muzzleflash7', 'muzzleflash3', 'muzzleflash2'],
            lifespan: 750,
            speed: {min: 0, max: 0},
            scale: {start: 1.0, end: 0},
            blendMode: 'ADD',
            frequency: 100,
            emitting: false
        });

        space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        space.on('up', () => {
            if(this.inputEnabled) {
                console.log('switching');
                this.gravity *= -1;
                this.p1Rocket.setGravity(0, this.gravity);
                if(this.gravDown) {
                    this.sound.play('switchGravUp')
                    this.gravDown = false;
                } else {
                    this.sound.play('switchGravDown')
                    this.gravDown = true;
                }
            }
        })

        // Play music
        this.gamePlayMusic = this.sound.add('game_music', { 
            mute: false,
            volume: 0.5,
            rate: 1,
            loop: true 
        });
        this.gamePlayMusic.play();
    }

    update() {

        if(keyF.isDown) {
            this.gameOver = true;
        }

        this.p1Rocket.play('jet', true);

        this.p1Rocket.setRotation(this.p1Rocket.body.velocity.y * 0.0006);

        if(this.gameOver) {
            this.p1Rocket.setVelocity(0, 0);
            this.p1Rocket.setGravity(0, 0)
            this.inputEnabled = false;
            // display score
            let gameOverConfig = {
                fontFamily: 'Courier',
                fontSize: '28px',
                backgroundColor: '#F3B141',
                color: '#843605',
                align: 'right',
                padding: {
                    top: 5,
                    bottom: 5,
                },
                fixedWidth: 0
            }
            this.add.text(game.config.width / 2, game.config.height / 2, 'GAME OVER', gameOverConfig).setOrigin(0.5);
            this.add.text(game.config.width / 2, game.config.height / 2 + 64, 'Press (R) to Restart or <- for Menu', gameOverConfig).setOrigin(0.5);;
        } else {
            this.trailParticles(this.p1Rocket);
        }

        // check key input for restart
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        this.background2.tilePositionX += 0.5;
        this.background3.tilePositionX += 2;
        this.background4.tilePositionX += 5;
    }

    trailParticles(p1Rocket) {
        // add a "shadow paddle" at main paddle position
        let rocketTrail = this.add.image(p1Rocket.x-40, p1Rocket.y, 'trailPart').setOrigin(0.4, 0.5);
        rocketTrail.setRotation(p1Rocket.body.velocity.y * 0.0008);
        this.prevYAccel = p1Rocket.body.velocity.y;
        // tween shadow paddle alpha to 0
        this.tweens.add({ 
            targets: rocketTrail,
            alpha: {from: 1.0, to: 0.0},
            x: -50,
            duration: 250,
            ease: 'Linear',
            repeat: 0 
        });
        // set a kill timer for trail effect
        this.time.delayedCall(250, () => { rocketTrail.destroy(); } );
    }
}