
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap } from "../fp";
import * as sel from "selectors";
import * as ca from "../actions/ControlActions";
import * as oa from "../actions/OmniActions";


const mapStateToProps = selectorMap({ 
  listproperties:sel.listproperties,
    walletAssetsBalances: sel.walletAssetsBalances, 
  }); 

  const mapDispatchToProps = (dispatch) => bindActionCreators({
    validateAddress: ca.validateAddress,
    sendTrade:oa.sendTrade_func,
    
  }, dispatch);
  
  export default connect(mapStateToProps,mapDispatchToProps);