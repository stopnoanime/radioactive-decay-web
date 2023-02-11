import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { dataPointType } from '../decay-sim.service';
import { newPlotDataType } from '../plot/plot.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  ranAtLeastOnce = false;

  @Input() running: boolean = false;
  @Input() newRealDataPoint!: Subject<dataPointType>;

  @Output() stop = new EventEmitter<void>();
  @Output() start = new EventEmitter<newPlotDataType>();
}
