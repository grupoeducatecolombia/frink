import { Routes } from '@angular/router';
import { InsittucionesComponent } from './administracion/insittuciones/insittuciones.component';
import { DashboardComponent } from './apps/dashboard/dashboard.component';
export const routes: Routes = [
  // Ruta de inicio (sin parámetro)
  { path: 'inicio', component: InsittucionesComponent },

  // Ruta de inicio con institución seleccionada
  { path: 'inicio/:codigo', component: InsittucionesComponent },

  // Dashboard de la institución
  { path: 'dashboard/:codigo', component: DashboardComponent },

  // Redirección raíz
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },

  // Wildcard para rutas no encontradas
  { path: '**', redirectTo: 'inicio' }
];