import { Component, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule, ApexAxisChartSeries, ApexChart, ChartComponent, ApexDataLabels, ApexPlotOptions, ApexYAxis, ApexTitleSubtitle, ApexXAxis, ApexFill, ApexTooltip } from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
  stroke: any;
  toolbar: any;
  markers: any;
  grid: any;
  colors: string[];
};

@Component({
  selector: 'app-areas',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './areas.component.html',
  styleUrl: './areas.component.css'
})
export class AreasComponent implements OnChanges {
  @Input() datos: any[] = [];
  @ViewChild("chart") chart: ChartComponent | null = null;
  public chartOptions: Partial<ChartOptions> = {};
  public chart3options: Partial<ChartOptions> = {};
  public commonOptions: Partial<ChartOptions> = {};

  areas: string[] = ['MATEMATICAS', 'LECTURA', 'NATURALES', 'SOCIALES', 'INGLES'];
  areasbotonSeccionado: string = ''
  areaSeleccionada: string = ''

  datosfiltrados: any[] = []


  constructor() {
    this.areasbotonSeccionado = 'MATEMATICAS';
    this.areaSeleccionada= 'PROM. MATEMATICAS'
    this.commonOptions = {
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },
      toolbar: {
        tools: {
          selection: false
        }
      },
      markers: {
        size: 6,
        hover: {
          size: 10
        }
      },
      tooltip: {
        followCursor: false,
        theme: "dark",
        x: {
          show: false
        },
        marker: {
          show: false
        },
        y: {
          title: {
            formatter: function() {
              return "";
            }
          }
        }
      },
      grid: {
        clipMarkers: false
      },
      xaxis: {
        type: "datetime"
      }
    };
    this.chartOptions = {
      series: [{ name: 'Ventas', data: [] }],
      chart: { type: 'bar', height: 350 },
      dataLabels: { enabled: true },
      yaxis: { title: { text: 'cargando...' } },
      title: { text: 'cargando...', align: 'center' },
      xaxis: { categories: [] },
      tooltip: {
        y: {
          formatter: (val) => val.toFixed(2)
        }
      },
      fill: { type: 'solid' }
    };
    this.chart3options = {series: [{ name: 'Ventas', data: [] }],
      chart: { type: 'bar', height: 350 },
      dataLabels: { enabled: true },
      yaxis: { title: { text: 'cargando...' } },
      title: { text: 'cargando...', align: 'center' },
      xaxis: { categories: [] },
      tooltip: {
        y: {
          formatter: (val) => val.toFixed(2)
        }
      },
      fill: { type: 'gradient' }
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['datos'] && this.datos) {
      this.applyFilters();
      // this.graficoComparativo();
    }
  }

  seleccionarArea(area:string){
    this.areasbotonSeccionado = area;
    this.areaSeleccionada = `PROM. ${area}`;
    this.applyFilters();
  }

  applyFilters() {
    this.chartOptions= {}
    const batchSize = 1000;   
    let index = 0;

    const filtrados = this.datos.filter((row: any) => {
      // console.log('row', row)
      // if (row.PROMEDIO === ''){
      //   return false
      // }
      // const filtro = `PROM. ${this.areaSeleccionada}`;
      return (
        !this.areaSeleccionada || (row[this.areaSeleccionada] !== undefined && row[this.areaSeleccionada] !== null)
      );
    });
    // console.log(filtrados)

    this.datosfiltrados = [...this.datosfiltrados, ...filtrados];
    // console.log(this.datos)

    index += batchSize;
    this.graficoComparativo();
  };
  
    

  actualizarGraficoComparativo(nuevosPeriodos: string[], nuevasSeries: { name: string; data: number[] }[]) {
    this.chart?.updateOptions({
      xaxis: { categories: nuevosPeriodos },
      title: { text: 'Promedios', align: 'center' }
    });

    this.chart?.updateSeries(nuevasSeries);
    this.chart3options = {
      series: [
        {
          name: "chart3",
          data: nuevasSeries
        }
      ],
      chart: {
        id: "yt",
        group: "social",
        type: "area",
        height: 160
      },
      colors: ["#00E396"],
      yaxis: {
        tickAmount: 2,
        labels: {
          minWidth: 40
        }
      }
    };
  }
  

  graficoComparativo(){
    const periodos: string[] = [];
    const seriesMap: { [institucion: string]: number[] } = {};

    // 1. recolectar periodos únicos
    this.datosfiltrados.forEach(dato => {
      const periodo = String(dato.PERIODO);
      if (!periodos.includes(periodo)) {
        periodos.push(periodo);
      }
    });

    // 2. llenar series por institución
    this.datosfiltrados.forEach(dato => {
      const area = this.areaSeleccionada.replace('PROM. ','')
      // const institucion = ''+dato.INSTITUCION+' - '+area;
      const institucion = area;
      const promedio = Number(dato[this.areaSeleccionada]);
      const periodoIndex = periodos.indexOf(String(dato.PERIODO));

      if (!seriesMap[institucion]) {
        // inicializar con ceros o nulls para todos los periodos
        seriesMap[institucion] = new Array(periodos.length).fill(null);
      }

      // asignar el promedio en la posición del periodo
      seriesMap[institucion][periodoIndex] = promedio;
    });

    // 3. convertir a formato ApexCharts
    const series = Object.keys(seriesMap).map(inst => ({
      name: inst,
      data: seriesMap[inst]
    }));

    // 4. setear chartOptions
    this.chartOptions = {
      series: series,
      fill: { type: 'gradient' },
      chart: {
        id: "yt",
        group: "social",
        type: "area",
        height: 500
      },
      title: {
        text: this.areasbotonSeccionado, align: 'center'
      },
      xaxis: {
        title: { text: "Periodo" },
        categories: periodos
      },
      yaxis: {
        title: { text: "Promedio" },
        min: 0,
        max: 100,
        tickAmount: 5,
        labels: {
          formatter: (val) => val.toFixed(1)
        }
      },
      tooltip: {
        y: {
          formatter: (val) => val.toFixed(1)
        }
      }
    };
    const seriesArray = Object.keys(seriesMap).map(institucion => ({
      name: institucion,
      data: seriesMap[institucion]
    }));
    setTimeout(()=>{

      this.actualizarGraficoComparativo(periodos, seriesArray)
    },200);
  }
  //  public generateDayWiseTimeSeries(baseval:any, count: any, yrange:any): any[] {
  //   let i = 0;
  //   let series = [];
  //   while (i < count) {
  //     var x = baseval;
  //     var y =
  //       Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

  //     series.push([x, y]);
  //     baseval += 86400000;
  //     i++;
  //   }
  //   return series;
  // }
}
