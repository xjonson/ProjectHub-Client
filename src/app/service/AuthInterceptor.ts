import { Injectable } from "@angular/core";
import { HttpEvent, HttpRequest, HttpHandler, HttpInterceptor, HttpResponse, HttpErrorResponse } from "@angular/common/http";

import { Observable, of } from "rxjs";
import { mergeMap, catchError } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modal: NzModalService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('ph-token') ? localStorage.getItem('ph-token') : ''

    const clonedRequest = req.clone({
      headers: req.headers.set("Authorization", token)
    });

    return next.handle(clonedRequest).pipe(
      mergeMap((event: any) => {
        return of(event);
      }),
      catchError((err: HttpErrorResponse) => {
        switch (err.status) {
          case 401: // 未登录状态码
            if (
              !(
                location.href.indexOf('/user/login') > 0 ||
                location.href.indexOf('/user/register') > 0 ||
                location.href.indexOf('/home') > 0
              )
            ) {
              this.modal.error({
                nzContent: '身份信息过期，请重新登录',
                nzOnOk: () => {
                  this.router.navigate(['/user/login'])
                }
              })
            }
          default:
            return of(event);
        }
      })
    )
  }

}