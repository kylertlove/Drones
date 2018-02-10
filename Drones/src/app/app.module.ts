import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { DronesModule } from './drones/drones.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, DronesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
