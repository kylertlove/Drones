import { Projectile } from "./projectile";
import { KeyDown } from "../services/key-status";

export class Enemy extends Projectile {

    age: number;
    hasBeenShot: Boolean;

    constructor(speed: number, x: number, y: number){
        super();
        this.X = x;
        this.Y = y;
        this.Speed = speed;
        this.Width = 50;
        this.Height = 30;
        this.age = Math.floor(Math.random() * 128);
        this.hasBeenShot = false;
        this.sprite.src = "/assets/drone-images/alienship1.png";
    }

    //override projectile
    update(canvas: CanvasRenderingContext2D, keyHandler: KeyDown, dT: number) {
        if(!this.inBounds(canvas)){
            this.active = false;
        }else{
            this.X -= (this.Speed * dT);
            this.Y += 3 * Math.sin(this.age * Math.PI / 128);
            this.age++;
        }
    }

    explode() {
        this.hasBeenShot = true;
        this.sprite.src = "/assets/drone-images/explode2.png";
        setTimeout(() => {         
            this.active = false;
        }, 250);
    };
}
