import { MissingParamError, InvalidParamError } from '../error';
import { badRequest, serverError } from '../helpers/http-helper';
import { Controller, IEmailValidator, HttpRequest, HttpResponse } from '../protocols';

class SignUpController implements Controller {
    private readonly emailValidator: IEmailValidator;
    constructor(emailValidator: IEmailValidator) {
        this.emailValidator = emailValidator;
    }
    handle(httpRequest: HttpRequest): HttpResponse {
        try {
            const requirFields = ['name', 'email', 'password', 'passwordConfirmation'];
            for (const field of requirFields) {
                if (!httpRequest.body[field]) {
                    return badRequest(new MissingParamError(field));
                }
            }
            const {name, email, password, passwordConfirmation} = httpRequest.body;
            if(password !== passwordConfirmation){
                return badRequest(new InvalidParamError('passwordConfirmation'))
            }
            const isValid = this.emailValidator.isvalid(email);
            if (!isValid) {
                return badRequest(new InvalidParamError('email'))
            }
        } catch (error) {
            return serverError();            
        }
    }
}
export { SignUpController }