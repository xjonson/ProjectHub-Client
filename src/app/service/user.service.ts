import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/User';
import { map, switchMap, tap } from "rxjs/operators";
import { Observable } from 'rxjs';
import { ResTpl } from '../models/ResTpl';
import { NzMessageService } from 'ng-zorro-antd';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userInfo: User;

  constructor(
    private http: HttpClient,
    private nzMessage: NzMessageService,
  ) { }

  // 用户注册
  register(user: Partial<User>): Observable<any> {
    return this.http.post('/api/user/register', user)
  }

  // 用户登录
  login(user: Partial<User>): Observable<any> {
    return this.http.post('/api/user/login', user).pipe(
      tap(
        (res: ResTpl) => {
          if (res.code === 0) {
            this.setUserInfo(res.data)
          }
        }
      )
    )
  }

  setUserInfo(user: User) {
    console.log('user: ', user);
    this.userInfo = user
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
          this.nzMessage.create('info', res.msg);
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
          this.nzMessage.create('info', res.msg);
          console.log('res: ', res);
        }
      )
    )
  }
}
