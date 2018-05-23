import { Entity } from './entity.drones';
import { User } from './user.drones';
import { KeyDown } from '../services/key-status';
import { PlayerBullets } from "./playerBullets";
import { ASSETS } from "../services/asset-manager";

export class Player extends User {

    hasSprayPowerUp: Boolean;
    hasExplosionVelocity: Boolean;
    hasRoFpowerUp: Boolean;
    playerVelocity: number = 250;
    maxHealth: number = 60;

    constructor() {
        super('fff', 90, 40, 200, 200);
        this.health = 1;
        this.hasSprayPowerUp = false;
        this.hasExplosionVelocity = false;
        this.hasRoFpowerUp = false;
        this.sprite.src = ASSETS.PREPEND + "drone-images/playerShip1.png";
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
        this.hasSprayPowerUp = false;
        this.health--;
        if (this.health <= 0) {
            return true;
        }
        return false;
    }
    /** Call to add Health to the player */
    addHealth(amount: number){
        this.health += amount;
        if(this.health > this.maxHealth){
            this.health = this.maxHealth;
        }
    }

    /** Lose all powerups */
    losePowerUps(){
        this.hasSprayPowerUp = false;
        this.hasExplosionVelocity = false;
        this.hasRoFpowerUp = false;
    }
}
