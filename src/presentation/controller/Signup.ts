import { MissingParamError } from '../error/MissingParamErro';
import { HttpRequest, HttpResponse } from '../protocols/http';
import { badRequest } from '../helpers/http-helper';
import { Controller } from '../protocols/controller';
import { IEmailValidator } from "../protocols/emailValidator";
import { InvalidParamError } from '../error/InvalidParamErro';
import { ServerError } from '../error/ServerError';


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
            const isValid = this.emailValidator.isvalid(httpRequest.body.email);
            if (!isValid) {
                return badRequest(new InvalidParamError('email'))
            }
        } catch (error) {
            return{
                statusCode:500,
                body: new ServerError()
            }
        }
    }
}
export { SignUpController }