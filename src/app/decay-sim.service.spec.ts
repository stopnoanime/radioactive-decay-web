import { fakeAsync, flush, TestBed, tick } from '@angular/core/testing';

import { DecaySimService } from './decay-sim.service';

describe('DecaySimService', () => {
  let service: DecaySimService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DecaySimService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start', () => {
    spyOn(service.startNewPlotEvent, 'next');

    service.start(1, 1000);

    expect(service.running).toBeTrue();
    expect(service.particles).toBe(1000);

    //Start event should be emitted
    expect(service.startNewPlotEvent.next).toHaveBeenCalledOnceWith({
      halfLife: 1,
      particles: 1000,
    });
  });

  it('should stop', () => {
    service.start(1, 1000);
    expect(service.running).toBeTrue();

    service.stop();
    expect(service.running).toBeFalse();
  });

  it('should run', fakeAsync(() => {
    const eventSpy = spyOn(service.newDataPointEvent, 'next');
    service.start(1, 1000);

    expect(eventSpy).toHaveBeenCalledOnceWith({
      time: 0,
      particles: 1000,
    });

    // Wait for requestAnimationsFrame
    tick(16);

    expect(eventSpy).toHaveBeenCalledTimes(2);
    const secondCall = eventSpy.calls.all().at(1)?.args?.[0];
    expect(secondCall?.time).toBe(16);
    expect(secondCall?.particles).toBeLessThan(1000);
  }));
});
