import { walletMethod } from './contect';

import { objToArray } from "helpers";

export function wallet_spassphrase(rpcRequestService,params){
    return rpcRequestService(walletMethod.passphrase,objToArray(params));
}
 