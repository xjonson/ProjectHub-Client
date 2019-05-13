import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { NotFoundComponent } from '../components/not-found/not-found.component';
import { AuthGuard } from '../service/auth.service';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'project',
    loadChildren: '../components/project/project.module#ProjectModule'
  },
  {
    path: 'user',
    loadChildren: '../components/user/user.module#UserModule'
  },
  {
    path: 'msg',
    loadChildren: '../components/msg/msg.module#MsgModule',
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
