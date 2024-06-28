import { Component, inject } from '@angular/core';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardContent, MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { AuthService } from '../../services/auth.service';
import { ValidationService } from '../../services/validation.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    MatError,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatCardContent,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  authService = inject(AuthService);
  router = inject(Router);
  snackBar = inject(MatSnackBar);
  hide = true;

  validation = inject(ValidationService);

  signUpForm = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(environment.passwordRegex),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    this.validation.passwordMatch('password', 'confirmPassword')
  );

  onSubmit() {
    if (this.signUpForm.value.email && this.signUpForm.value.password)
      this.authService
        .signup(this.signUpForm.value.email, this.signUpForm.value.password)
        .then(() => {
          localStorage.setItem('user', 'true');
          this.authService.isLoggedIn.set(true);
          this.router.navigate(['home']);
        })
        .catch(() =>
          this.snackBar.open(
            'Could not sign up. An error occurred. Please try again.',
            'Close',
            {
              duration: 5000,
              panelClass: ['snackbar-error'],
            }
          )
        );
  }

  signInWithGoogle() {
    this.authService
      .byGoogle()
      .then(() => {
        localStorage.setItem('user', 'true');
        this.authService.isLoggedIn.set(true);
        this.router.navigate(['home']);
      })
      .catch(() =>
        this.snackBar.open(
          'Could not log in. An error occurred. Please try again.',
          'Close',
          {
            duration: 5000,
            panelClass: ['snackbar-error'],
          }
        )
      );
  }

  navToLogIn() {
    this.router.navigate(['log-in']);
  }
}
