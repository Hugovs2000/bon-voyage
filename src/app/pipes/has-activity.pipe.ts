import { Pipe, PipeTransform } from '@angular/core';
import { ItineraryItem } from '../models/trips';

@Pipe({
  name: 'hasActivity',
  standalone: true,
})
export class HasActivityPipe implements PipeTransform {
  transform(value: Date, param: ItineraryItem[]): boolean {
    for (const activity of param) {
      if (
        activity.startDate.toDate().setHours(0, 0, 0, 0).valueOf() ===
        value.setHours(0, 0, 0, 0).valueOf()
      ) {
        return true;
      }
    }
    return false;
  }
}
