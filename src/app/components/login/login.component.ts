import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { merge } from 'rxjs';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { MatDividerModule } from '@angular/material/divider';

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
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  authService = inject(AuthService);

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl(''),
  });

  hide = true;

  errorMessage = '';

  constructor() {
    merge(this.loginForm.statusChanges, this.loginForm.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  updateErrorMessage() {
    if (this.loginForm.hasError('required')) {
      this.errorMessage = 'You must enter a value';
    } else if (this.loginForm.hasError('email')) {
      this.errorMessage = 'Not a valid email';
    } else {
      this.errorMessage = '';
    }
  }

  onSubmit() {
    if (this.loginForm.value.email && this.loginForm.value.password)
      this.authService
        .login(this.loginForm.value.email, this.loginForm.value.password)
        .then()
        .catch(error =>
          console.log(
            'An error occurred when logging in, please try again!',
            error
          )
        );
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
}
