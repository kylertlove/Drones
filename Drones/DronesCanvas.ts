import { DronesManagerService } from "./services/drones-manager.service";
import { AudioService } from "./services/audio.service";
import { CanvasButton, CANVAS_BUTTON_NAME } from "./model/CanvasMenuObjects";
import { SCREEN_ACTIONS, Hud } from "./model/hud";


export class DronesCanvas {

  public CanvasObject: CanvasRenderingContext2D;
  public gameManager: DronesManagerService;
  private gameLoop: any;
  private lastTime = (new Date()).getTime();
  private deltaTime: number;
  private interval = 1000 / 30;
  private audioPause: boolean = false;
  private audioService: AudioService;
  private canvasButtonList: CanvasButton[] = [];
  private hud: Hud;

  constructor(public canvasElementName: HTMLCanvasElement) {
    this.CanvasObject = canvasElementName.getContext('2d');
    this.audioService = new AudioService();
    this.gameManager = new DronesManagerService(this.audioService);
  }

  init() {
    window.document.body.style.backgroundColor = 'black';
    const arr: number[] = this.getWindowSize();
    this.CanvasObject.canvas.width = arr[0] - 15;
    this.CanvasObject.canvas.height = arr[1] - 25;

    this.hud = this.gameManager.hud;
    this.buildCanvasGUI(SCREEN_ACTIONS.SPLASH);
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      this.gameManager.keyChange(e.keyCode, true);
    });
    document.addEventListener('keyup', (e: KeyboardEvent) => {
      this.gameManager.keyChange(e.keyCode, false);
    });
    /** Click event handler.  Use For canvas button handling */
    this.canvasElementName.addEventListener('click', (e) => {
      const pos = {
        x: e.clientX,
        y: e.clientY
      };
      //do all checks for things that I can click on
      //console.log(`Clicked: X: ${pos.x}, Y: ${pos.y}`)
      this.runButtonChecks(pos);
    });
  }

  start() {
    this.gameManager.GameOver = false;
    this.audioService.next();
    this.loop();
  }

  reset(){
    this.gameManager = null;
    this.gameLoop = null;
    this.gameManager = new DronesManagerService(this.audioService);
    this.audioService.next();
    this.lastTime = (new Date()).getTime();
    this.deltaTime = 0;
    this.interval = 1000 / 30;
    this.canvasButtonList = [];
    this.hud = this.gameManager.hud;
    this.loop();
  }

  /**
   * The Game Loop.
   * requestAnimationFrame passing the callback as the function.  
   * current time is now, delta time is the difference between now and the last current time
   * (How long does the loop take)
   */
  loop = () => {
    this.gameLoop = window.requestAnimationFrame(this.loop);
    let currentTime = (new Date()).getTime();
    this.deltaTime = (currentTime - this.lastTime) / 1000;

    if (!this.gameManager.pauseGame && !this.gameManager.GameOver) {
      //normal game loop, Clear -> update -> draw -> repeat
      this.CanvasObject.clearRect(0, 0, this.CanvasObject.canvas.width, this.CanvasObject.canvas.height);
      this.gameManager.update(this.CanvasObject, this.deltaTime);
      this.gameManager.draw(this.CanvasObject);
    } else if (this.gameManager.pauseGame) {
      //paused game.  Draw menu box
      this.buildCanvasGUI(SCREEN_ACTIONS.PAUSE);
    } else if (this.gameManager.GameOver) {
      //game over. Draw menu box
      this.buildCanvasGUI(SCREEN_ACTIONS.GAME_OVER);
    }
    this.lastTime = currentTime - (this.deltaTime % this.interval);
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
   * UNUSED RIGHT NOW
   * @param num 
   */
  setDifficulty(num: number) {
    switch (num) {
      case 1:
        this.gameManager.GAME_DIFFICULTY = .04;
        break;
      case 2:
        this.gameManager.GAME_DIFFICULTY = .07;
        break;
      case 3:
        this.gameManager.GAME_DIFFICULTY = .13;
        break;
      default:
        this.gameManager.GAME_DIFFICULTY = .07;
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
        this.hud.pauseScreen();
        break;
      case SCREEN_ACTIONS.GAME_OVER:
        this.hud.gameOverScreen();
        break;
    }

    //buttons that are always visible
    this.canvasButtonList.push(new CanvasButton(CANVAS_BUTTON_NAME.AUDIO_PLAY, 0, 0, 30, 50));
    this.canvasButtonList.push(new CanvasButton(CANVAS_BUTTON_NAME.NEXT, 30, 0, 30, 50));
  }

  runButtonChecks(pos) {
    this.canvasButtonList.forEach((btn: CanvasButton) => {
      switch (btn.name) {
        case CANVAS_BUTTON_NAME.AUDIO_PLAY:
          if (btn.isWithinBounds(pos.x, pos.y)) {
            this.audioPause = !this.audioPause;
            this.audioService.toggle(this.audioPause);
            this.hud.pauseVolume(this.audioPause);
          }
          break;
        case CANVAS_BUTTON_NAME.NEXT:
          if (btn.isWithinBounds(pos.x, pos.y)) {
            this.audioService.next();
          }
          break;
      }
    });
  }
}