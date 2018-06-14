import { ASSETS } from "./asset-manager";

//import {BehaviorSubject} from "../../node_modules/rxjs/BehaviorSubject";

export class AudioService {

  song: number = 0;
  volume: number = .1;
  audioElem: HTMLAudioElement;

  playlist: string[] = [
    ASSETS.PREPEND + "sounds/Blink.mp3",
    ASSETS.PREPEND + "sounds/getLucky.mp3",
    ASSETS.PREPEND + "sounds/trapqueen.mp3",
    ASSETS.PREPEND + "sounds/offspring.mp3"
  ]

  constructor() {
    this.audioElem = new Audio();
    this.audioElem.onended = () => {
      this.next();
    };
   }

   /** Toggle Audio Pause/play */
   toggle(isPaused:boolean){
     if(isPaused){
      this.audioElem.pause();
     }else{
      this.audioElem.volume = this.volume;
      this.audioElem.play();
     }
   }

   next(){
    this.song++;
    if(this.song >= this.playlist.length){
      this.song = 0;
    }
    this.audioElem.pause();
    this.audioElem.src = this.playlist[this.song];
    this.audioElem.volume = this.volume;
    this.audioElem.play();
   }
}
