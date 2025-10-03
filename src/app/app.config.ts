import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),

  ]
};

export const apiConfig = {
  predictionUrl: environment.predictionUrl !== undefined && environment.predictionUrl !== null ? environment.predictionUrl : 'http://localhost:5001/api/b3',
  assetsUrl: environment.assetsUrl !== undefined && environment.assetsUrl !== null ? environment.assetsUrl : 'http://localhost:5002',
};
