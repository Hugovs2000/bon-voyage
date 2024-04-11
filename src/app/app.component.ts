import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

import { LoginComponent } from './components/login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AngularFirestoreModule, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'bon-voyage';
}
