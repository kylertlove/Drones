import { Component, OnInit, ViewChild, Input, Output } from '@angular/core';
import { AudioService } from '../services/audio.service';

@Component({
  selector: 'app-drones-audio',
  templateUrl: './drones-audio.component.html',
  styleUrls: ['./drones-audio.component.css']
})
export class DronesAudioComponent implements OnInit {

  audioElem: HTMLAudioElement;
  sourceElem: HTMLSourceElement;
  paused: Boolean;
  @ViewChild('audioTag') audioTag;
  @ViewChild('musicTag') musicTag;
  constructor(private audio: AudioService) {
  }

  ngOnInit() {
    this.audioElem = this.audioTag.nativeElement;
    this.sourceElem = this.musicTag.nativeElement;
    this.audioElem.volume = .1;
    this.nextSong();
    this.audio.isPaused.subscribe((res) => {
      this.paused = res;
      this.toggleMusic();
    });

    this.audioElem.onended = () => {
      this.nextSong();
      this.audioElem.play();
    }
  }

  nextSong() {
    console.log("next song");
    this.audioElem.pause();
    this.audioElem.src = this.audio.next();
    this.audioElem.play();
  }

  toggleMusic() {
    if (!this.paused) {
      this.audioElem.play();
    } else {
      this.audioElem.pause();
    }
  }
}
