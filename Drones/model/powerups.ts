import { User } from "./user";
import { KeyDown } from "../services/key-status";
import { ASSETS } from "../services/asset-manager";

export class Powerup extends User {

    type: PowerUpType;
    active: Boolean;
    showText: Boolean = false;
    showType: PowerUpType;

    constructor() {
        super('aaa', 50, 41, 0, 200);
        this.active = false;
        this.getNewType();
    }

    update(canvas: CanvasRenderingContext2D, keyHandler: KeyDown, dT: number) {
        if (this.inBounds(canvas)) {
            this.X -= 200 * dT;
        } else {
            this.active = false;
            this.X = canvas.canvas.width;
        }
    }

    inBounds(canvas: CanvasRenderingContext2D) {
        return this.X >= 0 && this.X <= canvas.canvas.width &&
            this.Y >= 0 && this.Y <= canvas.canvas.height;
    }

    getNewType() {
        let rand = Math.random() * 100;
        if (rand >= 0 && rand < 20) {
            this.sprite.src = ASSETS.PREPEND + "drone-images/powerup-spray.png";
            this.type = PowerUpType.Spray;
        } else if (rand >= 20 && rand < 40) {
            this.sprite.src = ASSETS.PREPEND + "drone-images/powerup-health.png";
            this.type = PowerUpType.Health;
        } else if (rand >= 40 && rand < 60) {
            this.sprite.src = ASSETS.PREPEND + "drone-images/powerup-explosionVelocity.png";
            this.type = PowerUpType.explosionVelocity;
        } else if (rand >= 60 && rand < 80) {
            this.sprite.src = ASSETS.PREPEND + "drone-images/powerup-shield.png";
            this.type = PowerUpType.Shield;
        } 
        else if (rand >= 80) {
            this.sprite.src = ASSETS.PREPEND + "drone-images/powerup-rOf.png";
            this.type = PowerUpType.RoF;
        }
    }

    getFlashText() {
        switch (this.showType) {
            case PowerUpType.Spray:
                return "Main Weapon Upgrade!";
            case PowerUpType.Health:
                return "+10 Health!";
            case PowerUpType.explosionVelocity:
                return "Increase Missile Damage";
            case PowerUpType.RoF:
                return "Rate of Fire Increase";
            case PowerUpType.Shield:
                return "Shields!";
            default:
                return "";
        }
    }

    flashInfo(type: PowerUpType) {
        this.showType = type;
        this.showText = true;
        setTimeout(() => {
            this.showText = false;
        }, 2000);
    }
}

export enum PowerUpType {
    Spray, Health, explosionVelocity, RoF, Shield
}