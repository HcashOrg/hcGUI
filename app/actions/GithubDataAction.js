import * as g from "../httpService/server/githubDataApi";


export const githubDataConfigAttempt = () => (dispatch, getState) => {
    dispatch(getDataConfig());
  }

export const GETDATACONFIG_ATTEMPT = "GETDATACONFIG_ATTEMPT";
export const GETDATACONFIG_SUCCESS = "GETDATACONFIG_SUCCESS";
export const getDataConfig = () => async (dispatch, getState) => { 
    try {
        const result = await g.getDataConfig();  
        const releasesData=await g.getReleasesData();
        const releaseDtata=await g.getReleaseData(releasesData.data[0].url);

        const body=releaseDtata.data.body;
        const tag_name = releaseDtata.data.tag_name;
        const assets=releaseDtata.data.assets.map(m=>{
            return m.browser_download_url
        })
        
        dispatch({ ...result.data,tag_name,assets,body, type: GETDATACONFIG_SUCCESS });
    } catch (error) {
        console.error(error);
    }
} 