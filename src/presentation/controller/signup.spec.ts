import { SignUpController } from "./Signup";
import { MissingParamError } from "../error/MissingParamErros";
import { InvalidParamError } from "../error/InvalidParamErros";
import { IEmailValidator } from "../protocols/emailValidator";

interface SutTypes{
    sut: SignUpController;
    emailValidatorStub: IEmailValidator;
}

const makeSut = () : SutTypes =>{
    class EmailValidatorStub implements IEmailValidator{
        isvalid (email:string):boolean{
            return true;
        }
    }
    const emailValidatorStub = new EmailValidatorStub();
    const sut = new SignUpController( emailValidatorStub);
    return {
        sut,
        emailValidatorStub
    }
}
describe('Signup Controller', () => {
    test('should return 400 if no name is provided', ()=>{
        const { sut } = makeSut();
        const httpRequest = {
            body:{
                
                email: 'any_email@mail.com',
                password: 'any_123',
                passwordConfirmation: 'any_123'
            }
        }
        const httpResponse = sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamError('name'));
    });
    test('should return 400 if no name is provided', ()=>{
        const { sut } = makeSut();
        const httpRequest = {
            body:{
                
                name: 'any_name',
                password: 'any_123',
                passwordConfirmation: 'any_123'
            }
        }
        const httpResponse = sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamError('email'));
    });
    
    test('should return 400 if no password is provided', ()=>{
        const { sut } = makeSut();
        const httpRequest = {
            body:{                
                name: 'any_name',
                email: 'any_email@mail.com',
                passwordConfirmation: 'any_123'
            }
        }
        const httpResponse = sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamError('password'));
    });
    test('should return 400 if no passwordConfirmation is provided', ()=>{
        const { sut } = makeSut();
        const httpRequest = {
            body:{                
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_123'
            }
        }
        const httpResponse = sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'));
    });
    test('should return 400 if an invalid email is provided', ()=>{
        const { sut, emailValidatorStub } = makeSut();

        jest.spyOn(emailValidatorStub, 'isvalid').mockReturnValueOnce(false);
        const httpRequest = {
            body:{                
                name: 'any_name',
                email: 'invalid_email@mail.com',
                password: 'any_123',
                passwordConfirmation: 'any_123'
            }
        }
        const httpResponse = sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new InvalidParamError('email'));
    });
    test('should call  EmailValidator with correct email', ()=>{
        const { sut, emailValidatorStub } = makeSut();

        const isValidSpy = jest.spyOn(emailValidatorStub, 'isvalid');
        const httpRequest = {
            body:{                
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_123',
                passwordConfirmation: 'any_123'
            }
        }
        sut.handle(httpRequest);
        expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com');
    });
    
});

