import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectStepService {

  constructor(
    private http: HttpClient
  ) { }
  
  // 获取全部项目
  getProjectStep(): Observable<any> {
    return this.http.get('/api/projectStep')
  }

}
