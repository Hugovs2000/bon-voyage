import { Component, inject } from '@angular/core';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';

import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ValidationService } from '../../services/validation.service';
import { environment } from '../../../environments/environment.development';

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
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  authService = inject(AuthService);
  router = inject(Router);
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
        .then(() => this.router.navigate(['log-in']));
  }

  signInWithGoogle() {
    this.authService
      .byGoogle()
      .then(() => console.log('Logged in with google'))
      .catch(error =>
        console.log(
          'An error occurred when logging in, please try again!',
          error
        )
      );
  }

  navToLogIn() {
    this.router.navigate(['log-in']);
  }

  constructor(validation: ValidationService) {}
}
