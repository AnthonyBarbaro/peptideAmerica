export type LoginValues = {
  identifier: string;
  password: string;
};

export type RegisterValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type AccountErrors<TValues> = Partial<Record<keyof TValues, string>>;

export function validateLogin(values: LoginValues): AccountErrors<LoginValues> {
  const errors: AccountErrors<LoginValues> = {};

  if (!values.identifier.trim()) {
    errors.identifier = "Enter a username or email address.";
  }

  if (!values.password) {
    errors.password = "Enter your password.";
  }

  return errors;
}

export function validateRegister(values: RegisterValues): AccountErrors<RegisterValues> {
  const errors: AccountErrors<RegisterValues> = {};

  if (!values.email.trim()) {
    errors.email = "Enter an email address.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (values.password.length < 8) {
    errors.password = "Use at least 8 characters.";
  }

  if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Passwords must match.";
  }

  return errors;
}
