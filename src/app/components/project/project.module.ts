import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { EditComponent } from './edit/edit.component';
import { ProjectRoutingModule } from 'src/app/router/project-routing.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [ListComponent, DetailComponent, EditComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    ProjectRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
  ]
})
export class ProjectModule { }
