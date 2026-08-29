import { Observable } from 'rxjs';

export interface ApiRequestOptions {
  params?: Record<string, string | number | boolean>;
}

/**
 * Transport-agnostic API abstraction. Feature API services depend on this
 * token only — never on HttpClient or a mock implementation directly — so
 * swapping mock for a real backend is a single provider change in
 * app.config.ts (see CLAUDE.md §8).
 */
export abstract class ApiClient {
  abstract get<T>(url: string, options?: ApiRequestOptions): Observable<T>;
  abstract post<T>(url: string, body: unknown): Observable<T>;
  abstract put<T>(url: string, body: unknown): Observable<T>;
  abstract delete<T>(url: string): Observable<T>;
}
