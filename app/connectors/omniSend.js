
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap } from "../fp";
import * as sel from "selectors";
import * as ca from "../actions/ControlActions";
import * as oa from "../actions/OmniActions";


const mapStateToProps = selectorMap({ 
    walletAssetsBalances: sel.walletAssetsBalances,
    unsignedTransaction: sel.unsignedTransaction,  
    nextAddressAccount: sel.nextAddressAccount,
  }); 

  const mapDispatchToProps = (dispatch) => bindActionCreators({
    validateAddress: ca.validateAddress,
    send_func:oa.send_func,
    onAttemptSignTransaction: ca.signTransactionAttempt,
    onAttemptConstructTransaction:ca.constructTransactionAttempt,
    getwalletaddressbalances:oa.getwalletAddressBalances_func
  }, dispatch);
  
  export default connect(mapStateToProps,mapDispatchToProps);