import { Injectable } from '@angular/core';
import { animationFrameScheduler, Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DecaySimService {
  private _running = false;
  public get running() {
    return this._running;
  }

  private _particles = 0;
  public get particles() {
    return this._particles;
  }

  public newDataPointEvent = new Subject<dataPointType>();

  /** Particle lifetime in milliseconds */
  private lifetime = 0;

  private simSubscription!: Subscription;
  private lastTime!: number;
  private simulationTime!: number;

  /**
   * @param halfTime Substance half time in seconds
   * @param particles Number of particles to start simulation with
   */
  public start(halfTime: number, particles: number) {
    if (this._running) return;

    this.lifetime = (halfTime * 1000) / Math.log(2);
    this._particles = particles;

    this._running = true;
    this.simulationTime = 0;
    this.lastTime = Date.now();
    this.runLoop();
  }

  public stop() {
    this._running = false;
    this.simSubscription.unsubscribe();
  }

  private runLoop() {
    const currentTime = Date.now();

    //Limit deltaTime to 0.05s, useful if user leaves page during animation
    const deltaTime = Math.min(currentTime - this.lastTime, 1000 / 20);

    this.lastTime = currentTime;
    this.simulationTime += deltaTime;

    const decayProbability = deltaTime / this.lifetime;

    for (let i = 0; i < this.particles; i++) {
      // Particle decays
      if (Math.random() < decayProbability) {
        this._particles--;
      }
    }

    this.newDataPointEvent.next({
      time: this.simulationTime,
      particles: this.particles,
    });

    if (this.particles == 0) {
      this._running = false;
      return;
    }

    this.simSubscription = animationFrameScheduler.schedule(() =>
      this.runLoop()
    );
  }
}

export type dataPointType = { time: number; particles: number };
