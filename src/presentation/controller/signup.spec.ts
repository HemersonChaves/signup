import { SignUpController } from "./Signup";
import { MissingParamError, InvalidParamError, ServerError } from '../error';
import { IEmailValidator, IAddAccount, IAccount, IAddAccountModel } from './singup/SignupProtocols';


interface SutTypes {
    sut: SignUpController;
    emailValidatorStub: IEmailValidator;
    addAccountStub: IAddAccount;
}
const makeEmailValidator = (): IEmailValidator => {
    class EmailValidatorStub implements IEmailValidator {
        isvalid(email: string): boolean {
            return true;
        }
    }
    return new EmailValidatorStub();
}
const makeAddAccount = (): IAddAccount => {
    class AddAccountStub implements IAddAccount {
        async add(account: IAddAccountModel): Promise<IAccount> {
            const fakeAccount: IAccount = {
                id: 'valid_id',
                name: 'valid_name',
                email: 'valid_email@email',
                password: 'valid_password'
            }
            return new Promise(resolve => resolve(fakeAccount));
        }
    }
    return new AddAccountStub();
}


const makeSut = (): SutTypes => {

    const emailValidatorStub = makeEmailValidator();
    const addAccountStub = makeAddAccount();
    const sut = new SignUpController(emailValidatorStub, addAccountStub);
    return {
        sut,
        emailValidatorStub,
        addAccountStub
    }
}
describe('Signup Controller', () => {
    test('should return 400 if no name is provided', async () => {
        const { sut } = makeSut();
        const httpRequest = {
            body: {

                email: 'any_email@mail.com',
                password: 'any_123',
                passwordConfirmation: 'any_123'
            }
        }
        const httpResponse =  await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamError('name'));
    });
    test('should return 400 if no email is provided', async () => {
        const { sut } = makeSut();
        const httpRequest = {
            body: {

                name: 'any_name',
                password: 'any_123',
                passwordConfirmation: 'any_123'
            }
        }
        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamError('email'));
    });
    test('should return 400 if no password is provided', async () => {
        const { sut } = makeSut();
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                passwordConfirmation: 'any_123'
            }
        }
        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamError('password'));
    });
    test('should return 400 if no passwordConfirmation is provided', async () => {
        const { sut } = makeSut();
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_123'
            }
        }
        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'));
    });
    test('should return 400 if no passwordConfirmation fail', async () => {
        const { sut } = makeSut();
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_123',
                passwordConfirmation: 'invalid_123'
            }
        }
        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'));
    });
    test('should return 400 if an invalid email is provided', async () => {
        const { sut, emailValidatorStub } = makeSut();

        jest.spyOn(emailValidatorStub, 'isvalid').mockReturnValueOnce(false);
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'invalid_email@mail.com',
                password: 'any_123',
                passwordConfirmation: 'any_123'
            }
        }
        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new InvalidParamError('email'));
    });
    test('should call AddAccount with correct values', async () => {
        const { sut, addAccountStub } = makeSut();

        const addSpy = jest.spyOn(addAccountStub, 'add');
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_123',
                passwordConfirmation: 'any_123'
            }
        }
        await sut.handle(httpRequest);
        expect(addSpy).toHaveBeenCalledWith({
            name: 'any_name',
            email: 'any_email@mail.com',
            password: 'any_123'
        });
    });
    test('should call  EmailValidator with correct email', async () => {
        const { sut, emailValidatorStub } = makeSut();

        const isValidSpy = jest.spyOn(emailValidatorStub, 'isvalid');
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_123',
                passwordConfirmation: 'any_123'
            }
        }
        await sut.handle(httpRequest);
        expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com');
    });
    test('should return 500 if EmailValidator throws', async () => {

        // const emailValidatorStub =  makeEmailValidatorWhitError();
        const { sut, emailValidatorStub } = makeSut();

        // const sut = new SignUpController( emailValidatorStub);

        jest.spyOn(emailValidatorStub, 'isvalid').mockImplementationOnce(() => {
            throw new Error();
        })
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_123',
                passwordConfirmation: 'any_123'
            }
        }
        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body).toEqual(new ServerError());
    });
    test('should return 500 if AddAccount throws', async () => {

        // const emailValidatorStub =  makeEmailValidatorWhitError();
        const { sut, addAccountStub } = makeSut();

        // const sut = new SignUpController( emailValidatorStub);

        jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
            return new Promise((resolve, reject) => reject( new Error()));
        })
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_123',
                passwordConfirmation: 'any_123'
            }
        }
        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body).toEqual(new ServerError());
    });
    test('should return 200 if valid data is provided', async () => {
        const { sut } = makeSut();
        const httpRequest = {
            body: {
                name: 'valid_name',
                email: 'valid_email@email',
                password: 'valid_password',
                passwordConfirmation: 'valid_password'
            }
        }
        
        const httpResponse = await sut.handle(httpRequest);
      
        expect(httpResponse.statusCode).toBe(200);
        expect(httpResponse.body).toEqual({
            id: 'valid_id',
            name: 'valid_name',
            email: 'valid_email@email',
            password: 'valid_password'
        });
    });
});