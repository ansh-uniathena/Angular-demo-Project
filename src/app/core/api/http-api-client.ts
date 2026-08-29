import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../config/environment';
import { ApiClient, ApiRequestOptions } from './api-client';

/**
 * Real-backend implementation. Swapped in once an actual API exists — see §8.
 * Error normalization happens once, in core/http/error.interceptor.ts, not here.
 */
@Injectable({ providedIn: 'root' })
export class HttpApiClient implements ApiClient {
  private readonly http = inject(HttpClient);

  get<T>(url: string, options?: ApiRequestOptions): Observable<T> {
    return this.http.get<T>(this.absoluteUrl(url), { params: options?.params });
  }

  post<T>(url: string, body: unknown): Observable<T> {
    return this.http.post<T>(this.absoluteUrl(url), body);
  }

  put<T>(url: string, body: unknown): Observable<T> {
    return this.http.put<T>(this.absoluteUrl(url), body);
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(this.absoluteUrl(url));
  }

  private absoluteUrl(url: string): string {
    return `${environment.apiBaseUrl}${url}`;
  }
}
