import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DronesCanvasComponent } from './drones-canvas/drones-canvas.component';
import { RouterModule, Routes } from '@angular/router';
import { DronesManagerService } from './services/drones-manager.service';
import { FormsModule } from '@angular/forms';
import { DronesAudioComponent } from './drones-audio/drones-audio.component';
import { AudioService } from './services/audio.service';

const routes: Routes = [
  {path: '', redirectTo: 'main', pathMatch: 'full'},
  {path: 'main', component: DronesCanvasComponent}
]

@NgModule({
  imports: [
    CommonModule, RouterModule.forChild(routes), FormsModule
  ],
  declarations: [DronesCanvasComponent, DronesAudioComponent],
  exports: [DronesCanvasComponent, DronesAudioComponent],
  providers: [DronesManagerService, AudioService]
})
export class DronesModule { }
