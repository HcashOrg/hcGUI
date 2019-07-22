import {
    ai_ifainoderegisted, ai_unRegisterAiNode, ai_registerAiNode,
} from '../rpcService/server/aiServer';

export const AI_IFAINODEREGISTED_SETTINGS ='AI_IFAINODEREGISTED_SETTINGS';

export const ifAINodeRegisted_func = () => async (dispatch, getState) => {

    try {
        const { rpcRequestService } = getState().rpc;
        const ifainoderegisted = await ai_ifainoderegisted(rpcRequestService); 
        dispatch({ type: AI_IFAINODEREGISTED_SETTINGS,ifainoderegisted });
    } catch (e) {

    }
}

export const registerAiNode_func = () => async (dispatch, getState) => {

    try {
        const { rpcRequestService } = getState().rpc;
        await ai_registerAiNode(rpcRequestService)
        dispatch(ifAINodeRegisted_func())
    } catch (e) {

    }
}

export const unRegisterAiNode_func = () => async (dispatch, getState) => {

    try {
        const { rpcRequestService } = getState().rpc;
        await ai_unRegisterAiNode(rpcRequestService);
        dispatch(ifAINodeRegisted_func())
    } catch (e) {

    }
}