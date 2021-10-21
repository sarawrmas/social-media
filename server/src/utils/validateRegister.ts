import { UserInput } from "src/resolvers/UserInput";

export const validateRegister = (options: UserInput) => {
  // email must include @
  if (!options.email.includes('@')) {
    return [
      {
        field: "email",
        message: "Invalid email"
      }
    ]
  }

  // username cannot contain @
  if (options.username.includes('@')) {
    return [
      {
        field: "username",
        message: "Username cannot include @"
      }
    ]
  }

  // username must have more than 2 characters
  if (options.username.length <= 2) {
    return [
      {
        field: "username",
        message: "Username length must be greater than 2"
      }
    ]
  }

  // password must have more than 6 characters
  if (options.password.length <= 6) {
    return [
      {
        field: "password",
        message: "Password length must be greater than 6"
      }
    ]
  }

  return null;
}