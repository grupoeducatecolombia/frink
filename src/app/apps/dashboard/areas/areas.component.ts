import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule, ChartComponent } from 'ng-apexcharts';
import { AreasPeriodosComponent } from './areas-periodos/areas-periodos.component';

@Component({
  selector: 'app-areas',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule, AreasPeriodosComponent],
  templateUrl: './areas.component.html',
  styleUrl: './areas.component.css'
})
export class AreasComponent implements OnChanges {
  @Input() datos: any[] = [];
  @ViewChild('chart') chart: ChartComponent | undefined;
  
  public chartOptions: Partial<any> = {};
  public areas: string[] = ['MATEMATICAS', 'LECTURA', 'NATURALES', 'SOCIALES', 'INGLES'];
  public areaSeleccionada: string = 'PROM. MATEMATICAS'; // Cambiado para incluir el prefijo
  public areasbotonSeccionado: string = 'MATEMATICAS';
  public datosfiltrados: any[] = [];

  constructor() {
    this.inicializarGrafico();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['datos'] && this.datos) {
      console.log('Datos recibidos:', this.datos); // Debug
      this.datosfiltrados = [...this.datos];
      this.graficoComparativo();
    }
  }

  seleccionarArea(area: string): void {
    this.areasbotonSeccionado = area;
    this.areaSeleccionada = `PROM. ${area}`;
    console.log('Área seleccionada:', this.areaSeleccionada); // Debug
    this.graficoComparativo();
  }

  private inicializarGrafico(): void {
    this.chartOptions = {
      series: [],
      chart: {
        type: 'area',
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
      colors: ['#4ECDC4', '#FF6B6B', '#FFE66D'],
      stroke: {
        curve: 'smooth',
        width: 3
      },
      markers: {
        size: 4,
        hover: {
          size: 7,
          sizeOffset: 3
        }
      },
      fill: {
        opacity: 0.9,
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'vertical',
          shadeIntensity: 0.2,
          opacityFrom: 1,
          opacityTo: 0.8,
          stops: [0, 90, 100]
        }
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => val.toFixed(1)
      },
      yaxis: {
        title: { text: 'Promedio' },
        min: 0,
        max: 100,
        labels: {
          formatter: (val: number) => val.toFixed(1)
        }
      },
      xaxis: {
        type: 'category',
        title: { text: 'Periodos' }
      }
    };
  }

  graficoComparativo(): void {
    if (!this.datos || !this.areaSeleccionada) {
      return;
    }

    console.log('Generando gráfico para:', this.areaSeleccionada);

    // Obtener periodos únicos
    const periodos = [...new Set(this.datos.map(d => d.PERIODO))].sort();
    
    // Obtener datos del área seleccionada
    const promedios = periodos.map(periodo => {
      const datoPeriodo = this.datos.find(d => d.PERIODO === periodo);
      return datoPeriodo ? Number(datoPeriodo[this.areaSeleccionada]) : null;
    });

    console.log('Datos procesados:', {
      periodos,
      promedios
    });

    // Actualizar el gráfico
    this.chartOptions = {
      ...this.chartOptions,
      series: [{
        name: this.areasbotonSeccionado,
        data: promedios
      }],
      xaxis: {
        categories: periodos,
        title: { text: 'Periodos' }
      },
      title: {
        text: `Evolución de ${this.areasbotonSeccionado}`,
        align: 'center'
      }
    };

    // Forzar actualización del gráfico
    if (this.chart) {
      this.chart.updateOptions(this.chartOptions);
    }
  }
}
