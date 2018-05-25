import { Player } from "./player.drones";
import { Missile } from "./missile";
import { Entity } from "./entity.drones";
import { ASSETS } from "../services/asset-manager";
import { CanvasButton, CanvasText, CANVAS_BUTTON_NAME } from "./CanvasMenuObjects";


export class Hud {
  showLevelText: string = "Level 1";
  volumeImageObj;
  volOn = ASSETS.PREPEND + "drone-images/volume.png"
  volPaused = ASSETS.PREPEND + "drone-images/volume-pause.png";
  nextImageObj;
  textColor: string = "lime";
  constructor() {
    this.volumeImageObj = new Image(25, 25);
    this.volumeImageObj.src = this.volOn;
    this.nextImageObj = new Image(25, 25);
    this.nextImageObj.src = ASSETS.PREPEND + "drone-images/volumeNext.jpg";
  }

  displayText(canvas: CanvasRenderingContext2D, text: string) {
    let displayText = new CanvasText(text, (canvas.canvas.width / 2), (canvas.canvas.height / 6), this.textColor, "25px Jazz LET, fantasy");
    canvas.font = displayText.font;
    canvas.fillStyle = displayText.color;
    canvas.textAlign = "center";
    canvas.fillText(text, displayText.x, displayText.y);
  }

  /**
   * Bottom left corner stats 
   * @param canvas 
   * @param player 
   * @param kills 
   */
  playerStats(canvas: CanvasRenderingContext2D, player: Player, kills: number) {
    let health = new CanvasText(`Health: ${player.health.toString()}`, (canvas.canvas.width / 40), (canvas.canvas.height - (canvas.canvas.height / 14)), this.textColor, "17px Jazz LET, fantasy");
    let KillsText = new CanvasText(`Kills: ${kills.toString()}`, (canvas.canvas.width / 40), (canvas.canvas.height - (canvas.canvas.height / 10)), this.textColor, "17px Jazz LET, fantasy");
    let level = new CanvasText(this.showLevelText, (canvas.canvas.width / 40), (canvas.canvas.height - (canvas.canvas.height / 7)), this.textColor, "17px Jazz LET, fantasy");
    
    canvas.font = health.font;
    canvas.fillStyle = this.textColor;
    canvas.strokeStyle = this.textColor;
    canvas.textAlign = "left";
    canvas.fillText(health.word, health.x, health.y);
    canvas.fillText(KillsText.word, KillsText.x, KillsText.y);
    canvas.fillText(level.word, level.x, level.y);
  }


  volumeHud(canvas: CanvasRenderingContext2D) {
    canvas.drawImage(this.volumeImageObj, 0, 0);
    
    canvas.drawImage(this.nextImageObj, 20, 0);
  }

  pauseVolume(paused: boolean) {
    if(paused){
      this.volumeImageObj.src = this.volPaused;
    }else{
      this.volumeImageObj.src = this.volOn;
    }
  }

  addCount(canvas: CanvasRenderingContext2D, enemy: Entity) {
    let hitCount = new CanvasText("+1", enemy.X, enemy.Y, this.textColor, "15px Arial");
    canvas.font = hitCount.font;
    canvas.fillStyle = hitCount.color;
    canvas.strokeStyle = hitCount.color;
    canvas.fillText(hitCount.word, hitCount.x, hitCount.y);
  }

  splashScreen(canvas: CanvasRenderingContext2D) {
    let btnList: CanvasButton[] = [];
    let title = new CanvasText("DRONES", (canvas.canvas.width / 2) - 50, (canvas.canvas.height / 2), this.textColor, "40px Arial");
    canvas.font = title.font;
    canvas.fillStyle = title.color;
    canvas.textAlign = "left";
    let startButton = new CanvasButton(CANVAS_BUTTON_NAME.GAME_PLAY, title.x - 20, title.y + 40, canvas.measureText(title.word).width + 40, 35);
    canvas.fillText(title.word, title.x, title.y);
    canvas.fillRect(startButton.x, startButton.y, startButton.w, startButton.h);
    let startText = new CanvasText("Start", startButton.x + (startButton.w / 3.5), startButton.y + startButton.h - 3, this.textColor, "15px Arial");
    canvas.fillStyle = "black";
    canvas.fillText(startText.word, startText.x, startText.y);
    btnList.push(startButton);
    return btnList;
  }

  pauseScreen(canvas: CanvasRenderingContext2D) {
    let btnList: CanvasButton[] = [];
    let menuHeader = new CanvasText("Paused", (canvas.canvas.width / 2), (canvas.canvas.height / 2), this.textColor, "30px Arial");
    canvas.font = menuHeader.font;
    canvas.fillStyle = menuHeader.color;
    canvas.textAlign = "center";
    canvas.fillText(menuHeader.word, menuHeader.x, menuHeader.y);
    return btnList;
  }

  gameOverScreen(canvas: CanvasRenderingContext2D){
    let btnList: CanvasButton[] = [];
    let title = new CanvasText("Game Over", (canvas.canvas.width / 2) - 50, (canvas.canvas.height / 2), this.textColor, "40px Arial");
    canvas.font = title.font;
    canvas.fillStyle = title.color;
    canvas.textAlign = "left";
    let restartButton = new CanvasButton(CANVAS_BUTTON_NAME.RESTART, title.x - 20, title.y + 40, canvas.measureText(title.word).width + 40, 35);
    canvas.fillText(title.word, title.x, title.y);
    canvas.fillRect(restartButton.x, restartButton.y, restartButton.w, restartButton.h);
    let restartText = new CanvasText("Restart", restartButton.x + (restartButton.w / 4), restartButton.y + restartButton.h - 3, this.textColor, "15px Arial");
    canvas.fillStyle = "black";
    canvas.fillText(restartText.word, restartText.x, restartText.y);
    btnList.push(restartButton);
    return btnList;
  }
}

export enum SCREEN_BTNS {
  SPLASH, PAUSE, GAME_OVER
}