import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Injectable({ providedIn: 'root' })
export class CourseService {
  private api = environment.apiUrl;
  constructor(private http: HttpClient) {}
  list() { return this.http.get<any[]>(`${this.api}/courses`); }
  get(id: number) { return this.http.get(`${this.api}/courses/${id}`); }
}
