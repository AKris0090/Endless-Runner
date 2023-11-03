class Manager extends Phaser.Scene {
    constructor() {
        super('managerScene')
    }
 
    preload() {
        this.scene.run('movementScene');
    }

    create() {

        this.input.on('pointerdown', function (pointer)
        {
            if(pointer.leftButtonDown() && (scene1flipflop)) {
                this.scene.sleep('movementScene').run('partyScene');
                scene1flipflop = false;
            }
            if(pointer.rightButtonDown() && !(scene1flipflop)) {
                this.scene.sleep('partyScene').run('movementScene');
                scene1flipflop = true;
            }
        }, this);
    }

    update() {
    }
}