import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/User';
import { map, switchMap, tap } from "rxjs/operators";
import { Observable } from 'rxjs';
import { ResTpl } from '../models/ResTpl';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { MsgService } from './msg.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userInfo: User;

  constructor(
    private http: HttpClient,
    private message: NzMessageService,
    private router: Router,
    private modal: NzModalService,
    private msgSrv: MsgService,
  ) { }

  // 用户注册
  register(user: Partial<User>): Observable<any> {
    return this.http.post('/api/user/register', user)
  }

  // 用户登录
  login(user): Observable<any> {
    return this.http.post('/api/user/login', user).pipe(
      tap(
        (resTpl: ResTpl) => {
          localStorage.setItem('ph-token', resTpl.data.token)
          if (resTpl.code === 0) {
            this.userInfo = resTpl.data
            // 获取信息
            this.msgSrv.getMsgs().subscribe()
          }
        }
      )
    )
  }

  // 登出
  logout() {
    this.modal.confirm({
      nzContent: '确定退出登录？',
      nzOnOk: () => {
        this.userInfo = {} as User;
        localStorage.removeItem('ph-token');
        this.router.navigate(['/user/login']);
      }
    })
  }

  // 获取用户信息
  getUserInfo(id?: string) {
    if (id) {
      return this.http.get(`/api/user/${id}`)
    } else {
      return this.http.get(`/api/user/self`).pipe(
        tap((res: ResTpl) => {
          if (res.code === 0) {
            this.userInfo = res.data
            // 获取信息
            this.msgSrv.getMsgs().subscribe()
          }
        })
      )
    }
  }

  // 更新信息
  updateUserInfo(data: Partial<User>) {
    return this.http.patch(`api/user/${this.userInfo._id}`, data).pipe(
      tap(
        (res: ResTpl) => {
          this.message.info(res.msg)
          if (res.code === 0) this.userInfo = res.data
        }
      )
    )
  }

  // 修改密码
  updatePassword(oldPwd, newPwd) {
    const data = {
      oldPwd,
      newPwd
    }
    return this.http.patch(`api/user/password/${'updatePassword'}`, data).pipe(
      tap(
        (res: ResTpl) => {
          this.message.info(res.msg)
          console.log('res: ', res);
        }
      )
    )
  }
}
