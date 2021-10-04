import { MissingParamError } from '../error/MissingParamErros';
import {HttpRequest, HttpResponse} from '../protocols/http';
import { badRequest } from '../helpers/http-helper';
class SignUpController{
    handle (httpRequest: HttpRequest): HttpResponse{ 
        const requirFields  =['name', 'email', 'password', 'passwordConfirmation'];
        for (const field of requirFields){
            if(!httpRequest.body[field]){
                return badRequest(new MissingParamError(field));
            } 
        }     
    }
}
export {SignUpController} 