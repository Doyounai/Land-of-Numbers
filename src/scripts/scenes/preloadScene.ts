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

        this.load.image("gamebg", "assets/gameBG.png");

        this.load.on("progress", (val) => {
            FBInstant.setLoadingProgress(val * 100);
        });
    }

    startButtonContainer: Phaser.GameObjects.Container;

    startGame(){
        // this.scene.start("MainScene");

        // console.log("Pre load successful");
        const centerWidth = this.game.canvas.width / 2;
        const centerHeight = this.game.canvas.height / 2;

        const startButton = this.add.text(0, 0, "Start", {
            font: "bolder 32px sans-serif",
            color: "#ffffff"
        });
        startButton.setInteractive();
        startButton.setOrigin(0.5, 0.5);

        const startBg = this.add.rectangle(0, 0, 200, 75, 0x50727B);

        this.startButtonContainer = this.add.container(centerWidth, centerHeight - 100);
        this.startButtonContainer.add([startBg, startButton]);
        startBg.setInteractive();

        startBg.on("pointerdown", () => {
            console.log("sstartButtonClick");
            this.scene.start("MainScene");
        });

    }
}