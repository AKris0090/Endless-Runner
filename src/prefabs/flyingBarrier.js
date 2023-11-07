class doubleBarrier extends Phaser.Physics.Arcade.Sprite {
    // modified code from Professor Altice's github
    constructor(scene, velocity) {
        // call super constructor, random location within the confines of the game height
        super(scene, game.config.width + 48, Phaser.Math.Between(0, game.config.height), 'barrier'); 
        
        // set parent scene
        this.parentScene = scene;

        this.parentScene.add.existing(this);
        this.parentScene.physics.add.existing(this);

        // bug fix
        this.body.setFriction(0);

        // set velocity for movement
        this.setVelocityX(velocity);
        this.setImmovable();                    
        this.newBarrier = true;
        
        // play animation
        this.play('zap', true);
    }

    update() {
        // call again to spawn next
        if(this.newBarrier && this.x < middle) {
            this.parentScene.addFlyingBarrier();
            this.newBarrier = false;
        }

        // destroy at end of screen
        if(this.x < -this.width) {
            this.destroy();
        }
    }
}