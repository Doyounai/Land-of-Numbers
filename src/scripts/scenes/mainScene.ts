import { Math } from "phaser";

// Board Config
const GRID_SIZE = 4;
const TILE_SIZE = 70;
const GAP = 5;

export default class MainScene extends Phaser.Scene{
    
    board: any[] = [];
    score = 0;
    bestScore = 0;

    // boardContainer: Phaser.GameObjects.Container | null = null;
    boardContainer: any | null = null;
    scoreText: Phaser.GameObjects.Text | null = null;
    bestScoreText: Phaser.GameObjects.Text | null = null;
    isGameOver = false;

    constructor(){
        super({key: "MainScene"});

    }

    preload = () => {  
        FBInstant.player.getDataAsync(["score"]).then((res) => {
            console.log(res);
            if(res.score != null){
                // console.log("Have Score");
                this.bestScore = res.score;
                if(this.bestScoreText) {
                    this.bestScoreText?.setText(this.bestScore.toString());
                }
            }
        }).catch((error) => {
            console.log("eroorrrrrr");
            console.log(error);
        });

    };

    reset = () => {
        this.score = 0;
        this.isGameOver = false;

        this.timeCountDown = this.timeMax;

        this.canPressKey = true;
        this.scene.start("MainScene");
    };

    create = () => {
        const bg = this.add.sprite(0, 0, "gamebg");
        bg.setOrigin(0, 0);

        bg.setScale(2);

        this.anims.create({
            key: "slimeIdle",
            frames: this.anims.generateFrameNumbers("slime", {}),
            frameRate: 16,
            repeat: -1
        });
        const Slime = this.add.sprite(this.game.canvas.width - 70, 200, "slime");
        Slime.setScale(4);
        Slime.play("slimeIdle");

        // const newWidth = this.game.canvas.width;
        // const newHeight = (this.game.canvas.width - bg.width) + bg.height;

        // bg.setSize(newWidth, newHeight);

        // score ---------------------------------------------
        const scoreContainer = this.add.container(150 / 2 + 10, 50);
        const scoreBg = this.add.rectangle(0, 0, 150, 75, 0xbbada0);

        const scoreHeading = this.add.text(0, -20, "score", {
            font: "bold 24px sans-serif",
            color: "#ffffff"
        });
        scoreHeading.setOrigin(0.5, 0.5);

        this.scoreText = this.add.text(0, 15, "0", {
            font: "bolder 32px sans-serif",
            color: "#ffffff"
        });
        this.scoreText.setOrigin(0.5, 0.5);

        scoreContainer.add([scoreBg, scoreHeading, this.scoreText]);

        // best score ---------------------------------------------
        const bestScoreContainer = this.add.container(this.game.canvas.width - 150 / 2 - 10, 50);
        const bestScoreBg = this.add.rectangle(0, 0, 150, 75, 0xbbada0);

        const bestScoreHeading = this.add.text(0, -20, "bestScore", {
            font: "bold 24px sans-serif",
            color: "#ffffff"
        });
        bestScoreHeading.setOrigin(0.5, 0.5);

        this.bestScoreText = this.add.text(0, 15, this.bestScore.toString(), {
            font: "bolder 32px sans-serif",
            color: "#ffffff"
        });
        this.bestScoreText.setOrigin(0.5, 0.5);

        bestScoreContainer.add([bestScoreBg, bestScoreHeading, this.bestScoreText]);

        // reset button 
        const resetText = this.add.text(0, 10, "Reset", {
            font: "bold 24px sans-serif",
            color: "#ffffff"
        });
        resetText.setOrigin(0.5, 0.5);
        const resetButtonBG = this.add.rectangle(0, 0, 150, 75, 0xbbada0);
        resetButtonBG.setInteractive();
        resetButtonBG.on("pointerdown", this.reset);

        const resetContainer = this.add.container(150 / 2 + 10, 140);
        resetContainer.add([resetButtonBG, resetText]);

        // boar init
        this.initBoard();
        const boardSize = (TILE_SIZE * GRID_SIZE) + GAP * (GRID_SIZE - 1);

        this.boardContainer = this.add.container(this.game.canvas.width / 2, this.game.canvas.height - boardSize / 2);
        const boardBG = this.add.rectangle(0, 0, boardSize, boardSize, 0xbbada0);
        this.boardContainer.add(boardBG);

        for (let i = 0; i < GRID_SIZE; i++){
            for(let j = 0; j < GRID_SIZE; j++){
                const tileBG = this.add.rectangle(
                    j * (TILE_SIZE + GAP) + TILE_SIZE / 2 - (boardSize / 2),
                    i * (TILE_SIZE + GAP) + TILE_SIZE / 2 - (boardSize / 2),
                    TILE_SIZE,
                    TILE_SIZE,
                    0xcdc1b3
                );
                if(this.boardContainer)
                    this.boardContainer.add(tileBG);
            }
        }

        // // start game oparator
        this.createRandom2or4();
        this.updateBoard(); 

        // let canPressKey = true;
        this.input.keyboard.on("keydown", (event) => {
            if(this.isGameOver || ! this.canPressKey){
                return;
            }

            const { keyCode } = event;

            switch (keyCode) {
            case 37:
                // moveLeft
                this.moveLeft();
                break;
            case 38:
                // moveUp
                this.moveUp();
                break; 
            case 39:
                // moveRight
                this.moveRight();
                break;
            case 40:
                // move down
                this.moveDown();
                break;
            }

            if(keyCode >= 37 && keyCode <= 40){
                this.canPressKey = false;

                this.time.addEvent({
                    delay: 100,
                    callback: () => {
                        this.createRandom2or4();
                        this.updateBoard();
                        this.canPressKey = true;

                        if(this.getEmtryTiles().length === 0){
                            this.gameOver();
                            this.canPressKey = false;
                            return;
                        }
                    },
                    callbackScope: this,
                });

            }
        });

        // this.progressBar = new ProgressBar(this, 0, this.game.canvas.height / 2, 150, 35);

        // progress bar
        const progressWidth = this.game.canvas.width - 20;
        const progressHeight = 40;

        const progressContainer = this.add.container(progressWidth / 2 + 10, this.game.canvas.height / 2 - 20);
        const progressBG = this.add.rectangle(0, 0, progressWidth, progressHeight, 0x2b2824);
        this.progressBar = this.add.rectangle(-(progressWidth / 2), -(progressHeight / 2), progressWidth, progressHeight, 0xffbb61);
        this.progressBar.setOrigin(0, 0);

        progressContainer.add([progressBG, this.progressBar]);
        this.updateProgressBar();
    };

    progressBar: Phaser.GameObjects.Rectangle;

    timeMax = 10;
    timeCountDown = 10;

    canPressKey = true;

    updateProgressBar = () => {
        this.progressBar.setScale(this.timeCountDown * (1 / this.timeMax), this.progressBar.scaleY);
    };

    gameOver = () => {
        const boardSize = (TILE_SIZE * GRID_SIZE) + GAP * (GRID_SIZE - 1);

        console.log("game over!!");
        this.isGameOver = true;

        FBInstant.player.setDataAsync({
            score: this.bestScore,
        }).then((res) => {
            console.log(res);
            console.log("set hight scoreeeeee");
        }).catch((error) => {
            console.log("save score erorrrrrrrr");
            console.log(error);
        }); 

        const loseBG = this.add.rectangle(
            // this.game.canvas.width / 2, 
            // this.game.canvas.height - boardSize / 2, 
            0,
            0,
            boardSize, 
            boardSize, 
            0xbbada0
        );
        loseBG.setInteractive();
        loseBG.on("pointerdown", this.reset);

        const loseText = this.add.text(0, 0, "You LOSE!!", {
            font: "bold 28px sans-serif",
            color: "#ffffff"
        });
        loseText.setOrigin(0.5, 0.5);
        const loseText2 = this.add.text(0, 30, "Press HERE to reset.", {
            font: "bold 28px sans-serif",
            color: "#ffffff"
        });
        loseText2.setOrigin(0.5, 0.5);

        const loseContainer = this.add.container(this.game.canvas.width / 2, this.game.canvas.height - boardSize / 2);
        loseContainer.add([loseBG, loseText, loseText2]);
    };

    //#region move function
    moveLeft = () => {
        for (let i = 0; i < GRID_SIZE; i++){
            for(let j = 0; j < GRID_SIZE; j++){
                if(this.board[i][j] !== 0){
                    let currentplace = j;

                    for(let k = j - 1; k >= 0; k--){
                        if(currentplace - 1 !== k){
                            break;
                        }

                        if(this.board[i][k] === 0){
                            this.board[i][k] = this.board[i][currentplace];
                            this.board[i][currentplace] = 0;

                            const tile = this.boardContainer?.getByName("tile-" + i + "-" + currentplace);
                            tile?.setName("tile-" + i + "-" + k);

                            this.tweens.add({
                                targets: tile,
                                x: k * (TILE_SIZE + GAP) + TILE_SIZE / 2 - (TILE_SIZE * GRID_SIZE / 2 + GAP * 1.5),
                                duration: 50,
                                ease: "Cubic.easeOut"
                            });

                            currentplace = k;

                        }else if(this.board[i][k] === this.board[i][currentplace]){
                            this.board[i][k] *= 2;
                            this.board[i][currentplace] = 0;

                            const tile = this.boardContainer?.getByName("tile-" + i + "-" + currentplace);
                            const tile2 = this.boardContainer?.getByName("tile-" + i + "-" + k);
                            tile2?.destroy();
                            this.boardContainer?.remove(tile2);
                            tile?.setName("tile-" + i + "-" + k);

                            this.tweens.add({
                                targets: tile,
                                x: k * (TILE_SIZE + GAP) + TILE_SIZE / 2 - (TILE_SIZE * GRID_SIZE / 2 + GAP * 1.5),
                                duration: 50,
                                ease: "Cubic.easeOut",
                                onComplete: () => {
                                    if(!tile || (tile && !tile.active)){
                                        return;
                                    }

                                    tile.getAt(0).setFillStyle(this.getBackgroundColor(this.board[i][k]));
                                    tile.getAt(1).setText(this.board[i][k]);
                                    tile.getAt(1).setColor(this.getTextColor(this.board[i][k]));
                                }
                            });

                            break;
                        }
                    }
                }
            } 
        }
    };

    moveRight = () => {
        for (let i = 0; i < GRID_SIZE; i++){
            for(let j = GRID_SIZE - 2; j >= 0; j--){
                if(this.board[i][j] !== 0){
                    let currentplace = j;

                    for(let k = j + 1; k < GRID_SIZE; k++){
                        if(currentplace + 1 !== k){
                            break;
                        }

                        if(this.board[i][k] === 0){
                            this.board[i][k] = this.board[i][currentplace];
                            this.board[i][currentplace] = 0;

                            const tile = this.boardContainer?.getByName("tile-" + i + "-" + currentplace);
                            tile?.setName("tile-" + i + "-" + k);

                            this.tweens.add({
                                targets: tile,
                                x: k * (TILE_SIZE + GAP) + TILE_SIZE / 2 - (TILE_SIZE * GRID_SIZE / 2 + GAP * 1.5),
                                duration: 50,
                                ease: "Cubic.easeOut"
                            });

                            currentplace = k;

                        }else if(this.board[i][k] === this.board[i][currentplace]){
                            this.board[i][k] *= 2;
                            this.board[i][currentplace] = 0;

                            const tile = this.boardContainer?.getByName("tile-" + i + "-" + currentplace);
                            const tile2 = this.boardContainer?.getByName("tile-" + i + "-" + k);
                            tile2?.destroy();
                            this.boardContainer?.remove(tile2);
                            tile?.setName("tile-" + i + "-" + k);

                            this.tweens.add({
                                targets: tile,
                                x: k * (TILE_SIZE + GAP) + TILE_SIZE / 2 - (TILE_SIZE * GRID_SIZE / 2 + GAP * 1.5),
                                duration: 50,
                                ease: "Cubic.easeOut",
                                onComplete: () => {
                                    if(!tile || (tile && !tile.active)){
                                        return;
                                    }

                                    tile.getAt(0).setFillStyle(this.getBackgroundColor(this.board[i][k]));
                                    tile.getAt(1).setText(this.board[i][k]);
                                    tile.getAt(1).setColor(this.getTextColor(this.board[i][k]));
                                }
                            });

                            break;
                        }
                    }
                }
            } 
        }
    };

    moveUp = () => {
        for (let j = 0; j < GRID_SIZE; j++){
            for(let i = 1; i < GRID_SIZE; i++){
                if(this.board[i][j] !== 0){
                    let currentplace = i;

                    for(let k = i - 1; k >= 0; k--){
                        if(currentplace - 1 !== k){
                            break;
                        }

                        if(this.board[k][j] === 0){
                            this.board[k][j] = this.board[currentplace][j];
                            this.board[currentplace][j] = 0;

                            const tile = this.boardContainer?.getByName("tile-" + currentplace + "-" + j);
                            tile?.setName("tile-" + k + "-" + j);

                            this.tweens.add({
                                targets: tile,
                                y: k * (TILE_SIZE + GAP) + TILE_SIZE / 2 - (TILE_SIZE * GRID_SIZE / 2 + GAP * 1.5),
                                duration: 50,
                                ease: "Cubic.easeOut"
                            });

                            currentplace = k;

                        }else if(this.board[k][j] === this.board[currentplace][j]){
                            this.board[k][j] *= 2;
                            this.board[currentplace][j] = 0;

                            const tile = this.boardContainer?.getByName("tile-" + currentplace + "-" + j);
                            const tile2 = this.boardContainer?.getByName("tile-" + k + "-" + j);
                            tile2?.destroy();
                            this.boardContainer?.remove(tile2);
                            tile?.setName("tile-" + k + "-" + j);

                            this.tweens.add({
                                targets: tile,
                                y: k * (TILE_SIZE + GAP) + TILE_SIZE / 2 - (TILE_SIZE * GRID_SIZE / 2 + GAP * 1.5),
                                duration: 50,
                                ease: "Cubic.easeOut",
                                onComplete: () => {
                                    if(!tile || (tile && !tile.active)){
                                        return;
                                    }

                                    tile.getAt(0).setFillStyle(this.getBackgroundColor(this.board[k][j]));
                                    tile.getAt(1).setText(this.board[k][j]);
                                    tile.getAt(1).setColor(this.getTextColor(this.board[k][j]));
                                }
                            });

                            break;
                        }
                    }
                }
            } 
        }
    };

    moveDown = () => {
        for (let j = 0; j < GRID_SIZE; j++){
            for(let i = GRID_SIZE - 2; i >= 0; i--){
                if(this.board[i][j] !== 0){
                    let currentplace = i;

                    for(let k = i + 1; k < GRID_SIZE; k++){
                        if(currentplace + 1 !== k){
                            break;
                        }

                        if(this.board[k][j] === 0){
                            this.board[k][j] = this.board[currentplace][j];
                            this.board[currentplace][j] = 0;

                            const tile = this.boardContainer?.getByName("tile-" + currentplace + "-" + j);
                            tile?.setName("tile-" + k + "-" + j);

                            this.tweens.add({
                                targets: tile,
                                y: k * (TILE_SIZE + GAP) + TILE_SIZE / 2 - (TILE_SIZE * GRID_SIZE / 2 + GAP * 1.5),
                                duration: 50,
                                ease: "Cubic.easeOut"
                            });

                            currentplace = k;

                        }else if(this.board[k][j] === this.board[currentplace][j]){
                            this.board[k][j] *= 2;
                            this.board[currentplace][j] = 0;

                            const tile = this.boardContainer?.getByName("tile-" + currentplace + "-" + j);
                            const tile2 = this.boardContainer?.getByName("tile-" + k + "-" + j);
                            tile2?.destroy();
                            this.boardContainer?.remove(tile2);
                            tile?.setName("tile-" + k + "-" + j);

                            this.tweens.add({
                                targets: tile,
                                y: k * (TILE_SIZE + GAP) + TILE_SIZE / 2 - (TILE_SIZE * GRID_SIZE / 2 + GAP * 1.5),
                                duration: 50,
                                ease: "Cubic.easeOut",
                                onComplete: () => {
                                    if(!tile || (tile && !tile.active)){
                                        return;
                                    }

                                    tile.getAt(0).setFillStyle(this.getBackgroundColor(this.board[k][j]));
                                    tile.getAt(1).setText(this.board[k][j]);
                                    tile.getAt(1).setColor(this.getTextColor(this.board[k][j]));
                                }
                            });

                            break;
                        }
                    }
                }
            } 
        }
    };
    //#endregion

    getBackgroundColor = (value: number) => {
        switch (value){
        case 2:
            return 0xeee4da;
        case 4:
            return 0xede0c8;
        case 8:
            return 0xf2b179;
        case 16:
            return 0xf59563;
        case 32:
            return 0xf67c5f;
        case 64:
            return 0xf65e3b;
        case 128:
            return 0xedcf72;
        case 256:
            return 0xedcc61;
        case 512:
            return 0xedc850;
        case 2048:
            return 0xedc22e;
        default:
            return 0xff0000;
        }
    };

    getTextColor = (value: number) => {
        if(value <= 4){
            return "#776e65";
        }

        return "#f9f6f2";
    };

    createTile = (i: number, j: number) => {
        const tileContainer = this.add.container(
            j * (TILE_SIZE + GAP) + TILE_SIZE / 2 - (TILE_SIZE * GRID_SIZE / 2 + GAP * 1.5),
            i * (TILE_SIZE + GAP) + TILE_SIZE / 2 - (TILE_SIZE * GRID_SIZE / 2 + GAP * 1.5),
        );

        const tileBg = this.add.rectangle(0, 0, TILE_SIZE, TILE_SIZE, this.getBackgroundColor(this.board[i][j]));
        const tileText = this.add.text(0, 0, this.board[i][j], {
            font: "bold 32px sans-serif",
            color: this.getTextColor(this.board[i][j]),
        });
        tileText.setOrigin(0.5, 0.5);
        tileContainer.add([tileBg, tileText]);
        tileContainer.setName("tile-" + i + "-" + j);
        this.boardContainer?.add(tileContainer);

        return tileContainer;
    };

    updateBoard = () => {
        for(let i = 0; i < GRID_SIZE; i++){
            for(let j = 0; j < GRID_SIZE; j++){
                if(this.board[i][j] !== 0){
                    const tile = this.boardContainer?.getByName("tile-" + i + "-" + j);
                    if(!tile){
                        const tileContainer = this.createTile(i, j);
                        tileContainer.setScale(0.5);

                        this.tweens.add({
                            targets: tileContainer,
                            scale: 1,
                            duration: 100,
                            ease: "Cubic.easeOut"
                        });
                    }
                }
            }
        }

        this.timeCountDown = Math.Clamp(this.timeCountDown + 0.25, 0, this.timeMax);

        this.updateScore();
    };

    updateScore = () => {
        let score = 0;

        for(let i = 0; i < GRID_SIZE; i++){
            for(let j = 0; j < GRID_SIZE; j++){
                score += this.board[i][j];
            }
        }
        this.score = score;

        if(this.score > this.bestScore){
            this.bestScore = this.score;

            // FBInstant.player.setDataAsync({
            //     score: this.bestScore,
            // }).then((res) => {
            //     console.log(res);
            // }).catch((error) => {
            //     console.log(error);
            // }); 
        }

        this.scoreText?.setText(this.score.toString());
        this.bestScoreText?.setText(this.bestScore.toString());
    };

    getEmtryTiles = (): {x: number, y: number}[] => {
        const emtryTiles: {x: number, y: number}[] = [];

        for(let i = 0; i < GRID_SIZE; i++){
            for(let j = 0; j < GRID_SIZE; j++){
                if(this.board[i][j] === 0){
                    emtryTiles.push({
                        x: i,
                        y: j
                    });
                }
            }
        }

        return emtryTiles;
    };

    createRandom2or4 = () => {
        if(this.getEmtryTiles().length === 0){
            // console.log("game over!!");
            this.isGameOver = true;
            return;
        }

        const chosenTile = Phaser.Utils.Array.GetRandom(this.getEmtryTiles());
        this.board[chosenTile.x][chosenTile.y] = Phaser.Math.Between(1, 2) * 2;
    };

    initBoard = () => {
        for(let i = 0; i < GRID_SIZE; i++){
            this.board[i] = [];
            for(let j = 0; j < GRID_SIZE; j++){
                this.board[i][j] = 0;
            }
        }
    };

    update(time: number, delta: number): void {
        if(!this.isGameOver){
            // console.log(delta);
            this.timeCountDown -= delta / 1000;
            this.updateProgressBar();

            if(this.timeCountDown <= 0){
                this.gameOver();
            }
        }
    }
}