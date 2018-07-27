import { DronesManagerService } from "./services/drones-manager.service";
import { AudioService } from "./services/audio.service";
import { CanvasShape } from "./model/CanvasMenuObjects";
import { SCREEN_ACTIONS, Hud } from "./model/hud";
import { DifficultyLevel } from "./services/enum-manager";


export class DronesCanvas {

  public CanvasObject: CanvasRenderingContext2D;
  public gameManager: DronesManagerService;
  private gameLoop: any;
  private currentTime = (new Date()).getTime();
  private lastTime = (new Date()).getTime();
  private deltaTime: number;
  private interval = 1000 / 30;
  private audioPause: boolean = false;
  private audioService: AudioService;
  private canvasButtonList: CanvasShape[] = [];
  private hud: Hud;

  constructor(public canvasElementName: HTMLCanvasElement) {
    this.CanvasObject = canvasElementName.getContext('2d');
    this.gameManager = new DronesManagerService();
    this.audioService = this.gameManager.soundService;
  }

  init() {
    window.document.body.style.backgroundColor = 'black';
    const arr: number[] = this.getWindowSize();
    this.CanvasObject.canvas.width = arr[0] - 15;
    this.CanvasObject.canvas.height = arr[1] - 25;
    this.hud = this.gameManager.hud;
    this.hud.setCanvasHandler(this);
    this.buildCanvasGUI(SCREEN_ACTIONS.SPLASH);
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      this.gameManager.keyChange(e.keyCode, true);
    });
    document.addEventListener('keyup', (e: KeyboardEvent) => {
      this.gameManager.keyChange(e.keyCode, false);
      if(e.keyCode === 13) {
        if(this.gameManager.pauseGame){
          this.buildCanvasGUI(SCREEN_ACTIONS.PAUSE);
        } else {
          this.hud.clearGUI();
          this.loop();
        }
      }
    });
    window.addEventListener('resize', () => {
      const arr: number[] = this.getWindowSize();
      this.CanvasObject.canvas.width = arr[0] - 15;
      this.CanvasObject.canvas.height = arr[1] - 25;
    });
    /** Click event handler.  Use For canvas button handling */
    this.canvasElementName.addEventListener('click', (e) => {
      const pos = {
        x: e.clientX,
        y: e.clientY
      };
    });
  }

  start() {
    this.gameManager.GameOver = false;
    this.audioService.next();
    this.loop();
  }

  reset(){
    window.cancelAnimationFrame(this.gameLoop);
    this.gameManager = new DronesManagerService();
    this.buildCanvasGUI(SCREEN_ACTIONS.SPLASH);
  }

  /**
   * The Game Loop.
   * requestAnimationFrame passing the callback as the function.  
   * current time is now, delta time is the difference between now and the last current time
   * (How long does the loop take)
   */
  loop = () => {
    if (!this.gameManager.GameOver && !this.gameManager.pauseGame) {
      this.gameLoop = window.requestAnimationFrame(this.loop);
      let currentTime = (new Date()).getTime();
      this.deltaTime = (currentTime - this.lastTime) / 1000;
      if(this.deltaTime > .2) {
        this.deltaTime = .018;
      }
      //normal game loop, Clear -> update -> draw -> repeat
      this.CanvasObject.clearRect(0, 0, this.CanvasObject.canvas.width, this.CanvasObject.canvas.height);
      this.gameManager.update(this.CanvasObject, this.deltaTime);
      this.gameManager.draw(this.CanvasObject);
      this.lastTime = currentTime - (this.deltaTime % this.interval);
    } else if (this.gameManager.GameOver) {
      //game over. Draw menu box
      this.buildCanvasGUI(SCREEN_ACTIONS.GAME_OVER);
    }
  }

  /**
   * Function called to get Window Size of page.  
   */
  getWindowSize() {
    let myWidth = 0,
      myHeight = 0;
    if (typeof (window.innerWidth) === 'number') {
      // everything outside of IE
      myWidth = window.innerWidth;
      myHeight = window.innerHeight;
    } else if (document.documentElement &&
      (document.documentElement.clientWidth ||
        document.documentElement.clientHeight)) {
      // IE 6+ in 'standards compliant mode'... whatever that means
      myWidth = document.documentElement.clientWidth;
      myHeight = document.documentElement.clientHeight;
    } else if (document.body &&
      (document.body.clientWidth ||
        document.body.clientHeight)) {
      // IE 4 compatible... blow it up cause you should never use it
      myWidth = document.body.clientWidth;
      myHeight = document.body.clientHeight;
    }
    return [myWidth, myHeight];
  }

  /**
   * Pause Menu - Difficulty selection update
   * @param num 
   */
  
  setDifficulty(num: number) {
    switch (num) {
      case 1:
        this.gameManager.GAME_DIFFICULTY = DifficultyLevel.EASYPEASY;
        break;
      case 2:
        this.gameManager.GAME_DIFFICULTY = DifficultyLevel.NORMAL;
        break;
      case 3:
        this.gameManager.GAME_DIFFICULTY = DifficultyLevel.HARD;
        break;
      default:
        this.gameManager.GAME_DIFFICULTY = DifficultyLevel.NORMAL;
        break;
    }
    this.gameManager.playerRoF = 0;
    this.canvasElementName.focus;
  }

  /**
   * Builds buttons
   */
  buildCanvasGUI(screen: SCREEN_ACTIONS) {
    this.canvasButtonList = [];
    switch (screen) {
      case SCREEN_ACTIONS.SPLASH:
        this.hud.splashScreen(this);
        break;
      case SCREEN_ACTIONS.PAUSE:
        this.hud.pauseScreen(this);
        break;
      case SCREEN_ACTIONS.GAME_OVER:
        this.hud.gameOverScreen(this);
        break;
    }

    //buttons that are always visible
    // this.canvasButtonList.push(new CanvasButton(CANVAS_BUTTON_NAME.AUDIO_PLAY, 0, 0, 30, 50));
    // this.canvasButtonList.push(new CanvasButton(CANVAS_BUTTON_NAME.NEXT, 30, 0, 30, 50));
  }

  // runButtonChecks(pos) {
  //   this.canvasButtonList.forEach((btn: CanvasButton) => {
  //     switch (btn.name) {
  //       case CANVAS_BUTTON_NAME.AUDIO_PLAY:
  //         if (btn.isWithinBounds(pos.x, pos.y)) {
  //           this.audioPause = !this.audioPause;
  //           this.audioService.toggle(this.audioPause);
  //           this.hud.pauseVolume(this.audioPause);
  //         }
  //         break;
  //       case CANVAS_BUTTON_NAME.NEXT:
  //         if (btn.isWithinBounds(pos.x, pos.y)) {
  //           this.audioService.next();
  //         }
  //         break;
  //     }
  //   });
  //}
}