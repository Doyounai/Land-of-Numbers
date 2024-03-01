export default class ProgressBar extends Phaser.GameObjects.GameObject{
    width = 0;
    height = 0;

    progressBar: Phaser.GameObjects.Rectangle;

    scene: any;

    progresseContainer: Phaser.GameObjects.Container;

    constructor(scene, x, y, width, height){
        super(x, y);

        this.scene = scene;

        this.width = width;
        this.height = height;
    }
    
    create(){
        this.progresseContainer = this.scene.add.container(0, this.scene.game.canvas.height / 2);

        const progresseBG = this.scene.add.rectangle(0, 0, this.width, this.height, 0xbbada0);
        this.progressBar = this.scene.add.rectangle(0, 0, this.width, this.height, 0xbbada0);

        this.progresseContainer.add([progresseBG, this.progressBar]);
    }
}