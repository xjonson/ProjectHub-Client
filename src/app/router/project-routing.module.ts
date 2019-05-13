import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from '../components/project/list/list.component';
import { DetailComponent } from '../components/project/detail/detail.component';
import { EditComponent } from '../components/project/edit/edit.component';
import { AuthGuard } from '../service/auth.service';


const routes: Routes = [
  {
    path: '',
    component: ListComponent,
  },
  {
    path: 'detail/:_id',
    component: DetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'edit',
    component: EditComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule { }
