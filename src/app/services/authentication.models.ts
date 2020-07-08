export class LoginModel {

  constructor() {
    this.email = '';
    this.password = '';
  }
  email: string;
  password: string;

}

export class RegistrationModel {

  constructor() {
    this.firstName = '';
    this.lastName = '';
    this.email = '';

    this.mobileNumber = '';
    this.password = '';
    this.confirmPassword = '';

    this.emailCode = '';
    this.mobileCode = '';

  }

  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  password: string;
  confirmPassword: string;
  emailCode: string;
  mobileCode: string;
  captcha?: string;

}

export class VerifyModel {

  firstName: string;
  lastName: string;
  emailAddress: string;
  mobileCountry: string;
  mobileNumber: string;
  captcha?: string;
}

export class PasswordReset {
    email: string;
    code: string;
    password: string;
    confirmPassword: string;
    captcha?: string;
}

export class ForgotPassword {
  email: string;
  captcha?: string;
}

export class User {

  constructor(email: string, firstName: string, lastName: string, cardNumber: string, ceo: string, admin: string,
              driver: string, waiter: string) {
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.cardNumber = cardNumber;
    this.ceo = (ceo === 'True' || ceo === 'true');
    this.admin = (admin === 'True' || admin === 'true');
    this.driver = (driver === 'True' || driver === 'true');
    this.waiter = (waiter === 'True' || waiter === 'true');
  }

  email: string;
  firstName: string;
  lastName: string;
  cardNumber: string;
  ceo: boolean;
  admin: boolean;
  driver: boolean;
  waiter: boolean;

}

export class DeviceUpdateModel {

    typeId: number;
    token: string;

}
