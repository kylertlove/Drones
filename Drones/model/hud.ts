import { Player } from "./player";
import { Entity } from "./entity";
import { DifficultyLevel } from "../services/enum-manager";
import { CanvasShape, CanvasText } from "./CanvasMenuObjects";
import { DronesCanvas } from "../DronesCanvas";


export class Hud {
  showLevelText: string = "Level 1";
  textColor: string = "lime";
  guiBox: HTMLElement;
  constructor() {
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
  playerStats(canvas: CanvasRenderingContext2D, player: Player, kills: number, gameDifficulty: DifficultyLevel) {
    let difficultySaying;
    switch (gameDifficulty) {
        case DifficultyLevel.NORMAL:
      difficultySaying = "Difficulty: Noob";
        break;
        case DifficultyLevel.HARD:
      difficultySaying = "Difficulty: Normie";
        break;
        case DifficultyLevel.WUT:
        difficultySaying = "Difficulty: lol. wut r doin";
          break;
      default:
      difficultySaying = "";
        break;
    }
    let health = new CanvasText(`Health: ${player.health.toString()}`, (canvas.canvas.width / 40), (canvas.canvas.height - (canvas.canvas.height / 14)), this.textColor, "17px Jazz LET, fantasy");
    let KillsText = new CanvasText(`Kills: ${kills.toString()}`, (canvas.canvas.width / 40), (canvas.canvas.height - (canvas.canvas.height / 10)), this.textColor, "17px Jazz LET, fantasy");
    let level = new CanvasText(difficultySaying, (canvas.canvas.width / 40), (canvas.canvas.height - (canvas.canvas.height / 7)), this.textColor, "17px Jazz LET, fantasy");
    canvas.font = health.font;
    canvas.fillStyle = this.textColor;
    canvas.strokeStyle = this.textColor;
    canvas.textAlign = "left";
    canvas.fillText(health.word, health.x, health.y);
    canvas.fillText(KillsText.word, KillsText.x, KillsText.y);
    canvas.fillText(level.word, level.x, level.y);
  }

  /**
   * Draw Shield 
   */
  drawShieldTick(canvas: CanvasRenderingContext2D, shieldTick: number){
    let displayWidth = 250;
    let shieldBox = new CanvasShape((canvas.canvas.width / 2) - 125, (canvas.canvas.height - 50), displayWidth, 16);
    canvas.fillStyle = this.textColor;
    canvas.lineWidth = 2;
    canvas.strokeRect(shieldBox.x, shieldBox.y, shieldBox.w, shieldBox.h);
    let fillAmount = shieldTick / 10;
    fillAmount = fillAmount * displayWidth;
    //fillAmount = displayWidth - fillAmount;
    let shieldFill = new CanvasShape((canvas.canvas.width / 2) - 125, (canvas.canvas.height - 50), fillAmount, 16);
    canvas.fillStyle = 'rgba(0,225,0,0.5)';
    canvas.fillRect(shieldFill.x, shieldFill.y, shieldFill.w, shieldFill.h);
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
    startBtn.innerText = "START";
    startBtn.id = "startBtn";
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
  pauseScreen(Controller:DronesCanvas) {
    this.clearGUI();
    let pauseText:HTMLLabelElement = document.createElement('LABEL') as HTMLLabelElement;
    pauseText.innerText = "PAUSED";
    pauseText.setAttribute('style', 'color:lime;font:40px Verdana;');
    this.guiBox.insertAdjacentElement("afterbegin", pauseText);
    let newLine1 = this.getNewLineElem(15);
    pauseText.insertAdjacentElement("afterend", newLine1);

    let easyBtn:HTMLButtonElement = document.createElement('BUTTON') as HTMLButtonElement;
    easyBtn = this.setButtonStyles(easyBtn);
    easyBtn.onclick = () => {
      Controller.setDifficulty(1)
      easyBtn.blur();
    }
    easyBtn.innerText = "EASY";
    newLine1.insertAdjacentElement('afterend', easyBtn);
    let medBtn:HTMLButtonElement = document.createElement('BUTTON') as HTMLButtonElement;
    medBtn = this.setButtonStyles(medBtn);
    medBtn.onclick = () => {
      Controller.setDifficulty(2);
      medBtn.blur();
    }
    medBtn.innerText = "MEDIUM";
    easyBtn.insertAdjacentElement('afterend', medBtn);
    let hardBtn:HTMLButtonElement = document.createElement('BUTTON') as HTMLButtonElement;
    hardBtn = this.setButtonStyles(hardBtn);
    hardBtn.onclick = () => {
      Controller.setDifficulty(3);
      hardBtn.blur();
    }
    hardBtn.innerText = "HARD";
    medBtn.insertAdjacentElement('afterend', hardBtn);

    let newLine2 = this.getNewLineElem(20);
    hardBtn.insertAdjacentElement("afterend", newLine2);
    let volueBtn:HTMLButtonElement = document.createElement('BUTTON') as HTMLButtonElement;
    volueBtn = this.setButtonStyles(volueBtn);
    volueBtn.onclick = () => { 
      Controller.toggleVolume();
      volueBtn.blur();
     }
    volueBtn.innerText = "Play Music";
    newLine2.insertAdjacentElement('afterend', volueBtn);
  }

  /**
   * Game Over Screen 
   */
  gameOverScreen(Controller:DronesCanvas){
    this.clearGUI();
    let gameOverText:HTMLLabelElement = document.createElement('LABEL') as HTMLLabelElement;
    gameOverText.innerText = "GAME OVER";
    gameOverText.setAttribute('style', 'color:lime;font:40px Verdana;');
    let resetBtn:HTMLButtonElement = document.createElement('BUTTON') as HTMLButtonElement;
    resetBtn.innerText = "RESET";
    resetBtn.id = "resetBtn";
    resetBtn = this.setButtonStyles(resetBtn);
    resetBtn.onclick = () => {
      this.clearGUI();
      Controller.reset();
    }
    this.guiBox.insertAdjacentElement("afterbegin", gameOverText);
    let thirdLine = this.getNewLineElem(25);
    gameOverText.insertAdjacentElement("afterend", thirdLine);
    thirdLine.insertAdjacentElement("afterend", resetBtn);
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

  setButtonStyles(button:HTMLButtonElement) {
    button.setAttribute('style', this.getButtonStyle(false));
    button.onmouseover = () => {
      button.setAttribute('style', this.getButtonStyle(true));
    }
    button.onmouseleave = () => {
      button.setAttribute('style', this.getButtonStyle(false));
    }
    return button;
  }
}

