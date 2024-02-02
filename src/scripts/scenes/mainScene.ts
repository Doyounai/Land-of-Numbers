import Rocket from '../objects/rocket';

export default class MainScene extends Phaser.Scene{
    rocket: Rocket;

    constructor(){
        super({key: 'MainScene'});
    }

    create(){
        this.rocket =  new Rocket(this,
            this.cameras.main.width / 2,
            this.cameras.main.height / 2
            );
    }

    update(time: number, delta: number): void {
        this.rocket.body.velocity.x += 1;
        this.rocket.body.velocity.y -= 1;
    }
}