import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap } from "../fp";
import * as sel from "selectors"; 
import * as oa from "../actions/OmniActions"


const mapStateToProps = selectorMap({
    walletAddressBalances: sel.walletAddressBalances,
    tradeHistory:sel.tradeHistory,
    noMoreTransactions:sel.omniNoMoreTransactions,
    listTransactions:sel.omniListTransactions,
    window: sel.mainWindow,
    listproperties:sel.listproperties,
    omniTransaction:sel.omniTransaction,
  });
  
  const mapDispatchToProps = (dispatch) => bindActionCreators({  
    getListtransactions:oa.listtransactions_func,
    gettransaction:oa.gettransaction_func
  }, dispatch);
  
  export default connect(mapStateToProps,mapDispatchToProps);