import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [],
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss',
})
export class ErrorComponent {
  router = inject(Router);

  handleHomeClick() {
    this.router.navigate(['']);
  }
}
