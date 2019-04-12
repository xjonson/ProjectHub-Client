import { Injectable } from "@angular/core";
import { HttpEvent, HttpRequest, HttpHandler, HttpInterceptor, HttpResponse, HttpErrorResponse } from "@angular/common/http";

import { Observable, of } from "rxjs";
import { mergeMap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
  ) { }
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('ph-token') ? localStorage.getItem('ph-token') : ''
    
    const clonedRequest = req.clone({
      headers: req.headers.set("Authorization", token)
    });

    return next.handle(clonedRequest).pipe(
      mergeMap((event: any) => {
        // console.log('event: ', event);
        return of(event);
      }),
      catchError((err: HttpErrorResponse) => {
        switch (err.status) {
          // case 200:
          case 401: // 未登录状态码
            alert('身份信息过期，请重新登录')
            this.router.navigate(['/sub/login'])
          // case 404:
          // case 500:
          default:
            return of(event);
        }
      })
    )
  }

}