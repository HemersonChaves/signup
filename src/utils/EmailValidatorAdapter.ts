import { IEmailValidator } from "presentation/protocols/emailValidator";
import validator from "validator";

class EmailValidatorAdapter implements IEmailValidator {
    isValid(email: string): boolean {
        return validator.isEmail(email);
    }
}

export { EmailValidatorAdapter }