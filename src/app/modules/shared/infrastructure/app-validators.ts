import { FormGroup, FormControl, ValidatorFn, AbstractControl, Validators, AbstractControlOptions } from '@angular/forms';

export function emailValidator(control: FormControl): { [key: string]: any } {
  const emailRegexp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
  if (control.value && !emailRegexp.test(control.value)) {
    return {invalidEmail: true};
  }
}

export function matchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
  return (group: FormGroup) => {
    const password = group.controls[passwordKey];
    const passwordConfirmation = group.controls[passwordConfirmationKey];
    if (password.value !== passwordConfirmation.value) {
      return passwordConfirmation.setErrors({mismatchedPasswords: true});
    }
  };
}

export function regexValidator(regex: RegExp, validatorName: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    if (!control.value) {
      return null;
    }
    const valid = regex.test(control.value);

    return valid ? null : {[validatorName]: {error: true}};
  };
}

export function regexNumberValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {

        if (isNaN(control.value) || control.value === null) {
           return {['numberRequired']: {error: true}};
        }

        const valid = new RegExp('[0-9]+').test(control.value);

        return valid ? null : {['numberRequired']: {error: true}};

    };
}

export function passwordValidators(): Array<ValidatorFn | null | undefined> {
  return [
    Validators.required,
    Validators.minLength(8),
    Validators.maxLength(20),
    regexValidator(new RegExp('[0-9]+'), 'numberRequired'),
    regexValidator(new RegExp('[A-Z]+'), 'upperCaseRequired'),
    regexValidator(new RegExp('[a-z]+'), 'lowerCaseRequired')
  ];

}

export function numberRequiredValidator(): Array<ValidatorFn | null | undefined> {

    return [
        Validators.required,
        regexNumberValidator()
    ];

}
