export default class Roccket extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y){
        super(scene, x, y, "rocket");
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setInteractive().on("pointerdown", () => {
            this.alpha = 0.5;
        });

        this.setGravityY(0.1);
    }
}