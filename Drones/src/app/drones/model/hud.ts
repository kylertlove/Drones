import { Player } from "./player.drones";
import { Missile } from "./missile";
import { Entity } from "./entity.drones";


export class Hud{
    showLevelText: string = "Level 1";
    constructor(){ }

  /** Draw a menu box onto canvas.  only function called during pause or gameover */
  menuBox(canvas: CanvasRenderingContext2D, word: string) {
    canvas.font = "30px Arial";
    canvas.fillStyle = "lime";
    canvas.textAlign = "center";
    canvas.fillText(word, (canvas.canvas.width / 2), (canvas.canvas.height / 2));
  }

  displayText(canvas: CanvasRenderingContext2D, text: string) {
    canvas.font="25px Jazz LET, fantasy";
    canvas.textAlign = "center";
    canvas.fillStyle = "lime";
    canvas.fillText(text, (canvas.canvas.width / 2), (canvas.canvas.height / 6));
  }

  playerStats(canvas: CanvasRenderingContext2D, player: Player, kills: number){
    canvas.font = "17px Jazz LET, fantasy";
    canvas.fillStyle = "lime";
    canvas.textAlign = "left";
    canvas.strokeStyle = "lime";
    canvas.fillText('Health: ' + player.health.toString(), (canvas.canvas.width / 40), 
    (canvas.canvas.height - (canvas.canvas.height / 14)));
    canvas.fillText('Kills: ' + kills.toString(), (canvas.canvas.width / 40), 
    (canvas.canvas.height - (canvas.canvas.height / 10)));
    canvas.fillText(this.showLevelText, (canvas.canvas.width / 40), 
    (canvas.canvas.height - (canvas.canvas.height / 7)));
  }

  volumeHud(canvas: CanvasRenderingContext2D, img:any){
    canvas.drawImage(img, 10, 10);
  }

  addCount(canvas: CanvasRenderingContext2D, enemy: Entity){
    canvas.font = "15px Arial";
    canvas.fillStyle = "lime";
    canvas.strokeStyle = "lime";
    canvas.fillText('+1', enemy.X, enemy.Y);
  }
}