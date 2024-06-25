import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[swipe]',
  standalone: true,
})
export class SwipeDirective {
  @Output() left = new EventEmitter<void>();
  @Output() right = new EventEmitter<void>();
  @Output() onClick = new EventEmitter<void>();

  swipeCoord = [0, 0];
  swipeTime = new Date().getTime();

  constructor() {}

  @HostListener('touchstart', ['$event']) onSwipeStart($event: TouchEvent) {
    this.onSwipe($event, 'start');
  }

  @HostListener('touchend', ['$event']) onSwipeEnd($event: TouchEvent) {
    this.onSwipe($event, 'end');
  }

  @HostListener('mousedown', ['$event']) onMouseDown($event: MouseEvent) {
    this.onSwipe($event, 'start');
  }

  @HostListener('mouseup', ['$event']) onMouseUp($event: MouseEvent) {
    this.onSwipe($event, 'end');
  }

  onSwipe(e: TouchEvent | MouseEvent, when: string) {
    this.swipe(e, when);
  }

  swipe(e: TouchEvent | MouseEvent, when: string): void {
    const coord: [number, number] = [0, 0];
    if (e instanceof MouseEvent) {
      coord[0] = e.clientX;
      coord[1] = e.clientY;
    } else {
      coord[0] = e.changedTouches[0].clientX;
      coord[1] = e.changedTouches[0].clientY;
    }
    const time = new Date().getTime();

    if (when === 'start') {
      this.swipeCoord = coord;
      this.swipeTime = time;
    } else if (when === 'end') {
      const direction = [
        coord[0] - this.swipeCoord[0],
        coord[1] - this.swipeCoord[1],
      ];
      const duration = time - this.swipeTime;

      if (
        duration < 1000 &&
        Math.abs(direction[0]) > 30 &&
        Math.abs(direction[0]) > Math.abs(direction[1] * 3)
      ) {
        const swipeDir = direction[0] < 0 ? 'left' : 'right';
        if (swipeDir === 'left') {
          this.left.emit();
        } else {
          this.right.emit();
        }
      } else if (duration < 1000 && e instanceof MouseEvent) {
        this.onClick.emit();
      }
    }
  }
}
