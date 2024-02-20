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
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {y: 10}
        }
    }
};

let game: Phaser.Game | null = null;

// window.addEventListener('load', () => {    
    FBInstant.initializeAsync().then(function() {
        // FBInstant.setLoadingProgress(100);

        var config = {
            type: Phaser.AUTO,
            width: window.innerWidth,
            height: window.innerHeight
        };
    
        if(!game){
            game = new Phaser.Game(config);

            // add scene
            game.scene.add('PreloadScene', PreloadScene);
            game.scene.add('MainScene', MainScene);
            
            // start scene
            game.scene.start('PreloadScene');

        }
    }).catch(function(error) {
        console.log(error.message);
      });
// });