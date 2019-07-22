import { aiMethod } from './contect';
import { objToArray } from "helpers";

export function ai_sendtoaddress(rpcRequestService,params){
    return rpcRequestService(aiMethod.aisendtoaddress,objToArray(params));
}

export function ai_ifainoderegisted(rpcRequestService){
    return rpcRequestService(aiMethod.ifainoderegisted);
}

export function ai_registerAiNode(rpcRequestService){
    return rpcRequestService(aiMethod.registerainode);
}

export function ai_unRegisterAiNode(rpcRequestService){
    return rpcRequestService(aiMethod.unregisterainode);
}