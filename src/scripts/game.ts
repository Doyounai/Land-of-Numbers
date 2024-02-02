import 'phaser';
import PreloadScene from './scenes/preloadScene';
import MainScene from './scenes/mainScene';

const DEFAULT_WIDTH = 1280;
const DEFAULT_HEIGHT = 720;

var config = {
    type: Phaser.AUTO,
    backgroundColor: "#FFFFF0",
    scale: {
        parent: 'phaser-game',
        mode: Phaser.Scale.CENTER_BOTH,
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT
    },
    scene: [PreloadScene, MainScene],
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {y: 10}
        }
    }
};

window.addEventListener('load', () => {
    // FBInstant.initializeAsync().then(function() {

    //     var config = {
    //         type: Phaser.AUTO,
    //         width: window.innerWidth,
    //         height: window.innerHeight
    //     };
    
    // });
    const game = new Phaser.Game(config);
});