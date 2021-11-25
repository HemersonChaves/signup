import { Encrypter } from "data/protocols/Encrypter";
import { IAccount } from "domain/models/IAccount";
import { IAddAccount, IAddAccountModel } from "domain/usecases/IAddAccount";

class DbAddAccount implements IAddAccount {
    private readonly encrypter: Encrypter;
    constructor(encrypter: Encrypter) {
        this.encrypter = encrypter;
    }
    async add(account: IAddAccountModel): Promise<IAccount> {
        await this.encrypter.encrypt(account.password);
        return new Promise(resolve => resolve(null));
    }
}

export { DbAddAccount }