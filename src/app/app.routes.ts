import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/landing/landing.component').then(
        m => m.LandingComponent
      ),
  },
  {
    path: 'log-in',
    loadComponent: () =>
      import('./components/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'sign-up',
    loadComponent: () =>
      import('./components/signup/signup.component').then(
        m => m.SignupComponent
      ),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./components/home/home.component').then(m => m.HomeComponent),
    canActivate: [authGuard],
  },
  {
    path: 'new-trip',
    loadComponent: () =>
      import('./components/alter-trip/alter-trip.component').then(
        m => m.AlterTripComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'trip/:id',
    loadComponent: () =>
      import('./components/trip-details/trip-details.component').then(
        m => m.TripDetailsComponent
      ),
  },
  {
    path: 'trip/:id/itinerary/:itineraryId',
    loadComponent: () =>
      import('./components/itinerary-details/itinerary-details.component').then(
        m => m.ItineraryDetailsComponent
      ),
  },
  {
    path: 'error',
    loadComponent: () =>
      import('./components/error/error.component').then(m => m.ErrorComponent),
  },
  {
    path: '**',
    redirectTo: 'error',
  },
];
