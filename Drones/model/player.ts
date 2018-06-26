import { User } from './user';
import { KeyDown } from '../services/key-status';
import { PlayerBullets } from "./playerBullets";
import { ASSETS } from "../services/asset-manager";

export class Player extends User {

    hasSprayPowerUp: Boolean;
    hasShield:Boolean;
    shieldTick:number = 10;
    hasExplosionVelocity: Boolean;
    hasRoFpowerUp: Boolean;
    playerVelocity: number = 250;
    maxHealth: number = 60;
    baseSprite = ASSETS.PREPEND + "drone-images/playerShip.png";
    shieldSprite = ASSETS.PREPEND + "drone-images/playerShip-shield-loop.png";
    loopShieldSprites:any;
    shieldSpriteNum:number = 0;
    shieldInstanceLocation = [0,117,234,351,468]; //starting X value location of each image to show
    shieldPointer = 0;

    constructor() {
        super('fff', 117, 53, 200, 200);
        this.health = 50;
        this.hasSprayPowerUp = false;
        this.hasShield = false;
        this.hasExplosionVelocity = false;
        this.hasRoFpowerUp = false;
        this.sprite.src = this.baseSprite;
    }

    update(canvas: CanvasRenderingContext2D, keyHandler: KeyDown, dT: number) {
        if (keyHandler.isDown()) {
            this.Y += this.Y > canvas.canvas.height - 20 ? 0 : this.playerVelocity * dT;
          }
          if (keyHandler.isUp()) {
            this.Y -= this.Y < 0 ? 0 : this.playerVelocity * dT;
          }
          if (keyHandler.isLeft()) {
            this.X -= this.X < 0 ? 0 : this.playerVelocity * dT;
          }
          if (keyHandler.isRight()) {
            this.X += this.X > canvas.canvas.width - 20 ? 0 : this.playerVelocity * dT;
          }

          //remove shields when tick is gone
          if(this.hasShield && this.shieldTick <= 0) {
            clearInterval(this.loopShieldSprites);
            this.hasShield = false;
            this.sprite.src = this.baseSprite;
          }
    }

    midpoint() {
        return {
            x: this.X + this.Width / 2,
            y: this.Y + this.Height / 2
        }
    }

    shoot(playerBullets: PlayerBullets[]) {
        let loc = this.midpoint();
        playerBullets.push(
            new PlayerBullets(-750, loc.x, loc.y)
        )
        return playerBullets;
    }

    /** Override explosion function */
    explode() {
        if(!this.hasShield){
            this.hasSprayPowerUp = false;
            this.health--;
            if (this.health <= 0) {
                return true;
            }
            return false;
        } else {
            this.shieldTick--;
        }
    }
    
    /** Call to add Health to the player */
    addHealth(amount: number){
        this.health += amount;
        if(this.health > this.maxHealth){
            this.health = this.maxHealth;
        }
    }

    /** Activate Shield Boost */
    activateShield() {
        clearInterval(this.loopShieldSprites);
        this.sprite.src = this.shieldSprite;
        this.shieldTick = 10;
        this.hasShield = true;
        this.loopShieldSprites = setInterval( () => {
            if(this.shieldPointer === this.shieldInstanceLocation.length - 1){
                this.shieldPointer = 0;
            }
            this.shieldSpriteNum = this.shieldInstanceLocation[this.shieldPointer];
            this.shieldPointer++;
        }, 80);
    }

    /** Lose all powerups */
    losePowerUps() {
        this.hasSprayPowerUp = false;
        this.hasExplosionVelocity = false;
        this.hasRoFpowerUp = false;
    }

    draw(canvas: CanvasRenderingContext2D) {
        if(!this.hasShield){
            canvas.drawImage(this.sprite, this.X, this.Y, this.Width, this.Height);
        } else {
            canvas.drawImage(this.sprite, this.shieldSpriteNum, 0, this.Width, this.Height, this.X, this.Y, this.Width, this.Height);
        }
    }
}
