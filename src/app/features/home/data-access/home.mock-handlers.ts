import { of } from 'rxjs';
import { MockApiClient } from '../../../core/api/mock-api-client';
import { mockHomePageData } from './home.mock-data';

/** Registers the `/home` mock route. Called once from app.config.ts. */
export function registerHomeMockHandlers(api: MockApiClient): void {
  api.register('GET', '/home', () => of(mockHomePageData));
}
