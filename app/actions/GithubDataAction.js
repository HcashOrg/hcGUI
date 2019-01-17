import * as g from "../httpService/server/githubDataApi";


export const githubDataConfigAttempt = () => (dispatch, getState) => {
    dispatch(getDataConfig());
  }

export const GETDATACONFIG_ATTEMPT = "GETDATACONFIG_ATTEMPT";
export const GETDATACONFIG_SUCCESS = "GETDATACONFIG_SUCCESS";
export const getDataConfig = () => async (dispatch, getState) => { 
    try {
        const result = await g.getDataConfig();  
        dispatch({ ...result.data, type: GETDATACONFIG_SUCCESS });
    } catch (error) {
        console.error(error);
    }
} 