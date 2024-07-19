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
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { logInWithGoogle, signUserUp } from '../../store/user/actions';
import { UserState } from '../../store/user/reducer';
import { passwordMatch } from '../../utils/passwordMatch';

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
    RouterLink,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  store = inject(Store<UserState>);

  hide = true;

  signUpForm = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(
          /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/
        ),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    passwordMatch('password', 'confirmPassword')
  );

  onSubmit() {
    if (this.signUpForm.value.email && this.signUpForm.value.password)
      this.store.dispatch(
        signUserUp({
          email: this.signUpForm.value.email,
          password: this.signUpForm.value.password,
        })
      );
  }

  signInWithGoogle() {
    this.store.dispatch(logInWithGoogle());
  }
}
