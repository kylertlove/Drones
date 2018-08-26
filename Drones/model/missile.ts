import { User } from "./user";
import { KeyDown } from "../services/key-status";
import { ASSETS } from "../services/enum-manager";

export class Missile extends User {

    activeMissile: Boolean = false;
    missileVelocity: number = 450;
    defaultExplosionVelocity: number = 100;
    explodingMissile: Boolean = false;
    needMissile: Boolean;
    defaultSprite = ASSETS.PREPEND + "drone-images/missile-weak.png";
    powerupSprite = ASSETS.PREPEND + "drone-images/missile-powerup.png";
    explodingSprite = ASSETS.PREPEND + "drone-images/explode-red.png";
    explosionVelocity: number;

    constructor(hasExplosionVelocity: Boolean){
        super('fff', 60, 30, 0, 0);
        this.needMissile = false;
        this.sprite.src = hasExplosionVelocity ? this.powerupSprite : this.defaultSprite
        this.explosionVelocity = hasExplosionVelocity ? this.defaultExplosionVelocity * 5 : this.defaultExplosionVelocity;
    }

    update(canvas: CanvasRenderingContext2D, keyHandler: KeyDown, dT: number) {
        if (this.inBounds(canvas)) {
            this.X += this.missileVelocity * dT;
        } else {
            this.activeMissile = false;
        }
    }

    inBounds(canvas: CanvasRenderingContext2D){
        return this.X >= -20 && this.X <= canvas.canvas.width + 20 &&
        this.Y >= -20 && this.Y <= canvas.canvas.height + 20;
    }

    destroy(canvas: CanvasRenderingContext2D) {
        this.activeMissile = false;
        this.explodingMissile = true;
        this.Width = 200;
        this.Height = 200;
        this.sprite.src = this.explodingSprite;
        setTimeout(() => {         
            this.explodingMissile = false;
            this.needMissile = true;
            this.sprite.src = this.defaultSprite;
        }, 200);
    }
}