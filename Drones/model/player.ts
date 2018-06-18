import { Entity } from './entity';
import { User } from './user';
import { KeyDown } from '../services/key-status';
import { PlayerBullets } from "./playerBullets";
import { ASSETS } from "../services/asset-manager";

export class Player extends User {

    hasSprayPowerUp: Boolean;
    hasShield:Boolean;
    shieldSpriteNum:number = 1;
    shieldTimer:number = 0;
    hasExplosionVelocity: Boolean;
    hasRoFpowerUp: Boolean;
    playerVelocity: number = 250;
    maxHealth: number = 60;
    loopShieldSprites: any;
    baseSprite = ASSETS.PREPEND + "drone-images/playerShip1.png";

    constructor() {
        super('fff', 90, 40, 200, 200);
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

          //remove shields after 1000 ticks
          if(this.hasShield && this.shieldTimer > 500) {
            clearInterval(this.loopShieldSprites);
            this.hasShield = false;
            this.sprite.src = this.baseSprite;
            this.shieldTimer = 0;
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
        this.hasShield = true;
        this.loopShieldSprites = setInterval( () => {
            this.shieldSpriteNum++;
            this.shieldTimer++;
            if(this.shieldSpriteNum === 6){
                this.shieldSpriteNum = 1;
            }
            this.sprite.src = `${ASSETS.PREPEND}drone-images/playerShip-shield-${this.shieldSpriteNum}.png`;
        }, 80);
    }

    /** Lose all powerups */
    losePowerUps() {
        this.hasSprayPowerUp = false;
        this.hasExplosionVelocity = false;
        this.hasRoFpowerUp = false;
    }

    draw(canvas: CanvasRenderingContext2D) {
        canvas.drawImage(this.sprite, this.X, this.Y, this.Width, this.Height);
    }
}
