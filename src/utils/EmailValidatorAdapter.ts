import { IEmailValidator } from "presentation/protocols/emailValidator";

class EmailValidatorAdapter implements IEmailValidator {
    isValid(email: string): boolean {
        return false;
    }
}

export { EmailValidatorAdapter }