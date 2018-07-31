import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {
    path: '',
    component: ListComponent
  },
  {
    path: 'list',
    component: ListComponent
  },
  {
    path: 'register/:id',
    component: RegisterComponent
  },
  {
    path: 'register',
    component: RegisterComponent,
    runGuardsAndResolvers: 'always'

  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
