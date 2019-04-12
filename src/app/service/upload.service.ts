import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class UploadService {

  constructor(
    private http: HttpClient
  ) { }

  uploadImg(img): Observable<any> {
    const data = new FormData()
    data.append('files', img)
    return this.http.post('/api/upload/img', data)
  }
}

