import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { InputMenuComponent } from './input-menu.component';

describe('InputMenuComponent', () => {
  let component: InputMenuComponent;
  let fixture: ComponentFixture<InputMenuComponent>;
  let debugEl: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputMenuComponent],
      imports: [MatInputModule, ReactiveFormsModule, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(InputMenuComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should output start event', () => {
    spyOn(component.start, 'emit');

    fixture.debugElement.query(By.css('button')).nativeElement.click();

    expect(component.start.emit).toHaveBeenCalledWith({
      halfLife: 1,
      particles: 1000,
    });
  });

  it('should output stop event', () => {
    component.running = true;

    spyOn(component.stop, 'emit');

    fixture.debugElement.query(By.css('button')).nativeElement.click();

    expect(component.stop.emit).toHaveBeenCalledOnceWith();
  });

  it('should disable form when sim is running', () => {
    expect(component.inputForm.disabled).toBeFalse();

    component.running = true;

    expect(component.inputForm.disabled).toBeTrue();
  });

  it('should disable button on invalid form value', () => {
    component.inputForm.patchValue({ particles: 0.1 });
    fixture.detectChanges();

    expect(
      fixture.debugElement.query(By.css('button')).properties['disabled']
    ).toBeTrue();
  });
});
