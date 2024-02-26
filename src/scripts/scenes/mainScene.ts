// Board Config
const GRID_SIZE = 4;
const TILE_SIZE = 70;
const GAP = 5;

export default class MainScene extends Phaser.Scene{
    
    board: any[] = [];
    score = 0;
    bestScore = 2048;

    boardContainer: Phaser.GameObjects.Container | null = null;
    scoreText: Phaser.GameObjects.Text | null = null;
    bestScoreText: Phaser.GameObjects.Text | null = null;

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
    };

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
        tileContainer.setName("tile-${i}-${j}");
        this.boardContainer?.add(tileContainer);
    };

    updateBoard = () => {
        for(let i = 0; i < GRID_SIZE; i++){
            for(let j = 0; j < GRID_SIZE; j++){
                if(this.board[i][j] !== 0){
                    const tile = this.boardContainer?.getByName("tile-${t}-${j}");
                    if(!tile){
                        this.createTile(i, j);
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