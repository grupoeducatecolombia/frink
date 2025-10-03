import { Component, Input, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule, ChartComponent } from 'ng-apexcharts';

@Component({
  selector: 'app-desviacion',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './desviacion.component.html',
  styleUrl: './desviacion.component.css'
})
export class DesviacionComponent implements OnChanges {
  @Input() datos: any[] = [];
  @ViewChild("chart") chart: ChartComponent | null = null;
  public chartOptions: Partial<any> = {};
  public periodos: string[] = [];
  public areas: string[] = ['MATEMATICAS', 'LECTURA', 'NATURALES', 'SOCIALES', 'INGLES'];
  public areaSeleccionada: string = 'MATEMATICAS';

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
  }

  seleccionarArea(area: string): void {
    this.areaSeleccionada = area;
    this.actualizarGrafico();
  }

  getPromedioActual(): number | null {
    const ultimoPeriodo = this.periodos[this.periodos.length - 1];
    const ultimoDato = this.datos.find(d => d.PERIODO === ultimoPeriodo);
    return ultimoDato ? Number(ultimoDato[`PROM. ${this.areaSeleccionada}`]) : null;
  }

  getDesviacionActual(): number | null {
    const ultimoPeriodo = this.periodos[this.periodos.length - 1];
    const ultimoDato = this.datos.find(d => d.PERIODO === ultimoPeriodo);
    return ultimoDato ? Number(ultimoDato[`DESV. ${this.areaSeleccionada}`]) : null;
  }

  getRangoActual(): string {
    const promedio = this.getPromedioActual();
    const desviacion = this.getDesviacionActual();
    if (promedio === null || desviacion === null) return '-';
    return `${(promedio - desviacion).toFixed(1)} - ${(promedio + desviacion).toFixed(1)}`;
  }

  private inicializarGrafico(): void {
    this.chartOptions = {
      series: [],
      chart: {
        type: 'line',
        height: 450,
        zoom: {
          enabled: false,
          autoScaleYaxis: false
        },
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: false,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            reset: false
          }
        }
      },
      colors: ['#FF6B6B', '#4ECDC4', '#FFE66D'],
      stroke: {
        width: [2, 3, 2],
        curve: 'smooth'
      },
      markers: {
        size: [4, 5, 4]
      },
      title: {
        text: 'Análisis de Desviación',
        align: 'center'
      },
      legend: {
        position: 'top'
      },
      yaxis: {
        title: { text: 'Promedio' },
        min: 0,
        max: 100
      }
    };
  }

  private actualizarGrafico(): void {
    if (!this.datos || this.datos.length === 0) return;

    const promedios = this.periodos.map(periodo => {
      const datoPeriodo = this.datos.find(d => d.PERIODO === periodo);
      if (!datoPeriodo) return null;

      const promedio = Number(datoPeriodo[`PROM. ${this.areaSeleccionada}`]);
      const desviacion = Number(datoPeriodo[`DESV. ${this.areaSeleccionada}`]);

      return {
        periodo,
        promedio,
        superior: promedio + desviacion,
        inferior: promedio - desviacion
      };
    }).filter(dato => dato !== null);

    this.chartOptions = {
      ...this.chartOptions,
      series: [
        {
          name: 'Límite Superior',
          data: promedios.map(p => p?.superior)
        },
        {
          name: 'Promedio',
          data: promedios.map(p => p?.promedio)
        },
        {
          name: 'Límite Inferior',
          data: promedios.map(p => p?.inferior)
        }
      ],
      xaxis: {
        categories: this.periodos,
        title: { text: 'Periodo' }
      },
      title: {
        text: `Análisis de ${this.areaSeleccionada}`,
        align: 'center'
      },
      tooltip: {
        shared: true,
        y: {
          formatter: (val: number) => val.toFixed(1)
        }
      }
    };
  }
}
