
import {IAccount} from "../models/IAccount";

interface IAddAccountModel{
    name:string
    email:string
    password: string
}

interface IAddAccount{
    add (accountData: IAddAccountModel): Promise<IAccount>
}
export {IAddAccount, IAddAccountModel}