import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Subject } from 'rxjs';
import { dataPointType } from '../decay-sim.service';

@Component({
  selector: 'app-plot',
  templateUrl: './plot.component.html',
  styleUrls: ['./plot.component.scss'],
})
export class PlotComponent implements OnInit {
  @Input() startNewPlot!: Subject<newPlotDatType>;
  @Input() newRealDataPoint!: Subject<dataPointType>;

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  private predictedData: dataArray = [];
  private trueData: dataArray = [];

  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    animation: false,
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        min: 0,
        max: 10,
      },
      y: {
        min: 0,
        max: 10,
      },
    },
  };

  public chartData: ChartData<'line'> = {
    datasets: [
      {
        label: 'Predicted decay',
        tension: 0.4,
        data: this.predictedData,
      },
      {
        label: 'True decay',
        tension: 0.4,
        data: this.trueData,
      },
    ],
  };

  ngOnInit() {
    this.startNewPlot.subscribe((v) => {
      this.predictedData.length = 0;
      this.trueData.length = 0;

      (<any>this.chartOptions).scales['x'].max = v.halfLife * 6;
      (<any>this.chartOptions).scales['y'].max = v.particles;

      this.chart?.ngOnChanges({});
    });

    this.newRealDataPoint.subscribe((v) => {
      this.trueData.push({ x: v.time / 1000, y: v.particles });
      this.chart?.update();
    });
  }
}

type dataArray = {
  x: number;
  y: number;
}[];

export type newPlotDatType = { halfLife: number; particles: number };
