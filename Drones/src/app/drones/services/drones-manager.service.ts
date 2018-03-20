import { Injectable } from '@angular/core';
import { Player } from '../model/player.drones';
import { KeyDown } from '../services/key-status';
import { PlayerBullets } from "../model/playerBullets";
import { Enemy } from "../model/enemy.drones";
import { Entity } from "../model/entity.drones";
import { Powerup, PowerUpType } from "../model/powerup.drones";
import { Missile } from "../model/missile";
import { Boss } from "../model/boss.drones";
import { EnemyBullet } from "../model/enemyBullets";
import { Hud } from "../model/hud";
import { AudioService } from '../services/audio.service';

@Injectable()
export class DronesManagerService {

  dT: number = 0;
  pauseGame: Boolean = false;
  pauseGameTime: Boolean = true;
  keyHandler: KeyDown;
  player: Player;
  playerRoF: number = 0;
  powerUp: Powerup;
  playerMissile: Missile;
  playerBullets: PlayerBullets[] = [];
  enemyFleet: Enemy[] = [];
  boss: Boss;
  enemyBullets: EnemyBullet[] = [];
  //easy: .04, Medium: .07,hard: .13
  GAME_DIFFICULTY = .04; // 20/200: .067
  GameOver: Boolean = false;
  hud: Hud; 
  KILLS = 0;

  constructor(public audio: AudioService) {
    this.hud = new Hud();
    this.player = new Player();
    this.keyHandler = new KeyDown();
    this.powerUp = new Powerup();
    this.playerMissile = new Missile(false);
    this.boss = new Boss();
  }

  /** Key change resolver */
  keyChange(keyCode, UporDown) {
    if (keyCode === 13) {
      if (this.pauseGameTime) {
        this.timeout();
        this.pauseGameTime = false;
      }
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
    if (this.powerUp.showText) {this.hud.displayText(canvas, this.powerUp.getFlashText())}
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
      if(enemy.hasBeenShot && enemy.active){
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
    this.hud.playerStats(canvas, this.player, this.KILLS);
    this.hud.volumeHud(canvas);
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
      if(this.playerRoF === 0){
        this.playerBullets = this.player.shoot(this.playerBullets);
      }
      if(!this.player.hasRoFpowerUp){
        this.playerRoF++;
        if(this.playerRoF === 5){this.playerRoF = 0;}
      }else{
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

    if (!this.playerMissile.activeMissile && this.keyHandler.isFireZeMissiles()) {
      this.playerMissile.activeMissile = true;
      this.playerMissile.X = this.player.X;
      this.playerMissile.Y = this.player.Y;
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
        new Enemy(200, canvas.canvas.width - 30,
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
      if (this.KILLS % 273 === 0) {
        this.boss.active = true;
        this.boss.health = 500;
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
    //enemies - player && enemies - missiles
    this.enemyFleet.forEach((enemy) => {
      if (!enemy.hasBeenShot) {
        if (this.collides(enemy, this.player)) {
          this.GameOver = this.player.explode();
          enemy.explode();
          this.removePowerups();
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
    //player - powerups
    if (this.powerUp.active && this.collides(this.player, this.powerUp)) {
      if (this.powerUp.type === PowerUpType.Spray) {
        this.player.hasSprayPowerUp = true;
      }else if (this.powerUp.type === PowerUpType.Health) {
        this.player.addHealth(10);
      }else if(this.powerUp.type === PowerUpType.explosionVelocity){
        this.player.hasExplosionVelocity = true;
        this.playerMissile.explosionVelocity = 400;
      }else if(this.powerUp.type === PowerUpType.RoF){
        this.player.hasRoFpowerUp = true;
      }
      this.powerUp.flashInfo(this.powerUp.type);
      //reset powerup
      this.powerUp.active = false;
      this.powerUp.X = canvas.canvas.width;
      //change the type of the powerup
      this.powerUp.getNewType();
    }
    //boss - playerbullets
    if (this.boss.active) {
      this.playerBullets.forEach((bullet) => {
        if (this.collides(this.boss, bullet)) {
          this.boss.health--;
          if (this.boss.health <= 0) { this.boss.active = false }
          bullet.active = false;
        }
      });
      //boss - missile
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
    //enemy bullets - player
    this.enemyBullets.forEach((bullet) => {
      if (this.collides(bullet, this.player)) {
        bullet.active = false;
        this.player.health--;
        this.removePowerups();
        this.GameOver = this.player.explode();
      }
    });
    if (this.playerMissile.needMissile) {
      this.playerMissile = new Missile(this.player.hasExplosionVelocity);
    }

    if(this.KILLS > 100 && this.GAME_DIFFICULTY !== .07){
      this.GAME_DIFFICULTY = .07;
      this.hud.showLevelText = "Level 2";
    }
    if(this.KILLS > 500 && this.GAME_DIFFICULTY !== .13){
      this.GAME_DIFFICULTY = .13;
      this.hud.showLevelText = "Level 3";
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

  /** Function that provides a timeout for pausing game.
  * This is needed to keep the keydown event from calling continuously
  */
  timeout() {
    setTimeout(() => {
      this.pauseGame = !this.pauseGame;
      this.pauseGameTime = true;
    }, 150)
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
    if(rand > canvas.canvas.height - 50){
      rand = canvas.canvas.height - 100;
    }
    return rand;
  }

  /** Draw a menu box onto canvas.  only function called during pause or gameover */
  menuBox(canvas: CanvasRenderingContext2D, word: string) {
    this.hud.menuBox(canvas, word);
  }

  /** When Player Collision happens remove all powerups */
  removePowerups(){
    this.player.losePowerUps();
    this.playerMissile.explosionVelocity = this.playerMissile.defaultExplosionVelocity;
  }

  audioControl(pause:Boolean){
    if(pause){
      this.hud.pauseVolume("/assets/drone-images/volume-pause.png");
    }else{
      this.hud.pauseVolume("/assets/drone-images/volume.png");
    }
    this.audio.toggle(pause);
  }
}
