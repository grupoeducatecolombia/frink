import { Component } from '@angular/core';
import { DashboardComponent } from "../../apps/dashboard/dashboard.component";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-insittuciones',
  standalone: true,
  imports: [DashboardComponent],
  templateUrl: './insittuciones.component.html',
  styleUrl: './insittuciones.component.css'
})
export class InsittucionesComponent {
  codigo: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Obtener parámetro de la URL
    this.codigo = this.route.snapshot.paramMap.get('codigo');

    // console.log('Código institución:', this.codigo);
  }
}

