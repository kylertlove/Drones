import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DronesAudioComponent } from './drones-audio.component';

describe('DronesAudioComponent', () => {
  let component: DronesAudioComponent;
  let fixture: ComponentFixture<DronesAudioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DronesAudioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DronesAudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
