class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.gravDown = true;
    }

    create() {
        // set global variables
        this.gravity = 2000;
        this.inputEnabled = true;
        this.gameOverOnce = false;
        this.score = 1
        this.maxScore = localStorage.getItem(key);
        this.barrierSpeed = -450;
        this.secondStage = false;
        this.finalStage = false;
        cam = this.cameras.main
        sonido = this.sound

        // GAME OVER flag
        this.gameOver = false;

        // place tile sprites
        this.background1 = this.add.tileSprite(0, 0, 1200, 600, '1').setOrigin(0, 0);
        this.background2 = this.add.tileSprite(0, 0, 1200, 600, '2').setOrigin(0, 0);
        this.background3 = this.add.tileSprite(0, 0, 1200, 600, '3').setOrigin(0, 0);
        this.background4 = this.add.tileSprite(0, 0, 1200, 600, '4').setOrigin(0, 0);

        // add jet
        this.playerJet = this.physics.add.sprite(this.sys.game.config.width/2, this.sys.game.config.height/6, 'rocket').setVelocity(0, 0);
        this.playerJet.setCollideWorldBounds(true);
        this.playerJet.setGravity(0, this.gravity);

        // play anims
        this.playerJet.anims.play('jet', true);

        // draw order (for trail)
        this.playerJet.depth = 2;
        this.playerJet.body.setFriction(0);

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyB = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        // input key event handling
        space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        space.on('up', () => {
            if(this.inputEnabled) {
                this.gravity *= -1;
                this.playerJet.setGravity(0, this.gravity);
                if(this.gravDown) {
                    this.sound.play('switchGravUp')
                    this.gravDown = false;
                } else {
                    this.sound.play('switchGravDown')
                    this.gravDown = true;
                }
            }
        })

        // display high score
        let highScoreConfig = {
            fontFamily: 'font1',
            fontSize: '28px',
            color: '#4AD7F8',
            align: 'right',
            fixedWidth: 0
        }

        // display score
        let scoreConfig = {
            fontFamily: 'font1',
            fontSize: '28px',
            color: '#4AD7F8',
            align: 'left',
            fixedWidth: 0
        }

        // display instructions score
        let instructionConfig = {
            fontFamily: 'font1',
            fontSize: '20px',
            color: '#4AD7F8',
            align: 'right',
            fixedWidth: 0
        }

        // instruction at top of screen
        this.add.text(game.config.width / 2, 10, 'use [SPACEBAR] to switch gravity', instructionConfig).setOrigin(0.5, 0);

        // high score
        this.scoreLeft = this.add.text(20, 10, "High Score: " + this.maxScore, highScoreConfig);

        // current score
        this.timeRight = this.add.text(this.game.config.width - this.scoreLeft.width - 100, 10, this.score, scoreConfig);

        // check collision direction of jet
        this.playerJet.body.onWorldBounds=true;
        this.physics.world.on('worldbounds', (body, up, down, left, right) =>
            {
                if(left){
                    this.shipExplode(this.playerJet);
                    this.gameOver = true;
                }
            });

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

        // Play bg music
        this.gamePlayMusic = this.sound.add('game_music', { 
            mute: false,
            volume: 0.5,
            rate: 1,
            loop: true 
        });
        this.gamePlayMusic.play();

        // call barrier spawn after a second
        this.time.delayedCall(1000, () => { 
            this.addFlyingBarrier(); 
        });

        // seconds counter + difficulty incrementor
        this.difficultyTimer = this.time.addEvent({
            delay: 1000,
            callback: this.inc,
            callbackScope: this,
            loop: true
        });

        //////////////////////////////////////////////////////////////// Enemy Barriers

        // set up barrier groups
        this.topBarrierGroup = this.add.group({
            runChildUpdate: true
        });

        // add collider for all barriers in the group
        this.physics.add.collider(this.playerJet, this.topBarrierGroup);
    }

    update() {
        if(this.gameOver) {
            // only want to call these things once
            if(!this.gameOverOnce) {
                if(this.score > this.maxScore) {
                    // set local storage
                    localStorage.setItem("ER_HIGHSCORE", this.score)
                }
                this.gameOverOnce = true;
                // stop animations, explode the ship, and disable input
                this.playerJet.anims.stop();
                this.shipExplode(this.playerJet, this.sound);
                this.playerJet.setVelocity(0, 0);
                this.playerJet.setGravity(0, 0)
                this.inputEnabled = false;

                // game over text
                let gameOverConfig = {
                    fontFamily: 'font1',
                    fontSize: '40px',
                    backgroundColor: '#00000',
                    color: '#FFFFFF',
                    align: 'right',
                    padding: 15,
                    fixedWidth: 0
                }
                this.add.text(game.config.width / 2, game.config.height / 2, 'GAME OVER', gameOverConfig).setOrigin(0.5).depth = 3;
                this.add.text(game.config.width / 2, game.config.height / 2 + 64, 'Press (R) to Restart or (B) for Menu', gameOverConfig).setOrigin(0.5).depth = 3;
            }
        } else {
            // still in play

            // set text to update current score
            this.timeRight.setText("Current Score: " + this.score);

            // rotate to face the direction of player movement
            this.playerJet.setRotation(this.playerJet.body.velocity.y * 0.0003);

            // spawn trailing particles if in second phase
            if(this.secondStage) {
                this.trailParticles(this.playerJet);
            }

            // rainbow dash final stage
            if(this.finalStage) {
                this.playerJet.setTint(Math.random() * 0xFFFFFF);
                this.timeRight.setTintFill(Math.random() * 0xFFFFFF);
                this.scoreLeft.setTintFill(Math.random() * 0xFFFFFF);
            }

            // parallaxing background
            this.background2.tilePositionX += 0.5;
            this.background3.tilePositionX += 2;
            this.background4.tilePositionX += 5;

            //bug fix #2
            this.playerJet.setVelocityX(0);
        }

        // check key input for restart
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.sound.stopAll();
            this.scene.restart();
        }

        // check key input for back to menu
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyB)) {
            this.sound.stopAll();
            this.scene.start("menuScene");
        }
    }

    inc() {
        if(!this.gameOver) {
        this.score += 1;

        if(this.score >= 20 && !this.secondStage) {
            this.barrierSpeed -= 100;
            let counter = 0;
            // flashes on interval
            var int = setInterval(function() {
                counter++;
                if(counter > 4) {
                    clearInterval(int); // stop interval 
                }
                cam.flash();
            }, 500);
            this.gamePlayMusic.rate += 0.01;
            this.secondStage = true;
        } else if (this.score >= 40 && !this.finalStage) {
            let counter = 0;
            // flashes on interval
            var int = setInterval(function() {
                counter++;
                if(counter > 4) {
                    clearInterval(int); // stop interval 
                }
                cam.flash();
            }, 500);
            this.barrierSpeed -= 100;
            this.gamePlayMusic.rate += 0.01;
            this.finalStage = true;
        } else if (this.score % 20 == 0 && this.secondStage && this.finalStage) {
            let counter = 0;
            var int = setInterval(function() {
                counter++;

                if(counter > 4) {
                    clearInterval(int); // stop interval 
                }

                cam.flash();
            }, 500);
            this.barrierSpeed -= 100;
        }
    }
    }

    // first addition of barriers
    addFlyingBarrier() {
        if(!this.gameOver) {
            let barrier = new doubleBarrier(this, this.barrierSpeed);
            this.topBarrierGroup.add(barrier);
        }
    }

    // particle trailing
    trailParticles(playerJet) {
        let rocketTrail = this.add.image(playerJet.x-40, playerJet.y, 'trailPart').setOrigin(0.4, 0.5);
        // rainbow particles if final stage
        if(this.finalStage) {
            rocketTrail.setTint(Math.random() * 0xFFFFFF);
        }
        rocketTrail.setRotation(playerJet.body.velocity.y * 0.0005);
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

    shipExplode(ship, sound) {
        // temp hide ship
        ship.alpha = 0;
        
        // emit explosion particles with delay at ship's position
        let pos = new Phaser.Math.Vector2(ship.x, ship.y);
        let counter = 0;
        // explosions on an interval every 150 ms, count of 4
        var int = setInterval(function() {
            counter++;

            if(counter > 4) {
                clearInterval(int); // stop interval 
                ship.destroy();
            }

            // PARTICLES GO!!!
            emitter.emitParticle(1, pos.x + Phaser.Math.Between(-15, 15), pos.y + Phaser.Math.Between(-5, 5));
            sonido.play('explosion', {
                mute: false,
                volume: 0.1,
                rate: 1,
            });
        }, 150);
    }
}