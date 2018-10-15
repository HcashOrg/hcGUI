import {omniMethod} from './contect';

export function omni_listproperties(omniService,params){  
    return  omniService(omniMethod.listproperties,params);
}

export function omni_getinfo(omniService,params){
    return  omniService(omniMethod.getinfo ,params);
}

export function omni_getwalletbalances(omniService,params){
    return omniService(omniMethod.getwalletbalances ,params);
}
 