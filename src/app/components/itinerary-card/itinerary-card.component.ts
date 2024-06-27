import { CurrencyPipe, DatePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  InputSignal,
  OnInit,
  Output,
  input,
} from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { MatIconModule } from '@angular/material/icon';
import { ItineraryItem } from '../../models/trips';

@Component({
  selector: 'app-itinerary-card',
  standalone: true,
  imports: [DatePipe, MatIconModule, CurrencyPipe],
  templateUrl: './itinerary-card.component.html',
  styleUrl: './itinerary-card.component.scss',
})
export class ItineraryCardComponent implements OnInit {
  inputActivity: InputSignal<ItineraryItem> = input<ItineraryItem>(
    {} as ItineraryItem
  );
  indexNumber: InputSignal<number> = input<number>(0);

  @Output() deleteClicked = new EventEmitter<number>();

  newStartDate: Date = new Date();
  newEndDate: Date = new Date();

  ngOnInit(): void {
    if (
      this.inputActivity() &&
      this.inputActivity().startDate &&
      this.inputActivity().endDate
    ) {
      if (this.inputActivity().startDate instanceof Timestamp) {
        this.newStartDate = this.inputActivity().startDate.toDate();
      }
      if (this.inputActivity().endDate instanceof Timestamp) {
        this.newEndDate = this.inputActivity().endDate.toDate();
      }
    }
  }

  handleDeleteClick() {
    this.deleteClicked.emit(this.indexNumber());
  }
}
