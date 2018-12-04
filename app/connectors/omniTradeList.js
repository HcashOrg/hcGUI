
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap } from "../fp";
import * as sel from "selectors"; 
import * as oa from "../actions/OmniActions";


const mapStateToProps = selectorMap({
    walletAddressBalances: sel.walletAddressBalances,
    tradeHistory:sel.tradeHistory,
    window: sel.mainWindow,
    noMoreTradeHistory:sel.noMoreTradeHistory
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    getTradeHistoryForAddress: oa.getTradeHistoryForAddress_func
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);