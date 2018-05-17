import { User } from "./user.drones";
import { KeyDown } from "../services/key-status";
import { ASSETS } from "../services/asset-manager";

export class Missile extends User {

    activeMissile: Boolean = false;
    missileVelocity: number = 450;
    defaultExplosionVelocity: number = 100;
    explodingMissile: Boolean = false;
    needMissile: Boolean;
    defaultSprite = ASSETS.PREPEND + "drone-images/missile1.png";
    powerupSprite = ASSETS.PREPEND + "drone-images/missile1-powerup.png";
    explosionVelocity: number;

    constructor(hasExplosionVelocity: Boolean){
        super('fff', 60, 30, 0, 0);
        this.needMissile = false;
        this.sprite.src = hasExplosionVelocity ? this.powerupSprite : this.defaultSprite
        this.explosionVelocity = hasExplosionVelocity ? 400 : this.defaultExplosionVelocity;
    }

    update(canvas: CanvasRenderingContext2D, keyHandler: KeyDown, dT: number) {
        if (this.inBounds(canvas)) {
            this.X += this.missileVelocity * dT;
        } else {
            this.activeMissile = false
        }
    }

    inBounds(canvas: CanvasRenderingContext2D){
        return this.X >= 0 && this.X <= canvas.canvas.width &&
        this.Y >= 0 && this.Y <= canvas.canvas.height;
    }

    destroy(canvas: CanvasRenderingContext2D) {
        this.activeMissile = false;
        this.explodingMissile = true;
        this.Width = 200;
        this.Height = 200;
        this.sprite.src = ASSETS.PREPEND + "drone-images/explode3.png";
        setTimeout(() => {         
            this.explodingMissile = false;
            this.needMissile = true;
            this.sprite.src = this.defaultSprite;
        }, 200);
    }
}