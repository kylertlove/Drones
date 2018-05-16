import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DronesCanvasComponent } from './drones-canvas.component';

describe('DronesCanvasComponent', () => {
  let component: DronesCanvasComponent;
  let fixture: ComponentFixture<DronesCanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DronesCanvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DronesCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
