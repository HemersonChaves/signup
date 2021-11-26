import { IAccount } from "domain/models/IAccount";
import { IAddAccount } from "domain/usecases/IAddAccount";

interface IAddAccountRepository {
     add(AccountData: IAddAccount): Promise<IAccount>;

}

export { IAddAccountRepository }