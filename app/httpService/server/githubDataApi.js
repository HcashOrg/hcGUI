import {get} from "../http";
import {githubConfig} from "../../config"

export const getDataConfig = () =>get(githubConfig.dataURL,"?d="+new Date().getTime());