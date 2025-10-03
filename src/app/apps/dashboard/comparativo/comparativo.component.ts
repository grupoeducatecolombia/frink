import { Component, ViewChild, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule, ApexAxisChartSeries, ApexChart, ChartComponent, ApexDataLabels, ApexPlotOptions, ApexYAxis, ApexTitleSubtitle, ApexXAxis, ApexFill } from "ng-apexcharts";
import Swal, { SweetAlertResult } from "sweetalert2";
import { ChartOptions } from '../../../models/chart/chart-option';

// TABLAS

@Component({
  selector: 'app-comparativo',
  standalone: true,
  imports: [CommonModule,NgApexchartsModule],  // 👈 aquí
  templateUrl: './comparativo.component.html',
  styleUrl: './comparativo.component.css'
})
export class ComparativoComponent {
  @Input() datos: any[] = [];
  @ViewChild("chart") chart: ChartComponent | null = null;
  public chartOptions: Partial<ChartOptions> = {
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
    colors: ['#4ECDC4', '#FF6B6B', '#FFE66D'], // Mismos colores que desviación
    stroke: {
      width: [2, 3, 2],
      curve: 'smooth'
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.5,
        gradientToColors: undefined,
        inverseColors: false,
        opacityFrom: 0.8,
        opacityTo: 0
      }
    }
  };

  constructor(){
    // this.limpiarAnios()
    // this.periodos = []
  }

}
