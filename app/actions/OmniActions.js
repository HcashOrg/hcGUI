import * as sel from "selectors";
import {getOmnitService} from '../rpcService/rpc';
import {omni_getwalletbalances,omni_listproperties, omni_getinfo} from '../rpcService/server';


//新增 Omni服务  存放于 rpc Store中
export const GETOMNISERVICE_ATTEMPT = "GETOMNISERVICE_ATTEMPT";
export const GETOMNISERVICE_SUCCESS = "GETOMNISERVICE_SUCCESS";
export const GETOMNISERVICE_FAILED = "GETOMNISERVICE_FAILED";
export const getOmniServiceAttempt = () => (dispatch,getState)=>{ 
  const { grpc: { address, port } } = getState(); 
  dispatch({omniService:getOmnitService(sel.isTestNet(getState()),address),type:GETOMNISERVICE_SUCCESS});
}

export const testOmni = () => async (dispatch, getState) => { 
    const {omniService} = getState().rpc; 
    
    const aa = await  omni_listproperties(omniService)  
  
    const bb =await  omni_getinfo(omniService) 
  
    const cc =await  omni_getwalletbalances(omniService)  


    console.log(aa,bb,cc,'testOmnitestOmnitestOmni================================')
   
}  