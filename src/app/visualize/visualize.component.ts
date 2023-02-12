import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { Subject } from 'rxjs';
import { newPlotDataType } from '../plot/plot.component';

@Component({
  selector: 'app-visualize',
  templateUrl: './visualize.component.html',
  styleUrls: ['./visualize.component.scss'],
})
export class VisualizeComponent implements OnChanges, OnInit {
  lastDecayedParticleIndex = 0;
  particlesMultiplier = 1;
  particles: { x: number; y: number; decayed: boolean }[] = [];

  @Input() startNewPlot!: Subject<newPlotDataType>;
  @Input() numberOfParticles!: number;
  @Input() maxNumberOfParticles: number = 250;

  ngOnInit() {
    this.startNewPlot.subscribe((v) => {
      this.particles = [
        ...Array(Math.min(v.particles, this.maxNumberOfParticles)),
      ].map((_) => ({ x: Math.random(), y: Math.random(), decayed: false }));
      this.particlesMultiplier =
        v.particles > this.maxNumberOfParticles
          ? this.maxNumberOfParticles / v.particles
          : 1;
      this.lastDecayedParticleIndex = 0;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['numberOfParticles']) return;

    this.markDecayedParticles(changes['numberOfParticles'].currentValue);
  }

  markDecayedParticles(notDecayedParticles: number) {
    const amountToDecay = Math.floor(
      this.particles.length - notDecayedParticles * this.particlesMultiplier
    );

    for (let i = this.lastDecayedParticleIndex; i < amountToDecay; i++) {
      this.particles[i].decayed = true;
      this.lastDecayedParticleIndex = i;
    }
  }
}
