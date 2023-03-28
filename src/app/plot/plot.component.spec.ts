import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgChartsModule } from 'ng2-charts';
import { BehaviorSubject, Subject } from 'rxjs';
import { dataArray, PlotComponent } from './plot.component';

describe('PlotComponent', () => {
  let component: PlotComponent;
  let fixture: ComponentFixture<PlotComponent>;
  let debugEl: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlotComponent],
      imports: [NgChartsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PlotComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement;

    component.startNewPlot = new Subject();
    component.newRealDataPoint = new Subject();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.chart).toBeTruthy();
  });

  it('should plot predicted graph', () => {
    component.numberOfHalfTimesToDisplay = 2;
    component.startNewPlot.next({ halfLife: 1, particles: 1000 });

    expect(component.predictedData.length).toBe(
      component.predictedGraphResolution + 1
    );

    //First data point
    expect(component.predictedData[0].x).toBe(0);
    expect(component.predictedData[0].y).toBe(1000);

    //After one sec there should be half of particles
    expect(component.predictedData[50].x).toBe(1);
    expect(component.predictedData[50].y).toBe(500);
  });

  it('should plot real graph', () => {
    component.newRealDataPoint.next({ time: 0, particles: 1000 });
    component.newRealDataPoint.next({ time: 100, particles: 500 });

    expect(component.trueData.length).toBe(2);
    expect(component.trueData[0]).toEqual({ x: 0, y: 1000 });
    expect(component.trueData[1]).toEqual({ x: 0.1, y: 500 });

    //It also should draw lines showing last data point
    expect(component.annotations.vertLine.xMin).toBe(0.1);
    expect(component.annotations.horLine.yMin).toBe(500);
  });

  it('should cleanup old true data on new plot', () => {
    component.startNewPlot.next({ halfLife: 1, particles: 1000 });

    //Old data that should be deleted:
    component.newRealDataPoint.next({ time: 0, particles: 1000 });
    component.newRealDataPoint.next({ time: 100, particles: 500 });

    expect(component.trueData.length).toBe(2);

    component.startNewPlot.next({ halfLife: 1, particles: 1000 });

    expect(component.trueData.length).toBe(0);
  });
});
