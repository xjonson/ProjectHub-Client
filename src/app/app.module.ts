import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './router/app-routing.module';
import { AppComponent } from './app/app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './service/AuthInterceptor';
import { HomeComponent } from './components/home/home.component';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgZorroAntdModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    // i18n
    { provide: NZ_I18N, useValue: zh_CN },
    // http拦截器
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    // 路由hash模式
    { provide: LocationStrategy, useClass: HashLocationStrategy, }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
