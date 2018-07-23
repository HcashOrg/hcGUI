import Promise from "promise";
import { stakePoolInfo } from "middleware/stakepoolapi";
import { withLogNoData  } from "./index";

export const getStakePoolInfo = withLogNoData((testnet) =>
  new Promise((resolve, reject) =>
    stakePoolInfo(testnet,(response, error) => !response ? reject(error) : resolve(response))),
"Get Stakepool Info");
