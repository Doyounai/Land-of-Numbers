export default class ProgressBar extends Phaser.GameObjects.Container{
    width = 0;
    height = 0;

    progressBar: Phaser.GameObjects.Rectangle;

    scene: any;

    constructor(scene, x, y, width, height){
        super(scene, x, y);

        this.scene = scene;

        this.width = width;
        this.height = height;

    }
    
    create(){
        const progresseBG = this.scene.add.rectangle(0, 0, this.width, this.height, 0xbbada0);
        this.progressBar = this.scene.add.rectangle(0, 0, this.width, this.height, 0xbbada0);

        this.add([progresseBG, this.progressBar]);
    }
    // addObjects = (obj) => {
    //     this.add(obj);
    // };
}