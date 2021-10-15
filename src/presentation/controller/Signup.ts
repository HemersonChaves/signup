import { MissingParamError, InvalidParamError } from '../error';
import { badRequest, serverError, Ok} from '../helpers/http-helper';
import { Controller, IEmailValidator, HttpRequest, HttpResponse, IAddAccount } from './singup/SignupProtocols';

class SignUpController implements Controller {
    private readonly emailValidator: IEmailValidator;
    private readonly addAccount: IAddAccount;

    constructor(emailValidator: IEmailValidator, addAccount: IAddAccount) {
        this.emailValidator = emailValidator;
        this.addAccount = addAccount;
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
            const account = this.addAccount.add({
                name,
                email,
                password
            });
            return Ok(account);
        } catch (error) {
            return serverError();            
        }
    }
}
export { SignUpController }