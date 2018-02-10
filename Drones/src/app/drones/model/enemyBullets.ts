import { Projectile } from "./projectile";
import { KeyDown } from "../services/key-status";

export class EnemyBullet extends Projectile {

    bulletCycle = Math.random() * 128;

    constructor(speed: number, x: number, y: number){
        super();
        this.X = x;
        this.Y = y;
        this.Speed = speed;
        this.sprite.src = "/assets/drone-images/bossBullet1.png";
    }

    powerUpCycle() {
        this.Y += 3 * Math.sin(this.bulletCycle * Math.PI / 128);
        this.bulletCycle++;
    }
}