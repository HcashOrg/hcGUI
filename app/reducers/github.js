import {
    GETDATACONFIG_ATTEMPT,
    GETDATACONFIG_SUCCESS,
    GETDATACONFIG_FAILED
} from "../actions/GithubDataAction";

export default function rpc(state = {}, action) {
    switch (action.type) {
        case GETDATACONFIG_ATTEMPT:
            return {
                ...state,
                getDataConfigAttempt: true
            };
        case GETDATACONFIG_FAILED:
            return {
                ...state,
                getDataConfigAttempt: true
            };
        case GETDATACONFIG_SUCCESS:
            return {
                ...state,
                advertising_space: action.advertising_space,
                body: action.body,
                tag_name: action.tag_name,
                assets: action.assets,
                getDataConfigAttempt: false
            };

        default:
            return state;
    }
}