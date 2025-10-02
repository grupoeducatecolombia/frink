import { Component, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule, ApexAxisChartSeries, ApexChart, ChartComponent, ApexDataLabels, ApexPlotOptions, ApexYAxis, ApexTitleSubtitle, ApexXAxis, ApexFill } from "ng-apexcharts";
import Swal, { SweetAlertResult } from "sweetalert2";


// TABLAS

export type ChartOptions = {
  series: ApexAxisChartSeries |ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
};
@Component({
  selector: 'app-desviacion',
  standalone: true,
  imports: [CommonModule,NgApexchartsModule],  // 👈 aquí
  templateUrl: './desviacion.component.html',
  styleUrl: './desviacion.component.css'
})
export class DesviacionComponent {
  @ViewChild("chart") chart: ChartComponent | null = null;
  public chartOptions: Partial<ChartOptions> = {};

  constructor(){
    // this.limpiarAnios()
    // this.periodos = []
    this.chartOptions = {
      series: [{ name: 'Ventas', data: [] }],
      chart: { type: 'bar', height: 350 },
      dataLabels: { enabled: true },
      yaxis: {title: {text:'cargando...'}},
      title: { text: 'cargando...', align: 'center' },
      xaxis: { categories: [] },
      tooltip: {
        y: {
          formatter: (val) => val.toFixed(2) // tooltip también con 2 decimales
        }
      },
      fill: { type: 'solid' } // ✅ inicializado
    };
  }
}
