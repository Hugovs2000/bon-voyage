import { inject, signal } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const isLoggedIn = signal(!!sessionStorage.getItem('user'));

  if (isLoggedIn()) {
    return true;
  } else {
    router.navigate(['log-in']);
    return false;
  }
};
