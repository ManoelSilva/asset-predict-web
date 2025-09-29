import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    
  ]
};

export const apiConfig = {
  predictionUrl: environment.predictionUrl || 'http://localhost:5001',
  assetsUrl: environment.assetsUrl || 'http://localhost:5002',
};
