class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('trailPart', './assets/partTrail.png');
        this.load.image('1', './assets/Background-1.png');
        this.load.image('2', './assets/Background-2.png');
        this.load.image('3', './assets/Background-3.png');
        this.load.image('4', './assets/Background-4.png');

        this.load.atlas('emitterexplosion', './assets/explosion-realistic.png', './assets/explosion.json');

        // load audio
        this.load.audio('sfx_select', './assets/Menu-Startup.wav');
        this.load.audio('explosion', './assets/explosionfinal.wav');
        this.load.audio('switchGravDown', './assets/switchGrav - down.wav');
        this.load.audio('switchGravUp', './assets/switchGrav - up.wav');

        // Menu music soundtrack
        this.load.audio('menu_music', './assets/Music/Synthwave_Menu.mp3');

        // Gameplay music soundtrack
        this.load.audio('game_music', './assets/Music/Synthwave_Main.mp3');

        this.load.spritesheet('rocket', './assets/spritesheets/JetSpSheet.png', {
            frameWidth: 128,
            frameHeight: 32
        })

        this.load.spritesheet('barrier', './assets/spritesheets/Electric_Barrier.png', {
            frameWidth: 48,
            frameHeight: 400
        })
      }

    create() {
        // Play background menu music
        this.music = this.sound.add('menu_music', { 
            mute: false,
            volume: 0.5,
            rate: 1,
            loop: true 
        });
        this.music.play();

        // ALL OF THESE ARE TEXT CONFIGS
        let menuConfig2 = {
            fontFamily: 'font1',
            fontSize: '145px',
            color: '#FFFFFF',
            align: 'right',
        }

        let creditConfig = {
            fontFamily: 'font1',
            fontSize: '40px',
            color: '#FF8C56',
            align: 'right',
            fixedWidth: 0
        }

        let instructionConfig = {
            fontFamily: 'font1',
            fontSize: '50px',
            color: '#4AD7F8',
            align: 'right',
            fixedWidth: 0
        }

        let worldConfig = {
            fontFamily: 'Courier',
            fontSize: '30px',
            color: '#4AD7F8',
            align: 'right',
            fixedWidth: 0
        }
        
        let secondI = {
            fontFamily: 'font1',
            fontSize: '20px',
            color: '#4AD7F8',
            align: 'right',
            fixedWidth: 0
        }

        // show menu txt
        this.add.text(game.config.width / 2, game.config.height / 4.25, 'FINAL FLIGHT', menuConfig2).setOrigin(0.5);
        this.add.text(game.config.width / 2, game.config.height / 2.35, 'Made by: Arjun Krishnan', creditConfig).setOrigin(0.5);
        this.add.text(game.config.width / 2, game.config.height / 2 + 25, 'use [SPACEBAR] to switch gravity', instructionConfig).setOrigin(0.5);
        var playtext = this.add.text(game.config.width / 2, 30, '[SPACEBAR to start]', secondI).setOrigin(0.5, 0);
        this.add.text(20, game.config.height / 2 + 100, 'Menu Music: SBC Producing on YT', worldConfig).setOrigin(0, 0.5);
        this.add.text(20, game.config.height / 2 + 150, 'Game Music: RoyaltyFreeTube on YT', worldConfig).setOrigin(0, 0.5);
        this.add.text(20, game.config.height / 2 + 200, 'SFX: Arjun Krishnan', worldConfig).setOrigin(0, 0.5);
        this.add.text(20, game.config.height / 2 + 250, 'Assets: Arjun Krishnan', worldConfig).setOrigin(0, 0.5);

        // flashing start indicator
        this.tweens.add({
            targets: playtext,
            duration: 1000,
            alpha: { from: 1, to: 0 },
            yoyo: true,
            loop: -1
        });

        // define keys
        space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        

        // Add rocket
        this.p1Rocket = this.add.sprite(game.config.width / 2 + 200, 4 * this.game.config.height / 5, 'rocket').setOrigin(0.5).setScale(5.5);

        // Create rocket/barrier anims
        this.anims.create({
            key: 'jet',
            frameRate: 5,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('rocket', {
                start: 0,
                end: 3
            })
        });

        this.anims.create({
            key: 'zap',
            frameRate: 24,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('barrier', {
                start: 0,
                end: 2
            })
        });
    }

    // just need to play the animation and check for keyboard input to start the game
    update() {
        this.p1Rocket.play('jet', true);
        let w = this.p1Rocket.x

        if(Phaser.Input.Keyboard.JustDown(space)) {
            this.sound.play('sfx_select');
            this.music.stop();
            this.tweens.add({
                targets: this.p1Rocket,
                duration: 1000,
                x: { from: w, to: 1500 },
                onComplete: () => {
                    this.scene.start('playScene');
                }
            });
        }
    }
}