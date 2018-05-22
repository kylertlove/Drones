import { ASSETS } from "./asset-manager";

//import {BehaviorSubject} from "../../node_modules/rxjs/BehaviorSubject";

export class AudioService {

  song: number = 0;
  volume: number = .1;

  playlist: string[] = [
    ASSETS.PREPEND + "sounds/Blink.mp3",
    ASSETS.PREPEND + "sounds/getLucky.mp3",
    ASSETS.PREPEND + "sounds/trapqueen.mp3",
    ASSETS.PREPEND + "sounds/offspring.mp3"
  ]

  constructor() {
   }

   /** Toggle Audio Pause/play */
   toggle(isPaused:boolean, audioElem:HTMLAudioElement){
     if(isPaused){
      audioElem.pause();
     }else{
      audioElem.volume = this.volume;
       audioElem.play();
     }
   }

   next(audioElementName: HTMLAudioElement){
    this.song++;
    if(this.song >= this.playlist.length){
      this.song = 0;
    }
    audioElementName.pause();
    audioElementName.src = this.playlist[this.song];
    audioElementName.volume = this.volume;
    audioElementName.play();
   }
}
