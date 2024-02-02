export default class PreloadScene extends Phaser.Scene{
    constructor(){
        super({key: 'PreloadScene'});
    }

    preload(){
        // this.facebook.once('startgame', this.startGame, this);
        // this.facebook.showLoadProgress(this);

        this.load.image('rocket', 'assets/img/rocket.png');
        console.log('Pre load successful');
    }

    create(){
        this.scene.start('MainScene');
    }
}