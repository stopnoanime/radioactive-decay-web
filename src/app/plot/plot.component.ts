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
  @Input() numberOfHalfTimesToDisplay = 6;

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
    elements: {
      point: {
        radius: 0,
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

  ngOnInit() {
    this.startNewPlot.subscribe((v) => {
      this.predictedData.length = 0;
      this.trueData.length = 0;

      const totalGraphTime = v.halfLife * this.numberOfHalfTimesToDisplay;

      (<any>this.chartOptions).scales['x'].max = totalGraphTime;
      (<any>this.chartOptions).scales['y'].max = v.particles;

      //Generate predicted decay graph with 100 data points
      for (let i = 0; i <= totalGraphTime + 0.1; i += totalGraphTime / 100) {
        this.predictedData.push({
          x: i,
          y: v.particles / Math.pow(2, i / v.halfLife),
        });
      }

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
