import { User } from "./user";
import { KeyDown } from "../services/key-status";
import { ASSETS, PowerUpType } from "../services/enum-manager";
import { Utils } from "../services/utilty.service";

export class Powerup extends User {

    type: PowerUpType;
    active: Boolean;
    showText: Boolean = false;
    showType: PowerUpType;

    constructor() {
        super('aaa', 50, 41, 0, 200);
        this.active = false;
        this.getRandomPowerup(new Utils());
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

    getRandomPowerup(utils: Utils) {
        let powerUp = utils.getRandomItemFromList(this.getPowerupList());
        this.sprite.src = powerUp.sprite;
        this.type = powerUp.type;
        // testing shield
        // this.sprite.src = ASSETS.PREPEND + "drone-images/powerup-shield.png";
        // this.type = PowerUpType.Shield;
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

    getPowerupList():PowerupModel[]{
        return [
            {
                type:PowerUpType.explosionVelocity,
                sprite: ASSETS.PREPEND + "drone-images/powerup-explosionVelocity.png"
            },
            {
                type:PowerUpType.Health,
                sprite: ASSETS.PREPEND + "drone-images/powerup-health.png"
            }, 
            {
                type:PowerUpType.RoF,
                sprite: ASSETS.PREPEND + "drone-images/powerup-rOf.png"
            },
            {
                type:PowerUpType.Shield,
                sprite: ASSETS.PREPEND + "drone-images/powerup-shield.png"
            },
            {
                type:PowerUpType.Spray,
                sprite: "drone-images/powerup-spray.png"
            }
        ]
    }
}

export interface PowerupModel {
    type:PowerUpType,
    sprite:string
}
