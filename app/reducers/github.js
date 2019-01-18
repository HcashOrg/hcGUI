import { 
    GETDATACONFIG_ATTEMPT,
    GETDATACONFIG_SUCCESS
} from "../actions/GithubDataAction";

export default function rpc(state = {}, action) {
    switch (action.type) {
        case GETDATACONFIG_SUCCESS:
            return {
                ...state, 
                advertising_space:action.advertising_space,
                body:action.body,
                tag_name:action.tag_name,
                assets:action.assets
            };
         
        default:
            return state;
    }
}