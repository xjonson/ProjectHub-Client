import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UserService } from './user.service';
import { NzModalService } from 'ng-zorro-antd';
import { ResTpl } from '../models/ResTpl';
import { MsgService } from './msg.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public loginState = false;
  public redirectUrl: string = '/home';
  public userid: string;

  constructor(
    private http: HttpClient,
    private userSrv: UserService,
    private router: Router,
    private modal: NzModalService,
    private msgSrv: MsgService,
  ) {
    // 查看cookie中是否有登录信息
    if (localStorage.getItem('ph-token')) {
      this.userSrv.getUserInfo().subscribe(
        (resTpl: ResTpl) => {
          this.loginState = true
        }
      )
    }
  }
}



// auth guard
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authSrv: AuthService,
    private router: Router,
    private userSrv: UserService,
    private modal: NzModalService,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // 如果已登录，不守卫
    if (localStorage.getItem('ph-token') || this.authSrv.loginState || this.userSrv.userInfo) return true
    // 分割出params，不然会报错
    const redirectUrl: string = state.url.split('?')[0]
    // 保存进入前的路由
    this.authSrv.redirectUrl = redirectUrl
    console.log('进入前的路由: ', redirectUrl);
    this.modal.info({
      nzContent: '请先登录',
      nzOnOk: () => {
        this.router.navigate(['/user/login'])
      }
    })
    return false

  }
}