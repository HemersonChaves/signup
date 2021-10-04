import { SignUpController } from "./Signup";
import { MissingParamError } from "../error/MissingParamErros";

describe('Signup Controller', () => {
    test('should return 400 if no name is provided', ()=>{
        const sut = new SignUpController();
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
        const sut = new SignUpController();
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
        const sut = new SignUpController();
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
        const sut = new SignUpController();
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
    
});

