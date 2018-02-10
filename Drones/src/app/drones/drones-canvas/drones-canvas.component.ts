import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { DronesManagerService } from '../services/drones-manager.service';
import { AudioService } from '../services/audio.service';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-drones-canvas',
  templateUrl: './drones-canvas.component.html',
  styleUrls: ['./drones-canvas.component.css']
})
export class DronesCanvasComponent implements OnInit, OnDestroy {

  canvasElem: CanvasRenderingContext2D;
  gameLoop;
  private lastTime = (new Date()).getTime();
  private deltaTime:number;
  private interval = 1000/30;
  manager: DronesManagerService;
  @ViewChild('myCanvas') myCanvas;
  audioPause: Boolean = false;

  constructor(private audio: AudioService) {
    this.manager = new DronesManagerService(audio);
    window.onresize = () => {
        const arr: number[] = this.getWindowSize();
        this.canvasElem.canvas.width = arr[0] - 50;
        this.canvasElem.canvas.height = arr[1] - 80;
    }
   }

   @HostListener('window:keydown', ['$event'])
   keyEvent(event: KeyboardEvent) {
      this.manager.keyChange(event.keyCode, true);
   }

   @HostListener('window:keyup', ['$event'])
   keyEvents(event: KeyboardEvent) {
      this.manager.keyChange(event.keyCode, false);
   }

 /** Initialize page. Build canvas.  */
  ngOnInit() {
    window.document.body.style.backgroundColor = 'black';
    const canvas = this.myCanvas.nativeElement;
    this.canvasElem = canvas.getContext('2d');
    /** Click event handler.  Use For canvas button handling */
    canvas.addEventListener('click', (e) => {
      const pos = {
        x: e.clientX,
        y: e.clientY
      };
      //do all checks for things that I can click on
      if(pos.x < 60 && pos.y < 60){
        this.audioPause = !this.audioPause;
        this.manager.audioControl(this.audioPause);
      }
    });

    const arr: number[] = this.getWindowSize();
    this.canvasElem.canvas.width = arr[0] - 50;
    this.canvasElem.canvas.height = arr[1] - 80;

    this.manager.GameOver = false;
    this.loop();
  }

  /**
   * If you leave the page, Stop the gameloop
   */
  ngOnDestroy(): void {
    window.cancelAnimationFrame(this.gameLoop);
    window.document.body.style.backgroundColor = 'white';
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
    
    if (!this.manager.pauseGame && !this.manager.GameOver) {
      //normal game loop, Clear -> update -> draw -> repeat
      this.canvasElem.clearRect(0, 0, this.canvasElem.canvas.width, this.canvasElem.canvas.height);
      this.manager.update(this.canvasElem, this.deltaTime);
      this.manager.draw(this.canvasElem);
    } else if (this.manager.pauseGame) {
      //paused game.  Draw menu box
      this.manager.menuBox(this.canvasElem, "Paused");
    } else if (this.manager.GameOver) {
      //game over. Draw menu box
      this.manager.menuBox(this.canvasElem, "Game Over");
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
        this.manager.GAME_DIFFICULTY = .04;
        break;
      case 2:
        this.manager.GAME_DIFFICULTY = .07;
        break;
      case 3:
        this.manager.GAME_DIFFICULTY = .13;
        break;
      default:
        this.manager.GAME_DIFFICULTY = .07;
        break;
    }
    this.manager.playerRoF = 0;
    this.myCanvas.focus;
  }
}
