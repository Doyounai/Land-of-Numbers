export default class PreloadScene extends Phaser.Scene{
    constructor(){
        super({key: 'PreloadScene'});
    }

    preload(){
        console.log(FBInstant.player.getName());

        // FBInstant.once('startgame', this.create, this);
        // FBInstant.showLoadProgress(this);

        this.load.image('rocket', 'assets/img/rocket.png');

        this.load.on('progress', (val) => {
            FBInstant.setLoadingProgress(val * 100);
        });
    }

    create(){
        this.scene.start('MainScene');

        console.log('Pre load successful');
    }
}