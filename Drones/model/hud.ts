import { Player } from "./player.drones";
import { Missile } from "./missile";
import { Entity } from "./entity.drones";
import { ASSETS } from "../services/asset-manager";
import { CanvasButton, CanvasText, CANVAS_BUTTON_NAME } from "./CanvasMenuObjects";


export class Hud {
  showLevelText: string = "Level 1";
  volumeImageObj;
  nextImageObj;
  textColor: string = "lime";
  constructor() {
    this.volumeImageObj = new Image(25, 25);
    this.volumeImageObj.src = ASSETS.PREPEND + "drone-images/volume.png";
    this.nextImageObj = new Image(25, 25);
    this.nextImageObj.src = ASSETS.PREPEND + "drone-images/volumeNext.jpg";
  }

  /** Draw a menu box onto canvas.  only function called during pause or gameover */
  menuBox(canvas: CanvasRenderingContext2D, word: string) {
    let menuHeader = new CanvasText(word, (canvas.canvas.width / 2), (canvas.canvas.height / 3), this.textColor, "30px Arial");
    canvas.font = menuHeader.font;
    canvas.fillStyle = menuHeader.color;
    canvas.textAlign = "center";
    canvas.fillText(menuHeader.word, menuHeader.x, menuHeader.y);

    // if (word === 'Paused') {
    //   let volumeHeader = new CanvasText("Volume:", menuHeader.x, menuHeader.y + 35, this.textColor, "22px Arial");
    //   canvas.font = volumeHeader.font;
    //   canvas.fillStyle = volumeHeader.color;
    //   canvas.textAlign = "center";
    //   canvas.fillText(volumeHeader.word, volumeHeader.x, volumeHeader.y);
    //   let volumeBox = new CanvasButton(CANVAS_BUTTON_NAME.VOLUME_DOWN, menuHeader.x + 30, menuHeader.y, 100, 25);
    //   canvas.fillStyle = this.textColor;
    //   canvas.fillRect(volumeBox.x, volumeBox.y, volumeBox.w, volumeBox.h);
    // }
  }

  displayText(canvas: CanvasRenderingContext2D, text: string) {
    let displayText = new CanvasText(text, (canvas.canvas.width / 2), (canvas.canvas.height / 6), this.textColor, "25px Jazz LET, fantasy");
    canvas.font = displayText.font;
    canvas.fillStyle = displayText.color;
    canvas.textAlign = "center";
    canvas.fillText(text, displayText.x, displayText.y);
  }

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
  pauseVolume(src: string) {
    this.volumeImageObj.src = src;
  }

  addCount(canvas: CanvasRenderingContext2D, enemy: Entity) {
    let hitCount = new CanvasText("+1", enemy.X, enemy.Y, this.textColor, "15px Arial");
    canvas.font = hitCount.font;
    canvas.fillStyle = hitCount.color;
    canvas.strokeStyle = hitCount.color;
    canvas.fillText(hitCount.word, hitCount.x, hitCount.y);
  }
}