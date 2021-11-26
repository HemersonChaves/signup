import { Encrypter, IAccount, IAddAccount, IAddAccountRepository } from "./db-add-account-protocols";
import { DbAddAccount } from "./DbAddAccount";
interface SutTypes {
    sut: DbAddAccount;
    encrypterStub: Encrypter;
    addAccountRespositoryStub: IAddAccountRepository;
}

const makeAddAccountRepository = (): IAddAccountRepository => {
    class AddAccountRepositoryStub implements IAddAccountRepository {
        async add(AccountData: IAddAccount): Promise<IAccount> {
            const fakeAccount = {
                id: 'valid_id',
                name: 'valid_name',
                email: 'valid_email@email',
                password: 'hashed_password'
            }
            return new Promise(resolve => resolve(fakeAccount));
        }
    }
    return new AddAccountRepositoryStub();
}
const makeEncrypter = (): Encrypter => {
    class EncrypterStub implements Encrypter {
        async encrypt(value: string): Promise<string> {
            return new Promise(resolve => resolve("hashed_password"));
        }
    }
    return new EncrypterStub();
}
const makeSut = (): SutTypes => {

    const encrypterStub = makeEncrypter();
    const addAccountRespositoryStub = makeAddAccountRepository()
    const sut = new DbAddAccount(encrypterStub, addAccountRespositoryStub);

    return {
        sut,
        encrypterStub,
        addAccountRespositoryStub
    }
}

describe("DbAddAccount Usecase", () => {
    test("should call Encrypter with correct password", async () => {
        const { sut, encrypterStub } = makeSut();

        const encrypterSpy = jest.spyOn(encrypterStub, "encrypt");
        const accountData = {
            name: "valid_name",
            email: "valid_email",
            password: "valid_password",
        }
        await sut.add(accountData);
        expect(encrypterSpy).toHaveBeenCalledWith("valid_password")
    });
    test("should throw if Encrypter throws", async () => {
        const { sut, encrypterStub } = makeSut();

        jest.spyOn(encrypterStub, "encrypt").mockReturnValueOnce(
            new Promise((resolve, reject) =>
                reject(new Error()))
        );
        const accaountData = {
            name: "valid_name",
            email: "valid_email",
            password: "valid_password",
        }
        const PromiseAccount = sut.add(accaountData);
        await expect(PromiseAccount).rejects.toThrow();
    });
    test("should call AddAccountRepository with correct values", async () => {
        const { sut, addAccountRespositoryStub } = makeSut();

        const addSpy = jest.spyOn(addAccountRespositoryStub, "add");
        const accaountData = {
            name: "valid_name",
            email: "valid_email",
            password: "valid_password",
        }
        await sut.add(accaountData);
        expect(addSpy).toHaveBeenCalledWith(
            {
                name: "valid_name",
                email: "valid_email",
                password: "hashed_password",

            })
    });
    test("should throw if AddAccountRespository throws", async () => {
        const { sut, addAccountRespositoryStub } = makeSut();

        jest.spyOn(addAccountRespositoryStub, "add").mockReturnValueOnce(
            new Promise((resolve, reject) =>
                reject(new Error()))
        );
        const accaountData = {
            name: "valid_name",
            email: "valid_email",
            password: "valid_password",
        }
        const PromiseAccount = sut.add(accaountData);
        await expect(PromiseAccount).rejects.toThrow();
    });
    test("should return an account on success", async () => {
        const { sut } = makeSut();
        const accaountData = {
            name: "valid_name",
            email: "valid_email@email",
            password: "valid_password",
        }
        const account = await sut.add(accaountData);
        expect(account).toEqual({
            id: "valid_id",
            name: "valid_name",
            email: "valid_email@email",
            password: "hashed_password",
        })
    });

});