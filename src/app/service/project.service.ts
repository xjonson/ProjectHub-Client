import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from '../models/Project';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { map, tap } from 'rxjs/operators';
import { ResTpl } from '../models/ResTpl';
import { NzMessageService } from 'ng-zorro-antd';
import { User } from '../models/User';


@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  projectTitle: string;
  constructor(
    private http: HttpClient,
    private userSrv: UserService,
    private nzMessage: NzMessageService,
  ) { }


  // 获取全部project
  getProjects(): Observable<any> {
    return this.http.get('api/project').pipe(
      tap((res: ResTpl) => {
        this.nzMessage.create('info', res.msg);
      })
    )
  }

  // 获取单个project详情
  getProject(id: string): Observable<any> {
    return this.http.get(`api/project/${id}`)
    // .pipe(
    //   tap((res: ResTpl) => {
        // this.nzMessage.create('info', res.msg);
    //   })
    // )
  }

  // 设置title
  setTitle(title: string): void {
    this.projectTitle = title
  }
  // 获取title
  getTitle() {
    // 创建一个Observable对象，subpage订阅值
    return new Observable((observer) => {
      if (this.projectTitle) {
        observer.next(this.projectTitle)
        observer.complete();
      }
      return { unsubscribe() { } };
    })
  }

  // 发布项目
  addProject(data: Project) {
    return this.http.post('api/project', data)
  }

  // 更新项目信息
  updateProject(pid: string, data: any) {
    return this.http.patch(`api/project/${pid}`, data).pipe(
      tap((res: ResTpl) => {
        this.nzMessage.create('info', res.msg);
      })
    )
  }

  // 更新项目评论
  addProjectComment(pid: string, content: string) {
    const obj = {
      content
    }
    return this.http.patch(`api/project/${pid}`, obj).pipe(
      tap((res: ResTpl) => {
        this.nzMessage.create('info', res.msg);
      })
    )
  }
  
  // 更新项目状态
  updateProjectStatus(pid: string, status: number, dev_user: Partial<User>) {
    const obj = {
      status,
      dev_user,
    }
    return this.http.patch(`api/project/${pid}`, obj).pipe(
      tap((res: ResTpl) => {
        this.nzMessage.create('info', res.msg);
      })
    )
  }
}
