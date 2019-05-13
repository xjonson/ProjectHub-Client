import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from '../models/Project';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UserService } from './user.service';
import { map, tap } from 'rxjs/operators';
import { ResTpl } from '../models/ResTpl';
import { User } from '../models/User';
import { NzMessageService } from 'ng-zorro-antd';


@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  projectTitle: string;
  // 开发周期
  cycles = [
    { name: '1天', value: 1 },
    { name: '3天', value: 3 },
    { name: '5天', value: 5 },
    { name: '7天', value: 7 },
    { name: '1个月', value: 30 },
    { name: '3个月', value: 90 },
    { name: '5个月', value: 150 },
    { name: '7个月', value: 210 },
  ]

  constructor(
    private http: HttpClient,
    private userSrv: UserService,
    private message: NzMessageService
  ) { }


  // 获取全部project
  getProjects(filter?): Observable<any> {
    let params
    if (filter) {
      params = new HttpParams({
        fromObject: {
          cycle: filter.cycle,
          min_price: filter.price[0],
          max_price: filter.price[1],
          skills: filter.skills.join(','),
          project_type: filter.project_type,
          min_project_assess: filter.project_assess[0],
          max_project_assess: filter.project_assess[1]
        }
      })
    }

    return this.http.get('api/project', { params }).pipe(
      tap((res: ResTpl) => {
        this.message.info(res.msg);
      })
    )
  }

  // 获取单个project详情
  getProject(id: string): Observable<any> {
    return this.http.get(`api/project/${id}`)
  }


  // 发布项目
  addProject(data: Project): Observable<any> {
    return this.http.post('api/project', data)
  }

  // 更新项目信息
  updateProject(pid: string, data: any): Observable<any> {
    return this.http.patch(`api/project/${pid}`, data).pipe(
      tap((res: ResTpl) => {
        this.message.info(res.msg);
      })
    )
  }

  // 更新项目评论
  addProjectComment(pid: string, content: string): Observable<any> {
    const obj = {
      content
    }
    return this.http.patch(`api/project/${pid}`, obj).pipe(
      tap((res: ResTpl) => {
        this.message.info(res.msg);
      })
    )
  }

  // 更新项目状态
  updateProjectStatus(pid: string, status: number, dev_user: Partial<User>): Observable<any> {
    const obj = {
      status,
      dev_user,
    }
    return this.http.patch(`api/project/${pid}`, obj).pipe(
      tap((res: ResTpl) => {
        this.message.info(res.msg);
      })
    )
  }

  /**
   * @desc 项目评估
   */
  // 设置项目类型
  setProjectType(pid: string, pType): Observable<any> {
    const obj = {
      pType
    }
    return this.http.patch(`api/project/${pid}`, obj).pipe(
      tap((res: ResTpl) => {
        this.message.info(res.msg);
      })
    )
  }
  // 设置项目功能
  setProjectFun(pid: string, funs: any[]): Observable<any> {
    const obj = {
      funs
    }
    return this.http.patch(`api/project/${pid}`, obj).pipe(
      tap((res: ResTpl) => {
        this.message.info(res.msg);
      })
    )
  }
}
