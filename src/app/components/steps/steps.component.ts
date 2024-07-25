import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NzStepsModule } from 'ng-zorro-antd/steps';

@Component({
  selector: 'app-steps',
  standalone: true,
  imports: [NzStepsModule, DatePipe],
  templateUrl: './steps.component.html',
  styleUrl: './steps.component.scss',
})
export class StepsComponent {
  @Input() starDate: Date | null | undefined = null;
  @Input() endDate: Date | null | undefined = null;
  @Input() duration: number | null | undefined = null;
}
