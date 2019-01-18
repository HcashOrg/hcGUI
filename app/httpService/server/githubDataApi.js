import {get} from "../http";
import {githubConfig} from "../../config"

export const getDataConfig = () =>get(githubConfig.dataURL,"?d="+new Date().getTime());
export const getReleasesData=()=>get("https://api.github.com/","repos/HcashOrg/hcGUI/releases");
export const getReleaseData = (url) =>get(url,"");