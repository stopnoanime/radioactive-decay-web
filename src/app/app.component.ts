import { Component } from '@angular/core';
import { DecaySimService } from './decay-sim.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(public sim: DecaySimService) {}
}
