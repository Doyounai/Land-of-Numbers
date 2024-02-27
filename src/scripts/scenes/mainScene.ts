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

    create = () => {
        // score ---------------------------------------------
        const scoreContainer = this.add.container(100, 50);
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
        const bestScoreContainer = this.add.container(280, 50);
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

        // boar init
        this.initBoard();
        const boardSize = (TILE_SIZE * GRID_SIZE) + GAP * (GRID_SIZE - 1);

        this.boardContainer = this.add.container(this.game.canvas.width / 2, 400);
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

        // start game oparator
        this.createRandom2or4();
        this.updateBoard(); 

        let canPressKey = true;
        this.input.keyboard.on("keydown", (event) => {
            if(this.isGameOver || ! canPressKey){
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
                canPressKey = false;

                this.time.addEvent({
                    delay: 100,
                    callback: () => {
                        this.createRandom2or4();
                        this.updateBoard();
                        canPressKey = true;
                    },
                    callbackScope: this,
                });

            }
        });
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

        this.updateScore();

        console.log(this.board);
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
        }

        this.scoreText?.setText(this.score.toString());
        this.bestScoreText?.setText(this.bestScore.toString());
    };

    createRandom2or4 = () => {
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

        if(emtryTiles.length === 0){
            console.log("game over!!");
            this.isGameOver = true;
            return;
        }

        const chosenTile = Phaser.Utils.Array.GetRandom(emtryTiles);
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
}