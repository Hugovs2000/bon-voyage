import {
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { provideHttpClient } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideNativeDateAdapter } from '@angular/material/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { environment } from '../environments/environment.development';
import { routes } from './app.routes';
import { TripsEffects } from './store/trips/effects';
import { debug, tripsFeatureKey, tripsReducers } from './store/trips/reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideNzI18n(en_US),
    provideRouter(routes, withComponentInputBinding()),
    provideNativeDateAdapter(),
    importProvidersFrom(
      provideFirebaseApp(() => initializeApp(environment.firebase))
    ),
    importProvidersFrom(provideAuth(() => getAuth())),
    importProvidersFrom(provideFirestore(() => getFirestore())),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideStore(
      {},
      {
        metaReducers: isDevMode() ? [debug] : [],
      }
    ),
    provideState({ name: tripsFeatureKey, reducer: tripsReducers }),
    provideEffects(TripsEffects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};
