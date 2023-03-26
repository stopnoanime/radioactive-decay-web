import { DebugElement, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { VisualizeComponent } from './visualize.component';

describe('VisualizeComponent', () => {
  let component: VisualizeComponent;
  let fixture: ComponentFixture<VisualizeComponent>;
  let debugEl: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VisualizeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VisualizeComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show particles', () => {
    component.startNewPlot = new BehaviorSubject({
      particles: 10,
      halfLife: 0,
    });
    fixture.detectChanges();

    expect(debugEl.queryAll(By.css('svg > *')).length).toBe(10);
    expect(debugEl.queryAll(By.css('svg > [fill="#36a2eb"]')).length).toBe(10);
  });

  it('should decay particles', () => {
    component.startNewPlot = new BehaviorSubject({
      particles: 10,
      halfLife: 0,
    });
    fixture.detectChanges();

    //Decay some particles
    component.ngOnChanges({
      numberOfParticles: new SimpleChange(10, 5, true),
    });
    fixture.detectChanges();
    expect(debugEl.queryAll(By.css('svg > [fill="#ff6384"]')).length).toBe(5);

    //Decay all particles
    component.ngOnChanges({
      numberOfParticles: new SimpleChange(5, 0, true),
    });
    fixture.detectChanges();
    expect(debugEl.queryAll(By.css('svg > [fill="#ff6384"]')).length).toBe(10);
  });
});
