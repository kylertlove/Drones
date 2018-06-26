import { ASSETS } from "./enum-manager";

//import {BehaviorSubject} from "../../node_modules/rxjs/BehaviorSubject";

export class AudioService {

  song: number = 0;
  musicVolume: number = .3;
  audioElem: HTMLAudioElement;
  missleElem: HTMLAudioElement;
  lazorElem: HTMLAudioElement;

  playlist: string[] = [
    ASSETS.PREPEND + "sounds/PatrickLieberkind-1.wav",
    ASSETS.PREPEND + "sounds/PatrickLieberkind-2.wav",
    ASSETS.PREPEND + "sounds/PatrickLieberkind-3.wav"
  ]

  constructor() {
    this.audioElem = new Audio();
    this.missleElem = new Audio();
    this.lazorElem = new Audio();
    this.audioElem.onended = () => {
      setTimeout(() => {
        this.next();
      }, 10000)
    };
   }

   /** Toggle Audio Pause/play */
   toggle(isPaused:boolean){
     if(isPaused){
      this.audioElem.pause();
     }else{
      this.audioElem.volume = this.musicVolume;
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
    this.audioElem.volume = this.musicVolume;
    this.audioElem.play();
   }

   _noiseFireMissile(){
     this.missleElem.pause();
     this.missleElem.src = ASSETS.PREPEND + "sounds/fireMissle.wav";
     this.missleElem.volume = .3;
     this.missleElem.play();
   }

   _noiseFireZeLazor(){
    this.lazorElem.pause();
    this.lazorElem.src = ASSETS.PREPEND + "sounds/laser.wav";
    this.lazorElem.volume = .02;
     this.lazorElem.play();
   }
}
