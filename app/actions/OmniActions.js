import * as sel from "selectors";
import * as wallet from "wallet";
import { getOmnitService } from '../rpcService/rpc';
import { TEST_ECO_PROPERTY } from "../config"
import {
  omni_listProperties, omni_getWalletAddressBalances, omni_send, omni_getTransaction,
  omni_getTradeHistoryForAddress, omni_getCategories, omni_listTransactions, omni_sendIssuanceFixed, omni_sendIssuanceManaged, omni_getProperty,
  omni_sendChangeIssuer, omni_sendGrant, omni_sendRevoke, omni_sendIssuanceCrowdsale, omni_getActiveCrowdsales, omni_getCrowdsale,
  omni_sendtrade, omni_sendCloseCrowdsale, omni_sendCancelTradesByPair, omni_getTrade
} from '../rpcService/server';


export const GETOMNISERVICE_ATTEMPT = "GETOMNISERVICE_ATTEMPT";
export const GETOMNISERVICE_SUCCESS = "GETOMNISERVICE_SUCCESS";
export const GETOMNISERVICE_FAILED = "GETOMNISERVICE_FAILED";
export const getOmniServiceAttempt = () => (dispatch, getState) => {
  const { grpc: { address, port } } = getState();
  dispatch({ omniService: getOmnitService(sel.isTestNet(getState()), address), type: GETOMNISERVICE_SUCCESS });

  loadOmniDataAttempt(dispatch, getState);
}


const loadOmniDataAttempt = async (dispatch, getState) => {
  await dispatch(listproperties_func());
  setTimeout(() => { dispatch(getwalletAddressBalances_func()); }, 1000);
  setTimeout(() => { dispatch(listTransactions_func({ txid: "*", indexPage: 0 })); }, 1000);
}

export const OMNIGETWALLETADDRESSBALANCES_ATTEMPT = "OMNIGETWALLETADDRESSBALANCES_ATTEMPT";
export const OMNIGETWALLETADDRESSBALANCES_SUCCESS = "OMNIGETWALLETADDRESSBALANCES_SUCCESS";
export const OMNIGETWALLETADDRESSBALANCES_FAILED = "OMNIGETWALLETADDRESSBALANCES_FAILED";

export const getwalletAddressBalances_func = () => async (dispatch, getState) => {

  try {

    const { omniService } = getState().rpc;
    const walletAddressBalances = await omni_getWalletAddressBalances(omniService)
    const walletAssetsBalances = new Map();
    if (walletAddressBalances) {
      for (const data of walletAddressBalances) {
        data.balances.forEach(item => {
          if (walletAssetsBalances.has(item.propertyid)) {
            let itemData = walletAssetsBalances.get(item.propertyid);
            itemData.balance = parseFloat(itemData.balance) + parseFloat(item.balance);
            itemData.propertyid = item.propertyid;
            itemData.addressData.push({
              address: data.address,
              balance: item.balance,
            })
            walletAssetsBalances.set(item.propertyid, itemData);
          } else {
            let itemData = {
              name: item.name,
              balance: item.balance,
              propertyid: item.propertyid,
              ecosystem: item.propertyid < TEST_ECO_PROPERTY ? 1 : 2,
              addressData: [
                {
                  address: data.address,
                  balance: item.balance,
                }
              ]
            };
            walletAssetsBalances.set(item.propertyid, itemData);
          }
        });

      }
    }

    dispatch({ type: OMNIGETWALLETADDRESSBALANCES_SUCCESS, walletAddressBalances, walletAssetsBalances: [...walletAssetsBalances.values()] })
  } catch (error) {
    console.error(error)
    dispatch({ type: OMNIGETWALLETADDRESSBALANCES_FAILED, error })
  }

}

export const OMNILISTPROPERTIES_ATTEMPT = "OMNILISTPROPERTIES_ATTEMPT";
export const OMNILISTPROPERTIES_SUCCESS = "OMNILISTPROPERTIES_SUCCESS";
export const OMNILISTPROPERTIES_FAILED = "OMNILISTPROPERTIES_FAILED";
export const listproperties_func = () => async (dispatch, getState) => {
  try {
    const { omniService } = getState().rpc;
    const listproperties = await omni_listProperties(omniService);

    let index = 0;
    while (index < listproperties.length) {

      const property = await omni_getProperty(omniService, { propertyid: listproperties[index].propertyid });
      let response = await wallet.validateAddress(sel.walletService(getState()), property.issuer);

      listproperties[index].detail = property;
      listproperties[index].isMine = response.getIsMine();
      listproperties[index].ecosystem = listproperties[index].propertyid < TEST_ECO_PROPERTY ? 1 : 2;

      listproperties[index].showName = `${listproperties[index].name}(${listproperties[index].propertyid})`;
      index++;

    }

    dispatch({ type: OMNILISTPROPERTIES_SUCCESS, listproperties })
  } catch (error) {
    console.error(error);
  }
}

export const OMNIGETPROPERTY_SUCCESS = "OMNIGETPROPERTY_SUCCESS";
export const OMNIGETPROPERTYT_FAILED = "OMNIGETPROPERTYT_FAILED";
export const getproperty_func = (propertyid) => async (dispatch, getState) => {

  try {
    const { omniService } = getState().rpc;
    const property = await omni_getProperty(omniService, { propertyid });
    dispatch({ type: OMNIGETPROPERTY_SUCCESS, property })
  } catch (error) {
    console.error(error, ' getproperty_func  error')
    dispatch({ type: OMNIGETPROPERTYT_FAILED, error })
  }
}



export const OMNIGETTRADEHISTORY_SUCCESS = "OMNIGETTRADEHISTORY_SUCCESS";
export const OMNIGETTRADEHISTORY_FAILED = "OMNIGETTRADEHISTORY_FAILED";
export const gettransaction_func = (txid) => async (dispatch, getState) => {
  try {
    const { omniService } = getState().rpc;
    const omniTransaction = await omni_getTransaction(omniService, { txid });
    dispatch({ type: OMNIGETTRADEHISTORY_SUCCESS, omniTransaction })
  } catch (error) {
    console.error(error, ' gettransaction_func  error')
    dispatch({ type: OMNIGETTRADEHISTORY_FAILED, error })
  }
}



export const OMNIGETTRADEHISTORYFORADDRESS_ATTEMPT = "OMNIGETTRADEHISTORYFORADDRESS_ATTEMPT";
export const OMNIGETTRADEHISTORYFORADDRESS_SUCCESS = "OMNIGETTRADEHISTORYFORADDRESS_SUCCESS";
export const OMNIGETTRADEHISTORYFORADDRESS_FAILED = "OMNIGETTRADEHISTORYFORADDRESS_FAILED";
export const getTradeHistoryForAddress_func = (address, reset, indexPage, callBack) => async (dispatch, getState) => {
  try {
    const { omniService, getTradeHistoryForAddressRequestAttempt, noMoreTradeHistory } = getState().rpc;

    if (getTradeHistoryForAddressRequestAttempt || (noMoreTradeHistory && !reset)) return;

    const count = 10;
    const listproperties = sel.listproperties(getState());

    let data = await omni_getTradeHistoryForAddress(omniService, { address, count: (indexPage * count) });


    data = data.map(item => {

      const propertyiddesiredObj = listproperties.find(property => property.propertyid == item.propertyiddesired);
      const propertyidforsaleObj = listproperties.find(property => property.propertyid == item.propertyidforsale);

      item.propertyiddesiredName = propertyiddesiredObj ? propertyiddesiredObj.name : "";
      item.propertyidforsaleName = propertyidforsaleObj ? propertyidforsaleObj.name : "";

      return item;
    })

    if (count * indexPage > data.length) {
      callBack && callBack({ indexPage })
    } else {
      callBack && callBack({ indexPage: indexPage + 1 })
    }

    dispatch({ type: OMNIGETTRADEHISTORYFORADDRESS_SUCCESS, tradeHistory: data, noMoreTradeHistory: (count * indexPage) > data.length })
  } catch (error) {
    console.error(error, ' gettradehistoryforaddress_func  error');
    dispatch({ type: OMNIGETTRADEHISTORYFORADDRESS_FAILED, error })
  }
}

export const OMNISEND_FAILED = "OMNISEND_FAILED";

export const send_func = (params, callBack) => async (dispatch, getState) => {
  try {
    const { omniService } = getState().rpc;
    await omni_send(omniService, params);
    loadOmniDataAttempt(dispatch, getState);
    callBack && callBack();
  } catch (error) {
    console.error(error, ' send_func  error ');
    dispatch({ type: OMNISEND_FAILED, error })
  }
}


export const OMNISENDISSUANCEFIXED_SUCCESS = "OMNISENDISSUANCEFIXED_SUCCESS";
export const OMNISENDISSUANCEFIXED_FAILED = "OMNISENDISSUANCEFIXED_FAILED";
export const sendIssuanceFixed_func = (params, callBack) => async (dispatch, getState) => {
  try {
    const { omniService } = getState().rpc;
    await omni_sendIssuanceFixed(omniService, params);
    dispatch({ type: OMNISENDISSUANCEFIXED_SUCCESS });
    callBack && callBack();
    loadOmniDataAttempt(dispatch, getState);
  } catch (error) {
    console.error(error, ' sendissuancefixed_func  error ')
    dispatch({ type: OMNISENDISSUANCEFIXED_FAILED, error })
  }
}

export const OMNISENDISSUANCEMANAGED_SUCCESS = "OMNISENDISSUANCEMANAGED_SUCCESS";
export const OMNISENDISSUANCEMANAGED_FAILED = "OMNISENDISSUANCEMANAGED_FAILED";
export const sendIssuanceManaged_func = (params, callBack) => async (dispatch, getState) => {
  try {
    const { omniService } = getState().rpc;
    await omni_sendIssuanceManaged(omniService, params);
    dispatch({ type: OMNISENDISSUANCEFIXED_SUCCESS });
    callBack && callBack();
    loadOmniDataAttempt(dispatch, getState);
  } catch (error) {
    console.error(error, ' sendissuancemanaged_func  error ')
    dispatch({ type: OMNISENDISSUANCEMANAGED_FAILED, error })
  }
}
export const OMNISENDISSUANCECROWDSALE_FAILED = "OMNISENDISSUANCECROWDSALE_FAILED";
export const sendIssuanceCrowdsale_func = (params, callBack) => async (dispatch, getState) => {
  try {
    const { omniService } = getState().rpc;
    await omni_sendIssuanceCrowdsale(omniService, params);
    callBack && callBack();
    loadOmniDataAttempt(dispatch, getState);
  } catch (error) {
    console.error(error, ' sendIssuanceCrowdsale_func  error ')
    dispatch({ type: OMNISENDISSUANCECROWDSALE_FAILED, error })
  }
}


export const OMNILISTTRANSACTIONS_ATTEMPT = "OMNILISTTRANSACTIONS_ATTEMPT";
export const OMNILISTTRANSACTIONS_SUCCESS = "OMNILISTTRANSACTIONS_SUCCESS";
export const OMNILISTTRANSACTIONS_FAILED = "OMNILISTTRANSACTIONS_FAILED";

export const listTransactions_func = ({ txid, indexPage, callBack }) => async (dispatch, getState) => {
  try {

    const { omniService, ListTransactions, listtransactionsRequestAttempt, noMoreTransactions } = getState().rpc;
    if (listtransactionsRequestAttempt || (noMoreTransactions && indexPage != 0)) return;

    await dispatch({ type: OMNILISTTRANSACTIONS_ATTEMPT });
    const pageCount = 10;
    let list = [];

    const getListTransactions = await omni_listTransactions(omniService, { txid, count: pageCount, skip: (parseInt(indexPage) * pageCount) });


    if (indexPage == 0) {

      list = getListTransactions
    } else {
      list = ListTransactions ? [...ListTransactions, ...getListTransactions] : getListTransactions;

    }

    const listproperties = sel.listproperties(getState());

    list = list.map(item => {
      if (item.propertyid) {
        const property = listproperties.find(property => property.propertyid == item.propertyid);
        item.showAssetsName = property ? property.name : "--";
      } else {
        item.showAssetsName = "--";
      }
      return item;
    })


    await dispatch({ type: OMNILISTTRANSACTIONS_SUCCESS, ListTransactions: list, noMoreTransactions: getListTransactions.length < pageCount });

    if (getListTransactions.length < 10) {
      callBack && callBack({ indexPage })
    } else {
      callBack && callBack({ indexPage: indexPage + 1 })
    }
  } catch (error) {
    console.error(error, 'listTransactions_func error')
    await dispatch({ type: OMNILISTTRANSACTIONS_FAILED, error, noMoreTransactions: true });
  }
}
export const OMNISENDCHANGEISSUER_SUCCESS = "OMNISENDCHANGEISSUER_SUCCESS";
export const OMNISENDCHANGEISSUER_FAILED = "OMNISENDCHANGEISSUER_FAILED";
export const sendChangeIssuer_func = (params, callBack) => async (dispatch, getState) => {
  try {
    const { omniService } = getState().rpc;
    const data = await omni_sendChangeIssuer(omniService, params);
    callBack && callBack()
    loadOmniDataAttempt(dispatch, getState);
  } catch (error) {
    console.error(error, ' sendissuancefixed_func  error ')
    dispatch({ type: OMNISENDCHANGEISSUER_FAILED, error })
  }
}

export const OMNISENDGRANT_SUCCESS = "OMNISENDGRANT_SUCCESS";
export const OMNISENDGRANT_FAILED = "OMNISENDGRANT_FAILED";
export const sendGrant_func = (params, callBack) => async (dispatch, getState) => {
  try {
    const { omniService } = getState().rpc;
    const data = await omni_sendGrant(omniService, params);
    callBack && callBack()
    loadOmniDataAttempt(dispatch, getState);
  } catch (error) {
    console.error(error, ' sendissuancefixed_func  error ')
    dispatch({ type: OMNISENDGRANT_FAILED, error })
  }
}

export const OMNISENDREVOKE_SUCCESS = "OMNISENDREVOKE_SUCCESS";
export const OMNISENDREVOKE_FAILED = "OMNISENDREVOKE_FAILED";
export const sendrevoke_func = (params, callBack) => async (dispatch, getState) => {
  try {
    const { omniService } = getState().rpc;
    const data = await omni_sendRevoke(omniService, params);
    callBack && callBack()
    loadOmniDataAttempt(dispatch, getState);
  } catch (error) {
    console.error(error, ' sendissuancefixed_func  error ')
    dispatch({ type: OMNISENDREVOKE_FAILED, error })
  }
}

export const OMNIGETACTIVECROWDSALES_SUCCESS = "OMNIGETACTIVECROWDSALES_SUCCESS";
export const getActiveCrowdsales_func = () => async (dispatch, getState) => {
  try {
    const { omniService } = getState().rpc;
    let activeCrowdsales = await omni_getActiveCrowdsales(omniService);
    const listproperties = sel.listproperties(getState());

    let index = 0;
    while (index < activeCrowdsales.length) {
      const item = activeCrowdsales[index];

      const property = listproperties ? listproperties.find(p => p.propertyid == item.propertyiddesired) : null;
      item.assetsName = property ? property.name : "";


      const crowdsales = await omni_getCrowdsale(omniService, { propertyid: item.propertyid });
      item.detail = crowdsales;

      index++;

    }

    dispatch({ type: OMNIGETACTIVECROWDSALES_SUCCESS, activeCrowdsales })
  } catch (error) {
    console.error(error, ' getActiveCrowdsales_func  error ')
  }
}
export const OMNIGETCROWDSALE_SUCCESS = "OMNIGETCROWDSALE_SUCCESS";
export const OMNIGETCROWDSALE_FAILED = "OMNIGETCROWDSALE_FAILED";
export const getCrowdsale_fun = propertyid => async (dispatch, getState) => {
  try {
    const { omniService } = getState().rpc;
    let crowdsale = await omni_getCrowdsale(omniService, { propertyid: parseInt(propertyid) });
    const listproperties = sel.listproperties(getState());

    const property = listproperties ? listproperties.find(p => p.propertyid == crowdsale.propertyiddesired) : null;
    crowdsale.assetsName = property ? property.name : "";
    dispatch({ type: OMNIGETCROWDSALE_SUCCESS, crowdsale })
    return crowdsale;
  } catch (error) {
    console.error(error, ' getCrowdsale_fun  error '); 
    dispatch({ type: OMNIGETCROWDSALE_FAILED, error })
    return null;
  }
}


export const OMNISENDTRADE_FAILED = "OMNISENDTRADE_FAILED";
export const sendTrade_func = (params, callBack) => async (dispatch, getState) => {

  try {
    const { omniService } = getState().rpc;
    await omni_sendtrade(omniService, params);
    callBack && callBack();
  } catch (error) {
    console.error(error, ' sendTrade_func  error ')
    dispatch({ type: OMNISENDTRADE_FAILED, error })
  }
}

export const OMNISENDCLOSECROWDSALE_FAILED = "OMNISENDCLOSECROWDSALE_FAILED";
export const sendCloseCrowdsale_func = (params, callBack) => async (dispatch, getState) => {
  try {
    const { omniService } = getState().rpc;
    await omni_sendCloseCrowdsale(omniService, params);
    callBack && callBack();
  } catch (error) {
    console.error(error, ' sendCloseCrowdsale_func  error ')
    dispatch({ type: OMNISENDCLOSECROWDSALE_FAILED, error })
  }
}

export const OMNISENDCANCELTRADEESBYPAIR_FAILED = "OMNISENDCANCELTRADEESBYPAIR_FAILED";
export const sendCancelTradesByPair_func = (params, callBack) => async (dispatch, getState) => {
  try {
    const { omniService } = getState().rpc;
    await omni_sendCancelTradesByPair(omniService, params);
    callBack && callBack();
  } catch (error) {
    console.error(error, ' sendCancelTradesByPair_func  error ')
    dispatch({ type: OMNISENDCLOSECROWDSALE_FAILED, error })
  }
}

export const OMNIGETTRADE_SUCCESS = "OMNIGETTRADE_SUCCESS";
export const OMNIGETTRADE_FAILED = "OMNIGETTRADE_FAILED";
export const getTrade_func = txid => async (dispatch, getState) => {
  try {
    const { omniService } = getState().rpc;
    let trade = await omni_getTrade(omniService, { txid });
    const response = await wallet.validateAddress(sel.walletService(getState()), trade.sendingaddress);

    trade.isMine = response.getIsMine();

    dispatch({ type: OMNIGETTRADE_SUCCESS, trade });
  } catch (error) {
    console.error(error, ' sendCancelTradesByPair_func  error ')
    dispatch({ type: OMNIGETTRADE_FAILED, error })
  }
}


export const getCategories = () => async (dispatch, getState) => {
  return omni_getCategories();
}