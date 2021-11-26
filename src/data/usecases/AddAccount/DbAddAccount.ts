import { IAddAccount, IAddAccountModel, IAccount, Encrypter, IAddAccountRepository } from "./db-add-account-protocols";

class DbAddAccount implements IAddAccount {
    private readonly encrypter: Encrypter;
    private readonly addAccountRespository: IAddAccountRepository;
    constructor(encrypter: Encrypter, addAccountRespository: IAddAccountRepository) {
        this.encrypter = encrypter;
        this.addAccountRespository = addAccountRespository;
    }
    async add(accountData: IAddAccountModel): Promise<IAccount> {
        const hashedPassword =  await this.encrypter.encrypt(accountData.password);
        Object.assign( accountData, {password: hashedPassword});
        await this.addAccountRespository.add( accountData as unknown as IAddAccount);
        return new Promise(resolve => resolve(null));
    }
}

export { DbAddAccount }