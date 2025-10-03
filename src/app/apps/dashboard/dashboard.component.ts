import { Component, ViewChild, Input, OnChanges} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule, ChartComponent} from "ng-apexcharts";
import Swal, { SweetAlertResult } from "sweetalert2";
import { theme } from '../../config/chart-theme';

// TABLAS
import * as echarts from 'echarts';

// SERVICIOS
import { CsvService } from '../../services/csv/csv.service';
import { AreasComponent } from "./areas/areas.component";
import { DesviacionComponent } from './desviacion/desviacion.component';
import { ComparativoComponent } from './comparativo/comparativo.component';
import { ChartOptions } from '../../models/chart/chart-option';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule, AreasComponent, AreasComponent, DesviacionComponent],  // 👈 aquí
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnChanges{
  theme = theme
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
      fill: { type: 'solid' }, // ✅ inicializado
      colors: ['#4ECDC4', '#FF6B6B', '#FFE66D'],
      stroke: {
        width: [2, 3, 2],
        curve: 'smooth'
      },
      markers: {
        size: [4, 5, 4],
        hover: {
          size: 7
        }
      }
    };
  }
  @Input() dane : string | null = ''
  @ViewChild("chart") chart: ChartComponent | null = null;;
  public chartOptions: Partial<ChartOptions> = {
    series: [],
    chart: {
      type: 'line',
      height: 350,
      toolbar: {
        show: true
      }
    },
    ...theme.chart, // Aplicar configuración común
    title: {
      text: 'Título del gráfico',
      align: 'center',
      style: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: theme.colors.text.primary
      }
    },
  };

  departamento : string = ''
  municipio: string = ''
  institucion: string = ''
  codigo: string = ''
  
  periodos : string[] = [ ]
  periodosCargados: boolean = false
  periodosSeleccionados: Set<string> = new Set(); // guardamos seleccionados en un Set

  

  
  
  headers: string[] = [];
  rowsData: any[] = []
  datosFiltrados: any[] = []
  datosFInales: any[] = []

  // Información institución
  nombreInstitucion: string = ''
  codigoDane: string = ''
  nombreDepartamento: string = ''
  nombreMunicipio: string = ''

  ngOnInit(): void {
    if(this.dane){
      this.getDatos()
    }
  }

  ngOnChanges() {
    // Este método se llamará cuando cambien las propiedades de entrada
    if(this.dane){
      this.getDatos()
    }
  }

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
          (!this.dane || row.DANE === this.dane) //&&
          // (!this.departamento || row.DEPARTAMENTO?.toUpperCase().includes(this.departamento.toUpperCase())) &&
          // (!this.municipio || row.MUNICIPIO?.toUpperCase().includes(this.municipio.toUpperCase())) &&
          // (!this.institucion || row.INSTITUCION?.toUpperCase().includes(this.institucion.toUpperCase())) &&
          // (this.periodosSeleccionados.size === 0 || this.periodosSeleccionados.has(row.PERIODO))
        );
      });

      this.datosFiltrados = [...this.datosFiltrados, ...filtrados];

      index += batchSize;

      if (index < this.rowsData.length) {
        setTimeout(processBatch, 0); // Sigue con el siguiente lote
      } else {
        // this.datosFiltrados = this.datosFiltrados.sort((a,b)=>{
          //   return a.CODINST - b.CODINST || a.PERIODO - b.PERIODO
          // } )
          console.log("✅ Filtrado completo:", this.datosFiltrados.length);
          
          if(this.datosFiltrados.length < 55){
            this.nombreInstitucion = this.datosFiltrados[0]?.INSTITUCION || ''
            this.codigoDane = this.datosFiltrados[0]?.DANE || ''
            this.nombreDepartamento = this.datosFiltrados[0]?.DEPARTAMENTO || ''
            this.nombreMunicipio = this.datosFiltrados[0]?.NOMBREMUNICIPIO || ''
            this.graficoComparativo()
            if(!this.periodosCargados){
              this.cargarPeriodos()
            }
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

  actualizarGraficoComparativo(nuevosPeriodos: string[], nuevasSeries: { name: string;    data: number[] }[]) {
    this.chart?.updateOptions({
      xaxis: { categories: nuevosPeriodos },
      title: { text: 'Promedios', align: 'center' }
    });

    this.chart?.updateSeries(nuevasSeries);
  }


  graficoComparativo(){
    console.log("datosFiltrados", this.datosFiltrados)
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
          borderRadius: 5
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
        text: 'Promedios por Institución',
        align: 'center',
        style: {
          fontSize: '18px',
          fontWeight: 'bold'
        }
      },
      xaxis: {
        title: { 
          text: "Periodo" 
        },
        categories: periodos
      },
      yaxis: {
        title: { 
          text: "Promedio" 
        },
        min: 0,
        max: 500,
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
      this.datosFInales = this.datosFiltrados
    },200);
  }
}
