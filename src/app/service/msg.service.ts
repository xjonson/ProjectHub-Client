import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ResTpl } from '../models/ResTpl';
import { NzMessageService } from 'ng-zorro-antd';

@Injectable({
  providedIn: 'root'
})
export class MsgService {
  unReadMsg = 0; // 未读消息数量

  constructor(
    private http: HttpClient,
    private userSrv: UserService,
    private nzMessage: NzMessageService,
  ) { }


  // 获取用户消息
  getMsgs(): Observable<any> {
    return this.http.get('api/msg').pipe(
      tap((res: ResTpl) => {
        this.unReadMsg = res.data.filter(i => !i.checked).length
        this.nzMessage.create('info', res.msg);
      })
    )
  }

  // 推送消息
  sendMsg(data): Observable<any> {
    if (data.action && data.action !== undefined) {
      data.isAction = true
    }
    return this.http.post('api/msg', data)
      .pipe(
        tap((res: ResTpl) => {
          if (data.isAction) {
            this.nzMessage.create('info', res.msg);
          }
        })
      )
  }

  // 消息已读
  readMsg(mid): Observable<any> {
    return this.http.patch(`api/msg/${mid}`, {})
  }

  // 删除已读
  delReadMsg(): Observable<any> {
    return this.http.delete(`api/msg/`, {})
      .pipe(
        tap((res: ResTpl) => {
          this.nzMessage.create('info', res.msg);
        })
      )
  }
}
