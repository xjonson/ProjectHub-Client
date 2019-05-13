import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MsgsComponent } from '../components/msg/msgs/msgs.component';

const routes: Routes = [
  {
    path: '',
    component: MsgsComponent,
  },
  {
    path: '',
    redirectTo: 'msgs',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MsgRoutingModule { }
