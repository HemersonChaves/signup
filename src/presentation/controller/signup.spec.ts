import { SignUpController } from "./Signup";
import { MissingParamError, InvalidParamError, ServerError  } from '../error';
import { IEmailValidator } from "../protocols";

interface SutTypes{
    sut: SignUpController;
    emailValidatorStub: IEmailValidator;
}
const makeEmailValidator = () : IEmailValidator => {
    class EmailValidatorStub implements IEmailValidator{
        isvalid (email:string):boolean{
            return true;
        }
    }
    return new EmailValidatorStub();
}

const makeSut = () : SutTypes =>{
    
    const emailValidatorStub =  makeEmailValidator();
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
    test('should return 500 if EmailValidator throws', ()=>{
        
        // const emailValidatorStub =  makeEmailValidatorWhitError();
        const {sut, emailValidatorStub} = makeSut();
         
        // const sut = new SignUpController( emailValidatorStub);
        
        jest.spyOn(emailValidatorStub, 'isvalid').mockImplementationOnce(() =>{
            throw new Error();
        })
        const httpRequest = {
            body:{                
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_123',
                passwordConfirmation: 'any_123'
            }
        }
        const httpResponse = sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body).toEqual(new ServerError());
    });
});

