import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { newPlotDataType } from '../plot/plot.component';

@Component({
  selector: 'app-input-menu',
  templateUrl: './input-menu.component.html',
  styleUrls: ['./input-menu.component.scss'],
})
export class InputMenuComponent {
  inputForm = this.fb.group({
    particles: [1000],
    halfLife: [1],
  });

  _running = false;
  @Input() set running(value: boolean) {
    this._running = value;
    value ? this.inputForm.disable() : this.inputForm.enable();
  }

  @Output() stop = new EventEmitter<void>();
  @Output() start = new EventEmitter<newPlotDataType>();

  constructor(private fb: FormBuilder) {}

  startStop() {
    if (this._running) this.stop.emit();
    else {
      if (!this.inputForm.valid) return;

      this.start.emit(this.inputForm.value as newPlotDataType);
    }
  }
}
