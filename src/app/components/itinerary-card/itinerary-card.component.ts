import { CurrencyPipe, DatePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  InputSignal,
  OnInit,
  Output,
  input,
} from '@angular/core';
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

  @Output() deleteClicked = new EventEmitter();
  @Output() editClicked = new EventEmitter();
  @Output() itineraryClicked = new EventEmitter();

  newStartDate: Date = new Date();
  newEndDate: Date = new Date();

  ngOnInit(): void {
    if (
      this.inputActivity() &&
      this.inputActivity().startDate &&
      this.inputActivity().endDate
    ) {
      if (this.inputActivity().startDate) {
        this.newStartDate = this.inputActivity().startDate.toDate();
      }
      if (this.inputActivity().endDate) {
        this.newEndDate = this.inputActivity().endDate.toDate();
      }
    }
  }

  handleItineraryClick(event: Event) {
    event.stopPropagation();
    this.itineraryClicked.emit();
  }

  handleDeleteClick(event: Event) {
    event.stopPropagation();
    this.deleteClicked.emit();
  }

  handleEditClick(event: Event) {
    event.stopPropagation();
    this.editClicked.emit();
  }
}
