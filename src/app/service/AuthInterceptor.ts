import { Injectable } from "@angular/core";
import { HttpEvent, HttpRequest, HttpHandler, HttpInterceptor, HttpResponse, HttpErrorResponse } from "@angular/common/http";

import { Observable, of } from "rxjs";
import { mergeMap, catchError, tap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';


@Injectable({
  providedIn: 'root'
})

export class AuthInterceptor implements HttpInterceptor {
  msgId;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modal: NzModalService,
    private nzMessage: NzMessageService,
  ) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // loading
    this.msgId = this.nzMessage.loading('loading...', { nzDuration: 0 }).messageId;

    const token = localStorage.getItem('ph-token') ? localStorage.getItem('ph-token') : '';
    const clonedRequest = req.clone({
      headers: req.headers.set("Authorization", token)
    });

    return next.handle(clonedRequest).pipe(
      mergeMap((event: any) => {
        // remove loading
        this.nzMessage.remove(this.msgId);
        this.msgId = null;
        return of(event);
      }),
      catchError((err: HttpErrorResponse) => {
        switch (err.status) {
          case 401: // 未登录状态码
            if (!(
              location.href.indexOf('/user/login') > 0 ||
              location.href.indexOf('/user/register') > 0 ||
              location.href.indexOf('/home') > 0
            )) {
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