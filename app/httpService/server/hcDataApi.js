import {get} from "../http";

export const getTreasuryInfo = (daURL,treasuryAddress) =>get(daURL,`/address/${treasuryAddress}/totals`);