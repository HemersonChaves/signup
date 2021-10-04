import { MissingParamError } from '../error/MissingParamErros';
import {HttpRequest, HttpResponse} from '../protocols/http';
import { badRequest } from '../helpers/http-helper';
import { Controller } from '../protocols/controller';
import { IEmailValidator } from "../protocols/emailValidator";
import { InvalidParamError } from '../error/InvalidParamErros';


class SignUpController implements Controller {
    private readonly emailValidator: IEmailValidator;
    constructor (emailValidator: IEmailValidator){
        this.emailValidator = emailValidator;
    }
    handle (httpRequest: HttpRequest): HttpResponse{ 
        const requirFields  =['name', 'email', 'password', 'passwordConfirmation'];
        for (const field of requirFields){
            if(!httpRequest.body[field]){
                return badRequest(new MissingParamError(field));
            } 
        }     
        const isValid = this.emailValidator.isvalid(httpRequest.body.email);
        if (!isValid) {
            return badRequest(new InvalidParamError('email'))
        }
    }
}
export {SignUpController} 