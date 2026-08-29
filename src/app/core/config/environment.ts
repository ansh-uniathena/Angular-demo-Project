// Single environment source. Split into environment.development.ts /
// environment.production.ts (with angular.json fileReplacements) only once a
// real backend and a build-time distinction actually exist.
export const environment = {
  useMockApi: true,
  apiBaseUrl: '/api',
  mockNetworkDelayMs: 600,
};
