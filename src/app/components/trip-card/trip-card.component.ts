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
  totalDuration: InputSignal<number> = input<number>(0);
  totalCost: InputSignal<number> = input<number>(0);
}
