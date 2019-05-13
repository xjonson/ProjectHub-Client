import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MsgsComponent } from './msgs/msgs.component';
import { MsgRoutingModule } from 'src/app/router/msg-routing.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [MsgsComponent],
  imports: [
    CommonModule,
    MsgRoutingModule,
    NgZorroAntdModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
  ]
})
export class MsgModule { }
