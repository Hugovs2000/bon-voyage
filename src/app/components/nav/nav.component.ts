import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { logOut } from '../../store/user/actions';
import { UserState } from '../../store/user/reducer';
import { selectIsLoggedIn } from '../../store/user/selectors';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [MatIconModule, MatToolbarModule, AsyncPipe, RouterLink],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent {
  userStore = inject(Store<UserState>);
  isLoggedIn$ = this.userStore.select(selectIsLoggedIn);

  signOut() {
    this.userStore.dispatch(logOut());
  }
}
