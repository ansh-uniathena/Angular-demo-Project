import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../config/environment';
import { AppError } from '../error-handling/app-error';
import { ApiClient, ApiRequestOptions } from './api-client';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
export type MockHandler = (body: unknown, params: Record<string, string>) => Observable<unknown>;

interface MockRoute {
  method: HttpMethod;
  matcher: RegExp;
  paramNames: string[];
  handler: MockHandler;
}

function compile(path: string): { matcher: RegExp; paramNames: string[] } {
  const paramNames: string[] = [];
  const pattern = path
    .split('/')
    .map((segment) => {
      if (segment.startsWith(':')) {
        paramNames.push(segment.slice(1));
        return '([^/]+)';
      }
      return segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    })
    .join('/');
  return { matcher: new RegExp(`^${pattern}$`), paramNames };
}

/**
 * In-memory API implementation used while there is no real backend. Features
 * register their own routes/data via `register()` (see
 * core/auth/auth.mock-handlers.ts for an example) — this class stays a
 * generic dispatcher and never accumulates feature-specific logic itself.
 */
@Injectable({ providedIn: 'root' })
export class MockApiClient implements ApiClient {
  private readonly routes: MockRoute[] = [];

  register(method: HttpMethod, path: string, handler: MockHandler): void {
    const { matcher, paramNames } = compile(path);
    this.routes.push({ method, matcher, paramNames, handler });
  }

  get<T>(url: string, options?: ApiRequestOptions): Observable<T> {
    const query = options?.params
      ? '?' + new URLSearchParams(options.params as Record<string, string>).toString()
      : '';
    return this.dispatch<T>('GET', url + query, undefined);
  }

  post<T>(url: string, body: unknown): Observable<T> {
    return this.dispatch<T>('POST', url, body);
  }

  put<T>(url: string, body: unknown): Observable<T> {
    return this.dispatch<T>('PUT', url, body);
  }

  delete<T>(url: string): Observable<T> {
    return this.dispatch<T>('DELETE', url, undefined);
  }

  private dispatch<T>(method: HttpMethod, url: string, body: unknown): Observable<T> {
    const [path, queryString] = url.split('?');
    const route = this.routes.find((r) => r.method === method && r.matcher.test(path));
    if (!route) {
      return throwError(() => new AppError(`No mock route for ${method} ${url}`, 404)).pipe(
        delay(environment.mockNetworkDelayMs),
      );
    }
    const match = route.matcher.exec(path)!;
    const routeParams = Object.fromEntries(route.paramNames.map((name, i) => [name, match[i + 1]]));
    // Query params (?page=1&search=...) merged in alongside :route params —
    // dispatch previously discarded the query string entirely.
    const queryParams = queryString ? Object.fromEntries(new URLSearchParams(queryString)) : {};
    const params = { ...queryParams, ...routeParams };
    const result$: Observable<unknown> = route
      .handler(body, params)
      .pipe(delay(environment.mockNetworkDelayMs));
    return result$ as Observable<T>;
  }
}
