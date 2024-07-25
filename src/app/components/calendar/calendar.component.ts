import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { HasActivityPipe } from '../../pipes/has-activity.pipe';
import { TripState } from '../../store/trips/reducer';
import { selectSelectedTrip } from '../../store/trips/selectors';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [NzCalendarModule, HasActivityPipe],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent {
  tripStore = inject(Store<TripState>);
  trip = toSignal(this.tripStore.select(selectSelectedTrip), {
    initialValue: null,
  });

  getDateWithoutTime(date: Date): Date {
    date.setHours(0, 0, 0, 0);
    return date;
  }
}
