import "phaser";

import PreloadScene from "./scenes/preloadScene";
import MainScene from "./scenes/mainScene";


// aspect ratio fit width
const getSize = () => {
    const preferredWidth = 640;
    const preferredHeight = 960;

    const width = window.innerWidth;
    let height = window.innerHeight;

    const aspect = preferredWidth / preferredHeight;

    const newWidth = width;
    const newHeight = width / aspect;

    height = height < newHeight ? height : newHeight;
    return {width: newWidth, height: height};
};

const config = {
    type: Phaser.AUTO,
    backgroundColor: "#FFFFF0",
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