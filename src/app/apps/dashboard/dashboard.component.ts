import { Component, Input, SimpleChanges, OnChanges, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule, ApexAxisChartSeries, ApexChart, ChartComponent, ApexDataLabels, ApexPlotOptions, ApexYAxis, ApexTitleSubtitle, ApexXAxis, ApexFill } from "ng-apexcharts";


// TABLAS
import * as echarts from 'echarts';

// SERVICIOS
import { CsvService } from '../../services/csv/csv.service';


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
};
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,NgApexchartsModule],  // 👈 aquí
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnChanges{
  @ViewChild("chart") chart: ChartComponent | null = null;;
  public chartOptions: Partial<ChartOptions> = {};


  @Input() departamento : string = ''
  @Input() municipio: string = ''
  @Input() institucion: string = ''
  @Input() codigo: string = ''
  
  periodos : string[] = [ '2020', '2021', '2022', '2023', '2024']
  periodosCargados: boolean = false
  periodosSeleccionados: Set<string> = new Set(); // guardamos seleccionados en un Set

  constructor(
    private csvService: CsvService
  ){
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
  
  headers: string[] = [];
  rowsData: any[] = []
  datosFiltrados: any[] = []
  
  
  ngOnChanges(changes: SimpleChanges) {
    // console.log('Cambios detectados:', changes);
    this.getDatos(); // vuelve a filtrar cuando cambia un input
    
  }


  
  getDatos(): void {
    this.headers = ['CODINST','INSTITUCION', 'MUNICIPIO', 'PERIODO', 'PROMEDIO', 'PROM. LECTURA', 'PROM. MATEMATICAS', 'PROM. SOCIALES', 'PROM. NATURALES', 'PROM. INGLES']

    this.csvService.loadCsv('../../../assets/data/datos.csv').subscribe(rows => {
      // if (rows.length > 0) {
      //   this.headers = Object.keys(rows[0]);
      // }
      // this.rowsData = rows
      // console.log("rows", rows);

      this.rowsData = rows
      this.applyFilters()
    });
    
  }

  applyFilters() {
    this.chartOptions= {}
    // console.log(this.institucion, this.municipio, this.departamento)
    this.datosFiltrados = []; // Reiniciamos
    const batchSize = 1000;   // Número de registros por lote
    let index = 0;
    // console.log(rows)
    console.log("inicia process bash")
    const processBatch = () => {
      const batch = this.rowsData.slice(index, index + batchSize);
      // console.log(batch)
      const filtrados = batch.filter((row: any) => {
        // console.log('row', row)
        if (row.PROMEDIO === ''){
          return false
        }
        return (
          (!this.departamento || row.DEPARTAMENTO?.toUpperCase().includes(this.departamento.toUpperCase())) &&
          (!this.municipio || row.MUNICIPIO?.toUpperCase().includes(this.municipio.toUpperCase())) &&
          (!this.institucion || row.INSTITUCION?.toUpperCase().includes(this.institucion.toUpperCase()) &&
          (this.periodosSeleccionados.size === 0 || this.periodosSeleccionados.has(row.PERIODO))
        )
        );
      });
      // console.log(filtrados)

      this.datosFiltrados = [...this.datosFiltrados, ...filtrados];
      // console.log(this.datosFiltrados)

      index += batchSize;

      if (index < this.rowsData.length) {
        setTimeout(processBatch, 0); // Sigue con el siguiente lote
        if(!this.periodosCargados){
          this.cargarPeriodos()
        }
      } else {
        // this.datosFiltrados = this.datosFiltrados.sort((a,b)=>{
        //   return a.CODINST - b.CODINST || a.PERIODO - b.PERIODO
        // } )
        console.log("✅ Filtrado completo:", this.datosFiltrados.length);
          
        // if(this.datosFiltrados.length < 6){
        //   this.cargarGafricos('institucion')
        // }else if(this.datosFiltrados.length < 100){
          this.cargarGafricos('comparativo')
        // }else{
          //agregregar mensaje de error por exceso de datos
        // }
        this.finalizarCargarPeriodos()
      }
    };
    processBatch();
  }

  cargarPeriodos(){
    this.periodos = [...new Set(this.datosFiltrados.map(d => d.PERIODO))];
  }
  
  finalizarCargarPeriodos(){
    this.periodosCargados = true
  }

  onPeriodoChange(periodo: string, checked: any = false) {
    if (checked) {
      this.periodosSeleccionados.add(periodo);
    } else {
      this.periodosSeleccionados.delete(periodo);
    }

    console.log("Seleccionados:", Array.from(this.periodosSeleccionados));

    // 👉 aquí puedes llamar a tu método para actualizar el gráfico
    // this.actualizarGraficoComparativo([...this.periodosSeleccionados], series);
    this.applyFilters()
  }

  limpiarAnios(){
    this.periodosSeleccionados =new Set()
    this.applyFilters()
  }

  cargarGafricos(tipo:string){
    switch (tipo){
      case "institucion":
        this.grafricoInstitucion()
        break;
      case "comparativo":
        this.graficoComparativo()
        break
    }
  }

  actualizarGrafico(nuevosPeriodos: string[], nuevosPromedios: number[]) {
    this.chart?.updateOptions({
      xaxis: { categories: nuevosPeriodos },
      title: { text: 'Promedios actualizados', align: 'center' }
    });

    this.chart?.updateSeries([
      { name: "Promedio", data: nuevosPromedios }
    ]);
  }

  actualizarGraficoComparativo(nuevosPeriodos: string[], nuevasSeries: { name: string; data: number[] }[]) {
    this.chart?.updateOptions({
      xaxis: { categories: nuevosPeriodos },
      title: { text: 'Promedios', align: 'center' }
    });

    this.chart?.updateSeries(nuevasSeries);
  }

  grafricoInstitucion() {
    let promedios: number[] = [];
    let periodos: string[] = [];

    this.datosFiltrados.forEach(dato => {
      const promedio = Number(dato.PROMEDIO);
      // if (!isNaN(promedio)) {
        // console.log('hola')
        promedios.push(promedio);
        periodos.push(String(dato.PERIODO || ''));
      // }
    });
    // console.log('periodos', periodos, 'promedios', promedios)
    this.chartOptions = {
      series: [
        {
          name: "Promedio",
          data: promedios
        }
      ],
      chart: {
        type: "bar",
        height: 350
      },
      title: {
        text: this.datosFiltrados[0].INSTITUCION
      },
      xaxis:{
        title: { text: "Periodo" },
        categories: periodos
      },
      yaxis: {
        title: { text: "Promedio" },
        min: 0,
        max: 500,
        labels: {
          formatter: (val) => val.toFixed(1)// muestra solo 2 decimales en el eje Y
        }
      },
      tooltip: {
        y: {
          formatter: (val) => val.toFixed(1) // tooltip también con 2 decimales
        }
      }
    };
    this.actualizarGrafico(periodos, promedios)
  }


  graficoComparativo(){
    const periodos: string[] = [];
    const seriesMap: { [institucion: string]: number[] } = {};

    // 1. recolectar periodos únicos
    this.datosFiltrados.forEach(dato => {
      const periodo = String(dato.PERIODO);
      if (!periodos.includes(periodo)) {
        periodos.push(periodo);
      }
    });

    // 2. llenar series por institución
    this.datosFiltrados.forEach(dato => {
      const institucion = dato.INSTITUCION;
      const promedio = Number(dato.PROMEDIO);
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
      chart: {
        type: "bar",
        height: 350
      },
      title: {
        text: "COMPARATIVO"
      },
      xaxis: {
        title: { text: "Periodo" },
        categories: periodos
      },
      yaxis: {
        title: { text: "Promedio" },
        min: 0,
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

  graficoDepartamento(){
    const chartDom = document.getElementById('tabla')!;
    const myChart = echarts.init(chartDom);
    const option = {
      title: { text: 'DEPARTAMENTO' },
      tooltip: {},
      xAxis: { data: ['A', 'B', 'C', 'D'] },
      yAxis: {},
      series: [{ type: 'bar', data: [5, 20, 36, 10] }]
    };
    myChart.setOption(option);
  }
}
