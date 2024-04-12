import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LandingComponent } from './components/landing/landing.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    AngularFirestoreModule,
    LandingComponent,
    LoginComponent,
    SignupComponent,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'bon-voyage';
  router = inject(Router);
  authService = inject(AuthService);

  signOut() {
    this.authService.logUserOut();
    this.router.navigate(['']);
  }

  navToLogin() {
    this.router.navigate(['log-in']);
  }
  navToSignup() {
    this.router.navigate(['sign-up']);
  }
  navToHome() {
    this.router.navigate(['home']);
  }
}
