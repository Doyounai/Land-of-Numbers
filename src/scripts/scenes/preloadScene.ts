import "phaser/src/phaser.js";

export default class PreloadScene extends Phaser.Scene{
    constructor(){
        super({key: "PreloadScene"});

    }

    preload(){
        this.facebook.once("startgame", this.startGame, this);
        this.facebook.showLoadProgress(this);

        this.load.image("rocket", "assets/img/rocket.png");
        this.load.image("tile", "assets/tile.png");

        this.load.on("progress", (val) => {
            FBInstant.setLoadingProgress(val * 100);
        });
    }

    startGame(){
        this.scene.start("MainScene");

        console.log("Pre load successful");
    }
}