import { Directive } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';
import { PhoneValidator } from './phone.validator';

/**
 * Applies the phone number validator function to the phone number form control.
 */
@Directive({
    selector: '[phone][ngModel]',
    providers: [{ provide: NG_VALIDATORS, useExisting: PhoneDirective, multi: true }]
})
export class PhoneDirective implements Validator {
  private validator = PhoneValidator();

  /**
   * Validates the phone number input using the validator function.
   * 
   * @param control the input value for the phone number
   * @returns true if a validation error exists, null otherwise
   */
  validate(control: AbstractControl): { [key: string]: any } {
      return this.validator(control);
  }
}