import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardContent, MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatCardModule,
    MatCardContent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);
  snackBar = inject(MatSnackBar);

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  hide = true;

  onSubmit() {
    if (this.loginForm.value.email && this.loginForm.value.password)
      this.authService
        .login(this.loginForm.value.email, this.loginForm.value.password)
        .then(() => {
          localStorage.setItem('user', 'true');
          this.authService.isLoggedIn.set(true);
          this.router.navigate(['home']);
        })
        .catch(() =>
          this.snackBar.open(
            'Could not log in. Invalid user credentials.',
            'Close',
            {
              duration: 5000,
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
          }
        )
      );
  }

  navToSignUp() {
    this.router.navigate(['sign-up']);
  }
}
