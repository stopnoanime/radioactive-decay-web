import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Subject, Subscription } from 'rxjs';
import { dataPointType } from '../decay-sim.service';
import { Chart, Scale, CoreScaleOptions } from 'chart.js';
import AnnotationPlugin from 'chartjs-plugin-annotation';

@Component({
  selector: 'app-plot',
  templateUrl: './plot.component.html',
  styleUrls: ['./plot.component.scss'],
})
export class PlotComponent implements OnInit, OnDestroy {
  @Input() startNewPlot!: Subject<newPlotDataType>;
  @Input() newRealDataPoint!: Subject<dataPointType>;
  @Input() numberOfHalfTimesToDisplay = 6;

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  private predictedData: dataArray = [];
  private trueData: dataArray = [];
  private annotations: any = {};
  private lastXMax = Infinity;
  private lastPlotData!: newPlotDataType;

  private startNewPlotSubscription?: Subscription;
  private newRealDataPointSubscription?: Subscription;

  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        min: 0,
        ticks: {},
        title: {
          display: true,
          text: 'Time (s)',
        },
        afterUpdate: (axis) => this.onAxisUpdate(axis),
      },
      y: {
        min: 0,
        title: {
          display: true,
          text: 'Number of particles',
        },
      },
    },
    elements: {
      point: {
        radius: 0,
      },
    },

    plugins: {
      annotation: {
        annotations: this.annotations,
      },
    },
  };

  public chartData: ChartData<'line'> = {
    datasets: [
      {
        label: 'True decay',
        tension: 0.4,
        data: this.trueData,
      },
      {
        label: 'Predicted decay',
        tension: 0.4,
        data: this.predictedData,
      },
    ],
  };

  constructor() {
    Chart.register(AnnotationPlugin);
  }

  ngOnInit() {
    this.startNewPlotSubscription = this.startNewPlot.subscribe((v) => {
      this.lastPlotData = v;
      this.predictedData.length = 0;
      this.trueData.length = 0;

      const totalGraphTime = v.halfLife * this.numberOfHalfTimesToDisplay;
      (<any>this.chartOptions).scales.x.suggestedMax = totalGraphTime;
      (<any>this.chartOptions).scales.x.ticks.stepSize = v.halfLife;

      //Generate predicted decay graph with 100 data points
      this.plotPredicted(0, totalGraphTime, 100);

      this.chart?.ngOnChanges({});
    });

    this.newRealDataPointSubscription = this.newRealDataPoint.subscribe((v) => {
      this.trueData.push({ x: v.time / 1000, y: v.particles });
      this.addLines(v.time / 1000, v.particles);

      this.chart?.ngOnChanges({});
    });
  }

  ngOnDestroy(): void {
    this.startNewPlotSubscription?.unsubscribe();
    this.newRealDataPointSubscription?.unsubscribe();
  }

  private onAxisUpdate(axis: Scale<CoreScaleOptions>) {
    //Plot when new graph section appears
    if (axis.max > this.lastXMax) {
      this.plotPredicted(this.lastXMax, axis.max, 10);
    }
  }

  private addLines(x: number, y: number) {
    this.annotations.vertLine = {
      type: 'line',
      xMin: x,
      xMax: x,
      borderColor: '#ff6384',
      borderWidth: 1,
    };

    this.annotations.horLine = {
      type: 'line',
      yMin: y,
      yMax: y,
      borderColor: '#ff6384',
      borderWidth: 1,
    };
  }

  private addPredicted(time: number, halfLife: number, particles: number) {
    this.predictedData.push({
      x: time,
      y: particles / Math.pow(2, time / halfLife),
    });
  }

  private plotPredicted(from: number, to: number, steps: number) {
    const step = (to - from) / steps;
    for (let i = 0; i <= steps; i++) {
      this.addPredicted(
        from + i * step,
        this.lastPlotData.halfLife,
        this.lastPlotData.particles
      );
      this.lastXMax = to;
    }
  }
}

type dataArray = {
  x: number;
  y: number;
}[];

export type newPlotDataType = { halfLife: number; particles: number };
