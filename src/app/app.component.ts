import { Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { DecaySimService } from './decay-sim.service';
import { newPlotDataType } from './plot/plot.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(public sim: DecaySimService, private fb: FormBuilder) {}

  startNewPlot = new Subject<newPlotDataType>();

  inputForm = this.fb.group({
    particles: [1000],
    halfLife: [10],
  });

  startStop() {
    if (this.sim.running) this.sim.stop();
    else {
      if (!this.inputForm.valid) return;

      this.startNewPlot.next(this.inputForm.value as newPlotDataType);
      this.sim.start(
        this.inputForm.value.halfLife! * 1000,
        this.inputForm.value.particles!
      );
    }
  }
}
