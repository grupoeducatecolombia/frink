import { Routes } from '@angular/router';
import { InsittucionesComponent } from './administracion/insittuciones/insittuciones.component';
import { DashboardComponent } from './apps/dashboard/dashboard.component';

export const routes: Routes = [
  {path: 'inicio', component:InsittucionesComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: '', redirectTo: 'inicio', pathMatch: 'full'}
];
