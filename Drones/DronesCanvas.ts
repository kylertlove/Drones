import { DronesManagerService } from "./services/drones-manager.service";
import { AudioService } from "./services/audio.service";


export class DronesCanvas {

    public CanvasObject: CanvasRenderingContext2D;
    public gameManager: DronesManagerService;
    private gameLoop: any;
    private lastTime = (new Date()).getTime();
    private deltaTime: number;
    private interval = 1000 / 30;
    private audioPause: boolean = false;
    private audioElement: HTMLAudioElement;
    private audioService: AudioService;

    constructor(public canvasElementName: HTMLCanvasElement) {
        this.CanvasObject = canvasElementName.getContext('2d');
        this.gameManager = new DronesManagerService();
        this.audioElement = new Audio();
        this.audioService = new AudioService();
    }

    start(){
        document.addEventListener('keydown', (e:KeyboardEvent) => {
            this.gameManager.keyChange(e.keyCode, true);
        });
        document.addEventListener('keyup', (e:KeyboardEvent) => {
            this.gameManager.keyChange(e.keyCode, false);
        });

        window.document.body.style.backgroundColor = 'black';
        /** Click event handler.  Use For canvas button handling */
        this.canvasElementName.addEventListener('click', (e) => {
          const pos = {
            x: e.clientX,
            y: e.clientY
          };
          //console.log(`posx: ${pos.x}, posy: ${pos.y}`)
          //do all checks for things that I can click on
          if(pos.x < 30 && pos.x > 0 && pos.y < 50 && pos.y > 0){
            this.audioPause = !this.audioPause;
            this.gameManager.audioControl(this.audioPause, this.audioService, this.audioElement);
          }
          if(pos.x < 60 && pos.x > 30 && pos.y < 50 && pos.y > 0){
            this.audioService.next(this.audioElement);
          }
        });
    
        const arr: number[] = this.getWindowSize();
        this.CanvasObject.canvas.width = arr[0] - 15;
        this.CanvasObject.canvas.height = arr[1] - 25;
    
        this.gameManager.GameOver = false;
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
      this.gameManager.menuBox(this.CanvasObject, "Paused");
    } else if (this.gameManager.GameOver) {
      //game over. Draw menu box
      this.gameManager.menuBox(this.CanvasObject, "Game Over");
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

  setDif(num: number) {
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
}