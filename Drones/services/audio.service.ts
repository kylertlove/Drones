import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AudioService {

  isPaused = new BehaviorSubject<Boolean>(false);
  song: number = 0;

  playlist: string[] = [
    "/assets/sounds/Blink.mp3",
    "/assets/sounds/getLucky.mp3",
    "/assets/sounds/trapqueen.mp3",
    "/assets/sounds/offspring.mp3"
  ]

  constructor() {
   }

   /** Toggle Audio Pause/play */
   toggle(isPaused){
     this.isPaused.next(isPaused);
   }

   next(){
    this.song++;
    if(this.song >= this.playlist.length){
      this.song = 0;
    }
    return this.playlist[this.song];
   }
}
