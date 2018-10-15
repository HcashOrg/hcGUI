import {
    GETOMNISERVICE_ATTEMPT,GETOMNISERVICE_SUCCESS,GETOMNISERVICE_FAILED
  } from "../actions/OmniActions";

export default function rpc(state = {}, action) {
    switch (action.type) {
        case GETOMNISERVICE_ATTEMPT:
            return{
                ...state,
                getOmniServiceError: "",
                getOmniServiceRequestAttempt: true,
            };
        case GETOMNISERVICE_FAILED:
            return {
                ...state,
                getOmniServiceError: String(action.error),
                getOmniServiceRequestAttempt: false,
            };
        case GETOMNISERVICE_SUCCESS: 
            return {
                ...state,
                getOmniServiceError: null,
                getOmniServiceRequestAttempt: false,
                omniService: action.omniService,
            };
        default:
            return state; 
    }
}