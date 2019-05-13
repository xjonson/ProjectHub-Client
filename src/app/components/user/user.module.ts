import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { UserRoutingModule } from 'src/app/router/user-routing.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
  ],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    UserRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
  ]
})
export class UserModule { }
