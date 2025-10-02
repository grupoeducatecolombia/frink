import { Component, ViewChild, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule, ApexAxisChartSeries, ApexChart, ChartComponent, ApexDataLabels, ApexPlotOptions, ApexYAxis, ApexTitleSubtitle, ApexXAxis, ApexFill } from "ng-apexcharts";
import Swal, { SweetAlertResult } from "sweetalert2";


// TABLAS
import * as echarts from 'echarts';

// SERVICIOS
import { CsvService } from '../../services/csv/csv.service';
import { AreasComponent } from "./areas/areas.component";
import { DesviacionComponent } from './desviacion/desviacion.component';
import { ComparativoComponent } from './comparativo/comparativo.component';


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
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule, AreasComponent, AreasComponent, DesviacionComponent, ComparativoComponent],  // 👈 aquí
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent{
  @Input() dane : string | null = ''
  @ViewChild("chart") chart: ChartComponent | null = null;;
  public chartOptions: Partial<ChartOptions> = {};

  departamento : string = ''
  municipio: string = ''
  institucion: string = ''
  codigo: string = ''
  
  periodos : string[] = [ ]
  periodosCargados: boolean = false
  periodosSeleccionados: Set<string> = new Set(); // guardamos seleccionados en un Set

  constructor(
    private csvService: CsvService
  ){
    this.limpiarAnios()
    this.periodos = []
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

  setInstitucion(name: any | null){
    if(!(name === null)){
      this.institucion = name.value
    }  }
  setMunicipio(name: any | null){
    if(!(name === null))
    this.municipio = name.value
  }
  setDepartamento(name:  any | null){
    if(!(name === null)){
      this.departamento = name.value
    }
  }

  setCodigo(name: any){
    if(!(name === null)){
      this.codigo = name.value
    }
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
          (!this.codigo || row.DANE === this.codigo) &&
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
          
        if(this.datosFiltrados.length < 55){
          this.graficoComparativo()
        }else{
          if(this.periodosCargados){
            Swal.fire({
              title: 'DEMASIADOS COLEGIOS PARA MOSTRAR',
              html: `
                <p>Se encontraron demasiados colegios que cumplen el criterio</p>
                <p>Favor ser mas especifico en los filtros</p>
              `,
              icon: 'warning',
            })
          }
        }
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
    this.periodosCargados = false
    this.applyFilters()
  }

  cargarGrafricos(tipo:string){
    switch (tipo){
      case "comparativo":
        this.graficoComparativo()
        break
    }
  }

  actualizarGraficoComparativo(nuevosPeriodos: string[], nuevasSeries: { name: string; data: number[] }[]) {
    this.chart?.updateOptions({
      xaxis: { categories: nuevosPeriodos },
      title: { text: 'Promedios', align: 'center' }
    });

    this.chart?.updateSeries(nuevasSeries);
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
        text: "COMPARATIVO", align: 'center'
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
}
