import { Directive } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';
import { HoursValidator } from './hours.validator';

/**
 * Applies the hours validation to the hours form control.
 */
@Directive({
    selector: '[hours][ngModel]',
    providers: [{ provide: NG_VALIDATORS, useExisting: HoursDirective, multi: true }]
})
export class HoursDirective implements Validator {
  private validator = HoursValidator;

  /**
   * Validates the hours input using the validator function.
   * 
   * @param control the input value for the hours
   * @returns true if a validation error exists, null otherwise
   */
  validate(control: AbstractControl): { [key: string]: any } {
      return this.validator(control);
  }
}