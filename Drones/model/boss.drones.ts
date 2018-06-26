import { User } from "./user";
import { KeyDown } from "../services/key-status";
import { EnemyBullet } from "./enemyBullets";
import { ASSETS } from "../services/asset-manager";

export class Boss extends User {

    active: Boolean = false;
    explodingBoss: Boolean;
    bossVelocity: number = 80;
    defaultSprite: string = ASSETS.PREPEND + "drone-images/boss.png";

    constructor() {
        super('fff', 200, 100, 0, 300);
        this.health = 100;
        this.sprite.src = this.defaultSprite;
    }

    update(canvas: CanvasRenderingContext2D, keyHandler: KeyDown, dT: number) {
        if (keyHandler.isDown()) {
            this.Y += this.Y > canvas.canvas.height - (canvas.canvas.height/4) ?
                 0 : this.bossVelocity * dT;
          }
          if (keyHandler.isUp()) {
            this.Y -= this.Y < 0 ? 0 : this.bossVelocity * dT;
          }
          if (keyHandler.isLeft()) {
            this.X -= this.X < 0 ? 0 : this.bossVelocity * dT;
          }
          if (keyHandler.isRight()) {
            this.X += this.X > canvas.canvas.width - (canvas.canvas.width/4) ?
                 0 : this.bossVelocity * dT;
          }
    }

    midpoint() {
        return {
            x: this.X + this.Width / 2,
            y: this.Y + this.Height / 2
        }
    }

    shoot(enemyBullets: EnemyBullet[]) {
        let loc = this.midpoint();
        enemyBullets.push(
            new EnemyBullet(550, loc.x, loc.y)
        )
        return enemyBullets;
    }

    destroy(canvas: CanvasRenderingContext2D) {
        this.active = false;
        this.explodingBoss = true;
        this.sprite.src = ASSETS.PREPEND + "drone-images/explode-yellow.png";
        setTimeout(() => {         
            this.explodingBoss = false;
            this.sprite.src = this.defaultSprite;
        }, 300);
    }
}
