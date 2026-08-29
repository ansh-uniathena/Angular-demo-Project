import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  provideBrowserGlobalErrorListeners,
  provideEnvironmentInitializer,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { ApiClient } from './core/api/api-client';
import { HttpApiClient } from './core/api/http-api-client';
import { MockApiClient } from './core/api/mock-api-client';
import { registerAuthMockHandlers } from './core/auth/auth.mock-handlers';
import { environment } from './core/config/environment';
import { registerCourseMockHandlers } from './features/courses/data-access/course.mock-handlers';
import { registerHomeMockHandlers } from './features/home/data-access/home.mock-handlers';
import { registerStudentDashboardMockHandlers } from './features/student-dashboard/data-access/student-dashboard.mock-handlers';
import { authInterceptor } from './core/http/auth.interceptor';
import { errorInterceptor } from './core/http/error.interceptor';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    // Single switch point: mock vs real backend. See CLAUDE.md §8.
    { provide: ApiClient, useExisting: environment.useMockApi ? MockApiClient : HttpApiClient },
    provideEnvironmentInitializer(() => {
      if (environment.useMockApi) {
        const mockApi = inject(MockApiClient);
        registerAuthMockHandlers(mockApi);
        registerHomeMockHandlers(mockApi);
        registerCourseMockHandlers(mockApi);
        registerStudentDashboardMockHandlers(mockApi);
      }
    }),
  ],
};
