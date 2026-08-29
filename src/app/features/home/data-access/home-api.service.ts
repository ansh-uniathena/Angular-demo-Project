import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '../../../core/api/api-client';
import { HomePageData } from './home.model';

@Injectable({ providedIn: 'root' })
export class HomeApiService {
  private readonly api = inject(ApiClient);

  getHomePageData(): Observable<HomePageData> {
    return this.api.get<HomePageData>('/home');
  }
}
