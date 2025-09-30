import { Component } from '@angular/core';
import { DashboardComponent } from "../../apps/dashboard/dashboard.component";

@Component({
  selector: 'app-insittuciones',
  standalone: true,
  imports: [DashboardComponent],
  templateUrl: './insittuciones.component.html',
  styleUrl: './insittuciones.component.css'
})
export class InsittucionesComponent {
  departamento :string = ''
  municipio: string= ''
  institucion: string=''
  codigo: string= ''

  dashboardShow: boolean = false

  setinstitucion(name: any | null){
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

  showDashboard(){
    this.dashboardShow = true
  }
}

