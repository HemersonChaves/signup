import { MissingParamError } from '../error/MissingParamErros';
import {HttpRequest, HttpResponse} from '../protocols/http';
class SignUpController{
    handle (httpRequest: HttpRequest): HttpResponse{
        if(!httpRequest.body.name){
            return {
                statusCode:400,
                body: new MissingParamError('name')
            }
        }
        if(!httpRequest.body.email){
            return {
                statusCode:400,
                body: new MissingParamError('email')
            }
        }
        
    }
}
export {SignUpController} 