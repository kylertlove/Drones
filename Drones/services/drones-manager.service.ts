import { Player } from '../model/player';
import { KeyDown } from '../services/key-status';
import { PlayerBullets } from "../model/playerBullets";
import { Drone } from "../model/drone";
import { Entity } from "../model/entity";
import { Powerup } from "../model/powerups";
import { Missile } from "../model/missile";
import { Boss } from "../model/boss.drones";
import { EnemyBullet } from "../model/enemyBullets";
import { Hud } from "../model/hud";
import { AudioService } from 'audio.service';
import { PowerUpType, DifficultyLevel } from 'enum-manager';
import { Utils } from './utilty.service';

export class DronesManagerService {

  dT: number;
  pauseGame: Boolean;
  soundService: AudioService;
  keyHandler: KeyDown;
  player: Player;
  playerRoF: number;
  powerUp: Powerup;
  playerMissile: Missile;
  playerBullets: PlayerBullets[];
  enemyFleet: Drone[];
  boss: Boss;
  enemyBullets: EnemyBullet[];
  GAME_DIFFICULTY: DifficultyLevel; 
  GameOver: Boolean;
  hud: Hud;
  KILLS: number;
  utils:Utils;

  constructor() {
    this.hud = new Hud();
    this.player = new Player();
    this.keyHandler = new KeyDown();
    this.powerUp = new Powerup();
    this.playerMissile = new Missile(false);
    this.boss = new Boss();
    this.soundService = new AudioService();
    this.utils = new Utils();
    this.dT = 0;
    this.pauseGame = false;
    this.playerRoF = 0;
    this.playerBullets = [];
    this.enemyFleet = [];
    this.enemyBullets = [];
    this.GAME_DIFFICULTY = DifficultyLevel.NORMAL;
    this.GameOver = false;
    this.KILLS = 0;
  }

  /** Key change resolver */
  keyChange(keyCode, UporDown) {
    if (keyCode === 13 && !UporDown) {
      this.pauseGame = !this.pauseGame;
    }
    this.keyHandler.keyChange(keyCode, UporDown);
  }

  /**
   * Update Funtion for Events. Called in Main Gameloop  
   * @param canvas 
   */
  update(canvas: CanvasRenderingContext2D, deltaTime: number) {
    this.dT = deltaTime;
    this.updateUserLocations(canvas);
    this.updateProjectileLocations(canvas);
    this.updateEnemiesLocation(canvas);
    this.randomizedGameElements(canvas)
    this.checkCollitions(canvas);
  }

  /**
   * Draw Function for elements.  Called in Main Gameloop 
   * @param canvas 
   */
  draw(canvas: CanvasRenderingContext2D) {
    //draw the player
    this.player.draw(canvas);
    //draw powerup
    if (this.powerUp.active) { this.powerUp.draw(canvas) }
    if (this.powerUp.showText) { this.hud.displayText(canvas, this.powerUp.getFlashText()) }
    //draw missile
    if (this.playerMissile.activeMissile || this.playerMissile.explodingMissile) {
      this.playerMissile.draw(canvas)
    }
    //draw the bullets
    this.playerBullets.forEach((bullet) => {
      bullet.draw(canvas);
    })
    //draw the enemy drones
    this.enemyFleet.forEach((enemy) => {
      enemy.draw(canvas);
      if (enemy.hasBeenShot && enemy.active) {
        this.hud.addCount(canvas, enemy);
      }
    })
    //draw boss
    if (this.boss.active || this.boss.explodingBoss) { this.boss.draw(canvas) };
    //enemy bullets
    this.enemyBullets.forEach((bullet) => {
      bullet.draw(canvas);
    });

    //draw HUD
    this.hud.playerStats(canvas, this.player, this.KILLS, this.GAME_DIFFICULTY);
    if(this.player.hasShield){
      this.hud.drawShieldTick(canvas, this.player.shieldTick);
    }
  }

  /**
   * Update the Location of the player
   * @param canvas 
   */
  updateUserLocations(canvas: CanvasRenderingContext2D) {
    //player
    this.player.update(canvas, this.keyHandler, this.dT);
  }

  /**
   * Updates all player and Boss bullets
   * @param canvas 
   */
  updateProjectileLocations(canvas: CanvasRenderingContext2D) {
    //add bullets to game board
    if (this.keyHandler.isShooting()) {
      if (this.playerRoF === 0) {
        this.playerBullets = this.player.shoot(this.playerBullets);
        this.soundService._noiseFireZeLazor();
      }
      if (!this.player.hasRoFpowerUp) {
        this.playerRoF++;
        if (this.playerRoF === 5) { this.playerRoF = 0; }
      } else {
        this.playerRoF = 0;
      }
    }
    //update bullet positions
    this.playerBullets.forEach((bullet) => {
      bullet.update(canvas, null, this.dT);
      if (this.player.hasSprayPowerUp) {
        bullet.powerUpCycle()
      }
    });
    //remove inactive bullets
    this.playerBullets = this.playerBullets.filter((bullet) => { return bullet.active });
    this.enemyBullets = this.enemyBullets.filter((eBullet) => { return eBullet.active });

    if (!this.playerMissile.activeMissile && this.keyHandler.isFireZeMissiles() && !this.playerMissile.explodingMissile) {
      this.playerMissile.activeMissile = true;
      this.playerMissile.X = this.player.X;
      this.playerMissile.Y = this.player.Y;
      this.soundService._noiseFireMissile();
    }
    if (this.playerMissile.activeMissile) { this.playerMissile.update(canvas, null, this.dT) }
    if (this.powerUp.active) { this.powerUp.update(canvas, null, this.dT) }
  }

  /**
   * Update all drones and Boss if active.  
   * @param canvas 
   */
  updateEnemiesLocation(canvas: CanvasRenderingContext2D) {
    //add enemies
    if (Math.random() < this.GAME_DIFFICULTY + .02) {
      this.enemyFleet.push(
        new Drone(200, canvas.canvas.width - 30,
          (canvas.canvas.width / 12 + Math.random() * canvas.canvas.width / 3))
      );
    }
    //update enemy position
    this.enemyFleet.forEach((enemy) => {
      enemy.update(canvas, null, this.dT);
    })
    //remove inactive enemies
    this.enemyFleet = this.enemyFleet.filter((enemy) => { return enemy.active });
    //update boss
    if (this.boss.active) {
      this.boss.update(canvas, this.keyHandler, this.dT);
      if (Math.random() < this.GAME_DIFFICULTY) {
        this.enemyBullets = this.boss.shoot(this.enemyBullets);
      }
    }
    //update bullet positions
    this.enemyBullets.forEach((bullet) => {
      bullet.update(canvas, null, this.dT);
      bullet.powerUpCycle();
    });
  }

  /**
   * Function that will create and update all Random game elements
   * @param canvas 
   */
  randomizedGameElements(canvas: CanvasRenderingContext2D) {
    //generate powerups
    if (!this.powerUp.active) {
      if (Math.random() * 10000 < 40) {
        this.powerUp.active = true;
        this.powerUp.X = canvas.canvas.width;
        this.powerUp.Y = this.getRandomHeight(canvas);
      }
    }
    //generate boss 
    if (!this.boss.active) {
      if (this.KILLS % 273 === 0 && this.KILLS !== 0) {
        this.boss.active = true;
        this.boss.health = 300 + (1000 * this.GAME_DIFFICULTY);
        this.boss.X = canvas.canvas.width - 300;
        this.boss.Y = canvas.canvas.height / 2;
      }
    }
  }

  /**
   * Main Loop function to check for all collisions and handle event
   */
  checkCollitions(canvas: CanvasRenderingContext2D) {
    //enemies - player bullets
    this.enemyFleet.forEach((enemy) => {
      if (!enemy.hasBeenShot) {
        this.playerBullets.forEach((bullet) => {
          if (this.collides(enemy, bullet)) {
            this.KILLS++;
            enemy.explode();
            bullet.active = false;
          }
        });
      }
    });
      /**
     * enemies - player && enemies - missiles
     */
    this.enemyFleet.forEach((enemy) => {
      if (!enemy.hasBeenShot) {
        if (this.collides(enemy, this.player)) {
          enemy.explode();
          if(!this.player.hasShield){
            this.removePowerups();
          }
          this.GameOver = this.player.explode();
        }
        if (this.playerMissile.activeMissile && this.collides(this.playerMissile, enemy)) {
          this.KILLS++;
          enemy.explode();
          this.playerMissile.destroy(canvas);
          this.enemyFleet.forEach((nestEnemy) => {
            if (this.bombCollides(this.playerMissile, nestEnemy, this.playerMissile.explosionVelocity)) {
              this.KILLS++;
              nestEnemy.explode();
            }
          })
        }
      }
    });
    /**
     * player - powerups
     */
    if (this.powerUp.active && this.collides(this.player, this.powerUp)) {
      switch (this.powerUp.type) {
        case PowerUpType.Spray:
          this.player.hasSprayPowerUp = true;
          break;
        case PowerUpType.Health:
          this.player.addHealth(10);
          break;
        case PowerUpType.explosionVelocity:
          this.player.hasExplosionVelocity = true;
          this.playerMissile.explosionVelocity = 400;
          break;
        case PowerUpType.RoF:
          this.player.hasRoFpowerUp = true;
          break;
        case PowerUpType.Shield:
          this.player.activateShield();
          break;
      }
      this.powerUp.flashInfo(this.powerUp.type);
      //reset powerup
      this.powerUp.active = false;
      this.powerUp.X = canvas.canvas.width;
      //change the type of the powerup
      this.powerUp.getRandomPowerup(this.utils);
    }
    
    /**
     * boss - playerbullets
     */
    if (this.boss.active) {
      this.playerBullets.forEach((bullet) => {
        if (this.collides(this.boss, bullet)) {
          this.boss.health--;
          if (this.boss.health <= 0) { this.boss.active = false }
          bullet.active = false;
        }
      });
      
      /**
       * boss - missile
       */
      if (this.playerMissile.activeMissile && this.collides(this.playerMissile, this.boss)) {
        this.boss.health -= this.player.hasExplosionVelocity ? 100 : 50;
        this.playerMissile.destroy(canvas);
        if (this.boss.health <= 0) { this.boss.destroy(canvas) }
        this.enemyFleet.forEach((nestEnemy) => {
          if (this.bombCollides(this.playerMissile, nestEnemy, this.playerMissile.explosionVelocity)) {
            this.KILLS++;
            nestEnemy.explode();
          }
        })
      }
    }
    /**
     * enemy bullets - player
     */
    this.enemyBullets.forEach((bullet) => {
      if (this.collides(bullet, this.player)) {
        bullet.active = false;
        if(!this.player.hasShield){
          this.removePowerups();
        }
        this.GameOver = this.player.explode();
      }
    });
    if (this.playerMissile.needMissile) {
      this.playerMissile = new Missile(this.player.hasExplosionVelocity);
    }
  }

  /** Collision Detection Handler */
  collides(a: Entity, b: Entity) {
    return a.X < b.X + b.Width &&
      a.X + a.Width > b.X &&
      a.Y < b.Y + b.Height &&
      a.Y + a.Height > b.Y;
  }

  /**
   * Radius defined bomb explosion
   * @param a 
   * @param b 
   * @param rad 
   */
  bombCollides(a: Entity, b: Entity, rad: number) {
    return a.X < (b.X + rad) + b.Width &&
      a.X + a.Width > (b.X - rad) &&
      a.Y < (b.Y + rad) + b.Width &&
      a.Y + a.Height > (b.Y - rad);
  }

  getRandomHeight(canvas: CanvasRenderingContext2D) {
    let rand = Math.floor(Math.random() * 1000) + 1;
    if (rand < 10) {
      rand = 10;
    }
    if (rand % 2 === 0) {
      rand += 100;
    }
    if (rand > canvas.canvas.height) {
      rand -= (rand - canvas.canvas.height);
    }
    if (rand > canvas.canvas.height - 50) {
      rand = canvas.canvas.height - 100;
    }
    return rand;
  }

  /** When Player Collision happens remove all powerups */
  removePowerups() {
    this.player.losePowerUps();
    this.playerMissile.explosionVelocity = this.playerMissile.defaultExplosionVelocity;
  }
}
