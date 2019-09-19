import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appValidationsDirective]'
})
export class ValidationsDirective {

  // tslint:disable-next-line:no-input-rename
  @Input('numericType') numericType: string; // number | decimal

  private regex = {
    number: new RegExp(/^\d+$/),
    decimal: new RegExp(/^[0-9]+(\.[0-9]*){0,1}$/g),
    numbersOnly: new RegExp(/^[0-9]+$/),
    speicalCharOnly: new RegExp(/^[@!:;"\\?<,>.#$%^&*'()_\-\+={}\/;\[\\\]\^_`{|}~\\n]+$/)
  };

  private specialKeys = {
    number: ['Delete', 'Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight'],
    decimal: ['Delete', 'Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight'],
    numbersOnly: ['Delete', 'Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight'],
    speicalCharOnly: ['Delete', 'Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight']
  };

  constructor(private el: ElementRef) {
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {

    if (this.specialKeys[this.numericType].indexOf(event.key) !== -1) {
      return;
    }
    // Do not use event.keycode this is deprecated.
    // See: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
    const current: string = this.el.nativeElement.value;
    const next: string = current.concat(event.key);
    if (next && !String(next).match(this.regex[this.numericType])) {
      event.preventDefault();
    }
  }

}
