import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { HoursValidator } from '../validators/hours.validator';

/**
 * Custom form control for hours input.
 */
@Component({
  selector: 'app-hours-control',
  templateUrl: './hours-control.component.html',
  styleUrls: ['./hours-control.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => HoursControlComponent),
    multi: true
  }, {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => HoursControlComponent),
    multi: true
  }]
})
export class HoursControlComponent implements ControlValueAccessor {

  /**
   * Hours value
   */
  hours = 0;

  /**
   * Validation function
   */
  validateFn = HoursValidator;

  /**
   * Change event
   */
  onChange = (v: any) => { };

  /**
   * Changes binding to update form control.
   */
  update() {
    this.onChange(this.hours);
  }

  /**
   * Event handler for up and down key presses.
   * 
   * @param $event the key press event
   */
  keypress($event) {
    if ($event.key === 'ArrowUp') {
      this.setValue(.25);
    } else if ($event.key === 'ArrowDown') {
      this.setValue(-.25);
    }
  }

  /**
   * Updates the hours value from button clicks.
   * 
   * @param change the new hours value
   */
  setValue(change: number) {
    this.hours += change;
    this.update();
  }

  /**
   * Handles input validation.
   * 
   * @param control the form control
   */
  validate(control: FormControl) {
    return this.validateFn(control);
  }

  /**
   * Sets a new hours value from the form into the control.
   * 
   * @param value the new value
   */
  writeValue(value: any) {
    if (value !== undefined) {
      this.hours = value;
    }
  }

  /**
   * Assigns the change handler.
   * 
   * @param fn the change handler function
   */
  registerOnChange(fn) {
    this.onChange = fn;
  }

  /**
   * Unused interface method.
   */
  registerOnTouched() { }
}