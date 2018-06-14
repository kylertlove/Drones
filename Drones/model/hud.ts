import { Player } from "./player.drones";
import { Missile } from "./missile";
import { Entity } from "./entity.drones";
import { ASSETS } from "../services/asset-manager";
import { CanvasButton, CanvasText, CANVAS_BUTTON_NAME } from "./CanvasMenuObjects";
import { DronesCanvas } from "../DronesCanvas";


export class Hud {
  showLevelText: string = "Level 1";
  volumeImageObj;
  volOn = ASSETS.PREPEND + "drone-images/volume.png"
  volPaused = ASSETS.PREPEND + "drone-images/volume-pause.png";
  nextImageObj;
  textColor: string = "lime";
  guiBox: HTMLElement;
  constructor() {
    this.volumeImageObj = new Image(25, 25);
    this.volumeImageObj.src = this.volOn;
    this.nextImageObj = new Image(25, 25);
    this.nextImageObj.src = ASSETS.PREPEND + "drone-images/volumeNext.jpg";
    this.createGUI();
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

  /**
   * Initial Screen
   * @param DronesCanvas
   */
  splashScreen(Controller:DronesCanvas) {
    this.clearGUI();
    let title:HTMLLabelElement = document.createElement('LABEL') as HTMLLabelElement;
    title.innerText = "DRONES";
    title.setAttribute('style', 'color:lime;font:40px Verdana;font-weight: 700;');
    let startBtn:HTMLButtonElement = document.createElement('BUTTON') as HTMLButtonElement;
    startBtn.innerText = "Start";
    startBtn.setAttribute('style', this.getButtonStyle(false));
    startBtn.onclick = () => {
      Controller.start();
      this.clearGUI();
    }
    startBtn.onmouseover = () => {
      startBtn.setAttribute('style', this.getButtonStyle(true));
    }
    startBtn.onmouseleave = () => {
      startBtn.setAttribute('style', this.getButtonStyle(false));
    }
    let howToPlay:HTMLLabelElement = document.createElement('LABEL') as HTMLLabelElement;
    howToPlay.setAttribute('style', 'color:lime;font:16px Verdana;bottom: 0;');
    howToPlay.innerText = "Arrows to move; Spacebar to shoot; left ctrl for missiles";
    let initLine = this.getNewLineElem(5);
    this.guiBox.insertAdjacentElement("afterbegin", initLine);
    initLine.insertAdjacentElement("afterend", title);
    let newLine = this.getNewLineElem(25);
    title.insertAdjacentElement("afterend", newLine);
    newLine.insertAdjacentElement("afterend", startBtn);
    let thirdLine = this.getNewLineElem(150);
    startBtn.insertAdjacentElement("afterend", thirdLine);
    thirdLine.insertAdjacentElement("afterend", howToPlay);
  }

  /**
   * Pause/settings Screen
   */
  pauseScreen() {
    this.clearGUI();
    let pauseText:HTMLLabelElement = document.createElement('LABEL') as HTMLLabelElement;
    pauseText.innerText = "PAUSED";
    pauseText.setAttribute('style', 'color:lime;font:40px Verdana;');
    this.guiBox.insertAdjacentElement("afterbegin", pauseText);
  }

  /**
   * Game Over Screen 
   */
  gameOverScreen(){
    this.clearGUI();
    let gameOverText:HTMLLabelElement = document.createElement('LABEL') as HTMLLabelElement;
    gameOverText.innerText = "GAME OVER";
    gameOverText.setAttribute('style', 'color:lime;font:40px Verdana;');
    this.guiBox.insertAdjacentElement("afterbegin", gameOverText);
  }

  /**
   * Build GUI Box so I can use HTML for buttons, not canvas... canvas dom sucks
   */
  createGUI(): void {
    let canvasElem = window.document.getElementById('canvasElem');
    let guiOverlay = window.document.createElement("DIV");
    guiOverlay.id = "gui";
    guiOverlay.setAttribute('style', 'position:absolute;top:0;float:left; width:99%;height:99vh;text-align:center;z-index:5;');
    canvasElem.insertAdjacentElement("afterend", guiOverlay);
    this.guiBox = window.document.createElement('DIV');
    this.guiBox.id = "guiBox";
    this.guiBox.setAttribute('style', 'float:left;color:lime;margin-top:15%;height:50%;width:100%;text-align:center;');
    guiOverlay.insertAdjacentElement("afterbegin", this.guiBox);
  }

  clearGUI(){
    while (this.guiBox.firstChild) {
      this.guiBox.removeChild(this.guiBox.firstChild);
    }
  }

  getNewLineElem(height:number){
    let newDiv = document.createElement('DIV');
    newDiv.setAttribute('style', 'height:' + height + 'px;');
    return newDiv;
  }

  getButtonStyle(isHovering:boolean){
    if(isHovering){
      return 'color:black;font:20px Verdana;font-weight: 700;background-color:lime;border:2px solid lime;width:15%;height:50px;transition:.6s;cursor:pointer;box-shadow:0 0 25px lime;border-radius: 12px;';
    }
    return 'color:lime;font:20px Verdana;font-weight: 700;background-color:black;border:2px solid lime;width:15%;height:50px;transition:.3s;cursor:pointer;box-shadow:0 0 15px lime;border-radius: 12px;';
  }
}

export enum SCREEN_ACTIONS {
  SPLASH, PAUSE, GAME_OVER
}