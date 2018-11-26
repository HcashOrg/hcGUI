import {
    GETOMNISERVICE_ATTEMPT, GETOMNISERVICE_SUCCESS, GETOMNISERVICE_FAILED, OMNIGETWALLETADDRESSBALANCES_SUCCESS, OMNIGETWALLETADDRESSBALANCES_FAILED
    , OMNILISTPROPERTIES_SUCCESS, OMNIGETTRADEHISTORYFORADDRESS_SUCCESS, OMNIGETTRADEHISTORYFORADDRESS_FAILED, OMNILISTTRANSACTIONS_SUCCESS,
    OMNILISTTRANSACTIONS_ATTEMPT, OMNILISTTRANSACTIONS_FAILED, OMNIGETTRADEHISTORY_SUCCESS, OMNIGETTRADEHISTORY_FAILED,
    OMNISENDISSUANCEFIXED_SUCCESS, OMNISENDISSUANCEFIXED_FAILED, OMNIGETPROPERTY_SUCCESS,
    OMNIGETACTIVECROWDSALES_SUCCESS
} from "../actions/OmniActions";

export default function rpc(state = {}, action) {
    switch (action.type) {
        case GETOMNISERVICE_ATTEMPT:
            return {
                ...state,
                getOmniServiceError: "",
                getOmniServiceRequestAttempt: true,
            };
        case GETOMNISERVICE_FAILED:
            return {
                ...state,
                getOmniServiceError: String(action.error),
                getOmniServiceRequestAttempt: false,
            };
        case GETOMNISERVICE_SUCCESS:
            return {
                ...state,
                getOmniServiceError: null,
                getOmniServiceRequestAttempt: false,
                omniService: action.omniService,
            };
        case OMNIGETWALLETADDRESSBALANCES_SUCCESS:
            return {
                ...state,
                walletAddressBalances: action.walletAddressBalances,
                walletAssetsBalances: action.walletAssetsBalances,
                getWalletAddressBalancesRequestAttempt: false
            }
        case OMNIGETWALLETADDRESSBALANCES_FAILED:
            return {
                ...state,
                getWalletAddressBalancesRequestError: String(action.error),
                getWalletAddressBalancesRequestAttempt: true
            }
        case OMNILISTPROPERTIES_SUCCESS:
            return {
                ...state,
                listproperties: action.listproperties,
                listpropertiesRequestAttempt: false
            }
        case OMNIGETTRADEHISTORYFORADDRESS_SUCCESS: {
            return {
                ...state,
                tradeHistory: action.tradeHistory,
                getTradeHistoryForAddressRequestAttempt: false
            }
        }
        case OMNIGETTRADEHISTORYFORADDRESS_FAILED:
            return {
                ...state,
                getTradeHistoryForAddressRequestError: String(action.error),
                getTradeHistoryForAddressRequestAttempt: true
            }
        case OMNILISTTRANSACTIONS_ATTEMPT:
            return {
                ...state,
                listtransactionsRequestAttempt: true
            }
        case OMNILISTTRANSACTIONS_SUCCESS:
            return {
                ...state,
                ListTransactions: action.ListTransactions,
                noMoreTransactions: action.noMoreTransactions,
                listtransactionsRequestAttempt: false
            }
        case OMNILISTTRANSACTIONS_FAILED:
            return {
                ...state,
                listtransactionsRequestError: String(action.error),
                listtransactionsRequestAttempt: true
            }
        case OMNIGETTRADEHISTORY_SUCCESS:
            return {
                ...state,
                omniTransaction: action.omniTransaction,
                gettransactionsRequestAttempt: false
            }
        case OMNIGETTRADEHISTORY_FAILED:
            return {
                ...state,
                gettransactionsRequestError: String(action.error),
                gettransactionsRequestAttempt: true
            }
        case OMNISENDISSUANCEFIXED_SUCCESS:
            return {
                ...state,
                sendissuancefixedRequestAttempt: false
            }
        case OMNISENDISSUANCEFIXED_FAILED:
            return {
                ...state,
                sendissuancefixedError: String(action.error),
                sendissuancefixedRequestAttempt: true
            }
        case OMNIGETPROPERTY_SUCCESS:
            return {
                ...state,
                property: action.property,
                getPropertyRequestAttempt: false
            }
            case OMNIGETACTIVECROWDSALES_SUCCESS:
            return {
                ...state,
                activeCrowdsales: action.activeCrowdsales,
                getActiveRowdsalesRequestAttempt: false
            }
        default:
            return state;
    }
}