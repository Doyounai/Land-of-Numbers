import "phaser";

import PreloadScene from "./scenes/preloadScene";
import MainScene from "./scenes/mainScene";


// aspect ratio fit width
const getSize = () => {
    const preferredWidth = 640;
    const preferredHeight = 960;

    const gameContainer = document.getElementById("game-container");

    if(!gameContainer){
        return {width: preferredWidth, height: preferredHeight};
    }

    let width = gameContainer.clientWidth;
    const height = gameContainer.clientHeight;

    const aspect = preferredWidth / preferredHeight;

    const newWidth = height / aspect;
    const newHeight = height;

    width = newWidth > width ? width : newWidth;

    return {width: width, height: newHeight};
};

const config = { 
    type: Phaser.AUTO,
    backgroundColor: "#78A083",
    scale: {
        parent: "phaser-game",
        mode: Phaser.Scale.CENTER_BOTH,
        width: getSize().width,
        height: getSize().height
    },
    scene: [ PreloadScene, MainScene ],
    physics: {
        default: "arcade",
        arcade: {
            debug: true,
            gravity: {y: 10}
        }
    }
};

let game: Phaser.Game | null = null;

FBInstant.initializeAsync().then(function() {
    FBInstant.setLoadingProgress(100);
    
    if(!game){
        game = new Phaser.Game(config);

    }
}).catch(function(error) {
    console.log(error.message);
});

// game = new Phaser.Game(config);