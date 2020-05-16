import { AbstractControl, ValidatorFn } from '@angular/forms';

/**
 * Validates that the hours input is given in the nearest quarter hour, 
 * i.e., 1, 1.25, 1.5, 1.75.
 * 
 * @param control the control input
 * @returns true if validation fails, null otherwise
 */
export function HoursValidator(control: AbstractControl): { [key: string]: any } {
    return (Number.isInteger(control.value * 4)) ? null : { hours: true };
}