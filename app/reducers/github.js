import { 
    GETDATACONFIG_ATTEMPT,
    GETDATACONFIG_SUCCESS
} from "../actions/GithubDataAction";

export default function rpc(state = {}, action) {
    switch (action.type) {
        case GETDATACONFIG_SUCCESS:
            return {
                ...state, 
                ...action 
            };
         
        default:
            return state;
    }
}