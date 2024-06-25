import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, InputSignal, input } from '@angular/core';

@Component({
  selector: 'app-trip-card',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './trip-card.component.html',
  styleUrl: './trip-card.component.scss',
})
export class TripCardComponent {
  tripTitle: InputSignal<string> = input<string>('');
  startDate: InputSignal<Date> = input<Date>(new Date());
  endDate: InputSignal<Date> = input<Date>(new Date());
  duration: InputSignal<number> = input<number>(1);
  totalCost: InputSignal<number> = input<number>(0);
}
