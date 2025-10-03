import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-areas-periodos',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './areas-periodos.component.html',
  styleUrl: './areas-periodos.component.css'
})
export class AreasPeriodosComponent implements OnChanges {
  @Input() datos: any[] = [];
  public chartOptions: Partial<any> = {};
  public periodos: string[] = [];
  public periodoSeleccionado: string = '';
  
  constructor() {
    this.inicializarGrafico();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['datos'] && this.datos) {
      this.cargarPeriodos();
      this.actualizarGrafico();
    }
  }

  private cargarPeriodos(): void {
    this.periodos = [...new Set(this.datos.map(d => d.PERIODO))].sort();
    if (this.periodos.length > 0 && !this.periodoSeleccionado) {
      this.periodoSeleccionado = this.periodos[this.periodos.length - 1];
    }
  }

  public seleccionarPeriodo(periodo: string): void {
    this.periodoSeleccionado = periodo;
    this.actualizarGrafico();
  }

  private inicializarGrafico(): void {
    this.chartOptions = {
      series: [],
      chart: {
        type: 'bar',
        height: 450,
        toolbar: {
          show: true
        }
      },
      colors: ['#4ECDC4', '#FF6B6B', '#FFE66D'],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded'
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: number) {
          return val.toFixed(1);
        }
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      markers: {
        size: 4,
        hover: {
          size: 7
        }
      },
      grid: {
        show: true,
        borderColor: '#e5e7eb',
        strokeDashArray: 4
      },
      title: {
        text: 'Promedios por Área',
        align: 'center',
        style: {
          fontSize: '18px',
          fontWeight: 'bold'
        }
      },
      xaxis: {
        title: {
          text: 'Áreas'
        }
      },
      yaxis: {
        title: {
          text: 'Promedio'
        },
        min: 0,
        max: 100,
        labels: {
          formatter: (val: number) => val.toFixed(1)
        }
      },
      fill: {
        opacity: 0.9,  // Aumentamos la opacidad
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'vertical',
          shadeIntensity: 0.2,  // Reducimos la intensidad del degradado
          opacityFrom: 1,       // Opacidad completa arriba
          opacityTo: 0.8,       // Opacidad sutil abajo
          stops: [0, 90, 100]   // Ajustamos los puntos de parada del gradiente
        }
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: function(val: number) {
            return val.toFixed(1);
          }
        }
      }
    };
  }

  private actualizarGrafico(): void {
    if (!this.datos || this.datos.length === 0 || !this.periodoSeleccionado) return;

    // Filtrar datos del periodo seleccionado
    const datosPeriodo = this.datos.filter(d => d.PERIODO === this.periodoSeleccionado);

    // Obtener las áreas disponibles
    const areas = ['MATEMATICAS', 'LECTURA', 'NATURALES', 'SOCIALES', 'INGLES'];

    // Crear la serie de datos
    const seriesData = areas.map(area => {
      const promedios = datosPeriodo.map(d => Number(d[`PROM. ${area}`]));
      const promedio = promedios.reduce((a, b) => a + b, 0) / promedios.length;
      return promedio;
    });

    this.chartOptions = {
      ...this.chartOptions,
      series: [{
        name: `Periodo ${this.periodoSeleccionado}`,
        data: seriesData
      }],
      xaxis: {
        categories: areas,
        title: { text: 'Áreas' }
      },
      title: {
        text: `Promedios por Área - Periodo ${this.periodoSeleccionado}`,
        align: 'center'
      }
    };
  }
}
