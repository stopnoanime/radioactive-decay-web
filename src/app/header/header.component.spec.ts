import {
  Component,
  DebugElement,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { dataPointType } from '../decay-sim.service';
import { newPlotDataType } from '../plot/plot.component';
import { HeaderComponent } from './header.component';

@Component({
  selector: 'app-input-menu',
})
class MockInputMenuComponent {
  @Input() running?: boolean;
  @Output() stop = new EventEmitter<void>();
  @Output() start = new EventEmitter<newPlotDataType>();
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let debugEl: DebugElement;
  let mockInputMenu: MockInputMenuComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent, MockInputMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement;
    mockInputMenu = debugEl.query(
      By.directive(MockInputMenuComponent)
    ).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should pass data to/from InputMenuComponent', () => {
    //Running:
    fixture.detectChanges();
    expect(mockInputMenu.running).toBeFalse();

    component.running = true;
    fixture.detectChanges();
    expect(mockInputMenu.running).toBeTrue();

    //Start:
    spyOn(component.start, 'emit');
    mockInputMenu.start.emit({ halfLife: 1, particles: 1 });
    expect(component.start.emit).toHaveBeenCalledOnceWith({
      halfLife: 1,
      particles: 1,
    });

    //Stop:
    spyOn(component.stop, 'emit');
    mockInputMenu.stop.emit();
    expect(component.stop.emit).toHaveBeenCalledOnceWith();
  });

  it('should set ranAtLeastOnce on menu start event', () => {
    expect(component.ranAtLeastOnce).toBeFalse();

    mockInputMenu.start.emit();

    expect(component.ranAtLeastOnce).toBeTrue();
  });

  it('should show simulation data', () => {
    component.ranAtLeastOnce = true;
    component.newRealDataPoint = new BehaviorSubject<dataPointType>({
      time: 100,
      particles: 5555,
    });
    fixture.detectChanges();

    expect(debugEl.query(By.css('[data-test="particles"]'))).toBeTruthy();
    expect(debugEl.query(By.css('[data-test="time"]'))).toBeTruthy();

    expect(
      debugEl.query(By.css('[data-test="particles"]')).nativeElement.textContent
    ).toContain(5555);
    expect(
      debugEl.query(By.css('[data-test="time"]')).nativeElement.textContent
    ).toContain(100);
  });
});
