import "phaser/src/phaser.js";

export default class PreloadScene extends Phaser.Scene{
    constructor(){
        super({key: 'PreloadScene'});

    }

    preload(){
        // console.log(FBInstant.player.getName());
        // console.log(FBInstant);

        // console.log(this.facebook.playerName);

        this.facebook.once('startgame', this.create, this);
        this.facebook.showLoadProgress(this);

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