import { User } from "./user.drones";
import { KeyDown } from "../services/key-status";
import { ASSETS } from "../services/asset-manager";

export class Powerup extends User {

    type: PowerUpType;
    active: Boolean;
    showText: Boolean = false;
    showType: PowerUpType;
    
    constructor(){
        super('aaa', 50, 41, 0, 200);
        this.active = false;
        this.getNewType();
    }

    update(canvas: CanvasRenderingContext2D, keyHandler: KeyDown, dT: number) {
        if(this.inBounds(canvas)){
            this.X -= 200 * dT;
        }else{
            this.active = false;
            this.X = canvas.canvas.width;
        }
    }

    inBounds(canvas: CanvasRenderingContext2D){
        return this.X >= 0 && this.X <= canvas.canvas.width &&
        this.Y >= 0 && this.Y <= canvas.canvas.height;
    }

    getNewType(){
        let rand = Math.random() * 10;
        if(rand >= 0 && rand < 3){
            this.sprite.src = ASSETS.PREPEND + "drone-images/powerup-spray.png";
            this.type = PowerUpType.Spray;
        }else if(rand >= 3 && rand < 5){
            this.sprite.src = ASSETS.PREPEND + "drone-images/powerup-health.png";
            this.type = PowerUpType.Health;
        }else if(rand >= 5 && rand < 7){
            this.sprite.src = ASSETS.PREPEND + "drone-images/powerup-explosionVelocity.png";
            this.type = PowerUpType.explosionVelocity;
        }else if(rand >= 7){
            this.sprite.src = ASSETS.PREPEND + "drone-images/powerup-rOf.png";
            this.type = PowerUpType.RoF;
        }
    }

    getFlashText() {
        if (this.showType === PowerUpType.Spray) {
            return "Main Weapon Upgrade!";
        } else if (this.showType === PowerUpType.Health) {
            return "+10 Health!";
        } else if (this.showType === PowerUpType.explosionVelocity) {
            return "Increase Missile Damage";
        } else if(this.showType === PowerUpType.RoF){
            return "Rate of Fire Increase";
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
    Spray, Health, explosionVelocity, RoF
}