import { AbstractControl, ValidatorFn } from '@angular/forms';

/**
 * The regular expression for a phone number
 */
const expression = /((\(\d{3}\) ?)|(\d{3}-))?\d{3}-\d{4}/;

/**
 * Returns a validator function to validate a string value against 
 * the phone number regular expression.
 * 
 * @returns the phone number validator function
 */
export function PhoneValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        const valid = expression.test(control.value) && control.value.length < 14;
        return valid ? null : { phone: true };
    };
}