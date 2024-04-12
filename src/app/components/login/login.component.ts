import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { MatCardContent, MatCardModule } from '@angular/material/card';

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
        .then(() => this.router.navigate(['']))
        .catch(() =>
          console.log('An error occurred when logging in, please try again!')
        );
  }

  signInWithGoogle() {
    this.authService
      .byGoogle()
      .then(() => this.router.navigate(['']))
      .catch(error =>
        console.log(
          'An error occurred when logging in, please try again!',
          error
        )
      );
  }

  navToSignUp() {
    this.router.navigate(['sign-up']);
  }
}
