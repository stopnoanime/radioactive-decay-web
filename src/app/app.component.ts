import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { DecaySimService } from './decay-sim.service';
import { newPlotDataType } from './plot/plot.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(public sim: DecaySimService) {}

  startNewPlot = new Subject<newPlotDataType>();
}
