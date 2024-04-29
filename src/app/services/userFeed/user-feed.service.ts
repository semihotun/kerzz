import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { GetUserFeedRequest } from 'src/app/models/userFeed/userFeedRequest';
import { GetUserFeedResponse } from 'src/app/models/userFeed/userFeedResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserFeedService {
  private http: HttpClient = inject(HttpClient);
  constructor() { }
  GetFeed(data: GetUserFeedRequest): Observable<GetUserFeedResponse> {
    let path = environment.baseurl + '/mock/getFeed';
    return this.http.post<GetUserFeedResponse>(path, data);
  }
}
