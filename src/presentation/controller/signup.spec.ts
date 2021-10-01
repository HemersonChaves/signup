import { SignUpController } from "./Signup";

describe('Signup Controller', () => {
    test('should return 400 if no name is provided', ()=>{
        const sut = new SignUpController();
        const httpRequest = {
            body:{
                
                email: 'any_email@mail.com',
                password: 'any_123',
                ásswordConfirmation: 'any_123'
            }
        }
        const httpResponse = sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new Error('Missing param: name'));
    });
    
});

