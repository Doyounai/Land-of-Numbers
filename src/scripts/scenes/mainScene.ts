import Rocket from "../objects/rocket";

export default class MainScene extends Phaser.Scene{
    rocket: Rocket;

    constructor(){
        super({key: "MainScene"});
    }

    create(){
        this.rocket =  new Rocket(this,
            this.cameras.main.width / 2,
            this.cameras.main.height / 2
        );
    }

    test = () => {
        console.log("test");

        const x = 2;
        if(x > 1)
        {
            console.log();
        }
    };

    update(time: number, delta: number): void {
        if(this.rocket.body)
        {
            this.rocket.body.velocity.x += 1;
            this.rocket.body.velocity.y -= 1;
        }
    }
}