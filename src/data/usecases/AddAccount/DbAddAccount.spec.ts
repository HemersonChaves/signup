import { Encrypter } from "data/protocols/Encrypter";
import { DbAddAccount } from "./DbAddAccount";
interface SutTypes {
    sut: DbAddAccount;
    encrypterStub: Encrypter;
}

const makeSut = (): SutTypes => {
    class EncrypterStub {
        async encrypt(value: string): Promise<string> {
            return new Promise(resolve => resolve("hashed_password"));
        }
    }
    const encrypterStub = <Encrypter> new EncrypterStub();
    const sut = new DbAddAccount(encrypterStub);

    return {
        sut,
        encrypterStub
    }
}

describe("DbAddAccount Usecase", () => {
    test("should call Encrypter with correct password", async () => {
      const { sut, encrypterStub } = makeSut();

        const encrypterSpy = jest.spyOn(encrypterStub, "encrypt");
        const accaountData = {
            name: "valid_name",
            email: "valid_email",
            password: "valid_password",
        }
        await sut.add(accaountData);
        expect(encrypterSpy).toHaveBeenCalledWith("valid_password")
    })
});